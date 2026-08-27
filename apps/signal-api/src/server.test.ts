import { createServer, request } from 'node:http';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchGitHubSignals, SourceError } from './github-actions';
import { createRequestHandler, handleRequest } from './server';

describe('Signal API', () => {
  let server: ReturnType<typeof createServer> | undefined;

  afterEach(() => {
    server?.close();
    server = undefined;
  });

  it('returns deterministic CI signals with provenance', async () => {
    const response = await requestApi('/api/signals');
    const body = JSON.parse(response.body) as {
      source: string;
      signals: Array<{ source: { system: string; recordId: string; observedAt: string; freshness: string } }>;
    };

    expect(response.statusCode).toBe(200);
    expect(body.source).toBe('fixture');
    expect(body.signals[0].source).toEqual({
      system: 'CI',
      recordId: 'build-2026-08-101',
      observedAt: '2026-08-25T16:30:00Z',
      freshness: 'Current',
    });
  });

  it('returns 404 for unsupported routes', async () => {
    const response = await requestApi('/api/unknown');

    expect(response.statusCode).toBe(404);
  });

  it('returns a deterministic demo interpretation without server credentials', async () => {
    const response = await requestApi('/api/interpretations', {
      method: 'POST',
      body: JSON.stringify({ subject: 'Release build failure', evidence: 'The build failed after a dependency refresh.' }),
      headers: { 'content-type': 'application/json' },
    });
    const body = JSON.parse(response.body) as { success: boolean; provider?: string; model?: string; interpretation?: string };

    expect(response.statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.provider).toBe('openai');
    expect(body.model).toBe('gpt-4o-mini');
    expect(body.interpretation).toContain('Release build failure');
  });

  it('rejects invalid interpretation requests with a fixed error union', async () => {
    const response = await requestApi('/api/interpretations', {
      method: 'POST',
      body: JSON.stringify({ subject: '', evidence: 'missing subject' }),
      headers: { 'content-type': 'application/json' },
    });
    const body = JSON.parse(response.body) as { success: boolean; error: { code: string; message: string } };

    expect(response.statusCode).toBe(400);
    expect(body).toEqual({
      success: false,
      error: { code: 'invalid_request', message: 'Interpretation request is invalid.' },
    });
  });

  it('rejects interpretation bodies larger than 6 KB', async () => {
    const response = await requestApi('/api/interpretations', {
      method: 'POST',
      body: JSON.stringify({ subject: 'Large request', evidence: 'x'.repeat(7000) }),
      headers: { 'content-type': 'application/json' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toContain('Interpretation request is too large.');
  });

  it('rejects unsupported interpretation methods', async () => {
    const response = await requestApi('/api/interpretations', { method: 'GET' });

    expect(response.statusCode).toBe(404);
  });

  it('returns a sanitized configuration error in production without credentials', async () => {
    const response = await requestApi('/api/signals', createRequestHandler({ NODE_ENV: 'production' }));

    expect(response.statusCode).toBe(503);
    expect(response.body).toContain('Signal source configuration is unavailable.');
    expect(response.body).not.toContain('token');
  });

  it('labels an empty GitHub source response explicitly', async () => {
    const response = await requestApi(
      '/api/signals',
      createRequestHandler(
        { GITHUB_TOKEN: 'server-token', GITHUB_REPOSITORY: 'Kellenkjames/iss' },
        async () => [],
      ),
    );
    const body = JSON.parse(response.body) as { source: string; signals: unknown[] };

    expect(response.statusCode).toBe(200);
    expect(body.source).toBe('empty');
    expect(body.signals).toEqual([]);
  });

  it('maps the latest GitHub workflow run into the signal contract', async () => {
    const calls: Request[] = [];
    const signals = await fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      now: () => Date.parse('2026-08-26T12:00:00Z'),
      fetchImpl: async (input, init) => {
        calls.push(new Request(input, init));
        return new Response(JSON.stringify({
          workflow_runs: [
            {
              id: 41,
              name: 'Older build',
              status: 'completed',
              conclusion: 'success',
              created_at: '2026-08-26T09:00:00Z',
              updated_at: '2026-08-26T09:30:00Z',
              html_url: 'https://github.com/Kellenkjames/iss/actions/runs/41',
            },
            {
              id: 42,
              name: 'Release build',
              status: 'completed',
              conclusion: 'failure',
              created_at: '2026-08-26T08:00:00Z',
              updated_at: '2026-08-26T09:30:00Z',
              html_url: 'https://github.com/Kellenkjames/iss/actions/runs/42',
            },
          ],
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      },
    });

    expect(signals[0]).toMatchObject({
      id: 'sig-github-42',
      title: 'Release build',
      status: 'Blocked',
      confidence: 'High',
      source: {
        recordId: 'github-actions:42',
        freshness: 'Stale',
      },
    });
    expect(calls[0].url).toContain('/repos/Kellenkjames/iss/actions/runs?per_page=10');
    expect(calls[0].headers.get('authorization')).toBe('Bearer server-token');
  });

  it('does not retry unauthorized GitHub responses', async () => {
    let calls = 0;

    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => {
        calls += 1;
        return new Response('', { status: 401 });
      },
    })).rejects.toEqual(new SourceError(503, 'unauthorized'));

    expect(calls).toBe(1);
  });

  it('does not retry forbidden GitHub responses', async () => {
    let calls = 0;

    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => {
        calls += 1;
        return new Response('', { status: 403 });
      },
    })).rejects.toEqual(new SourceError(503, 'unauthorized'));

    expect(calls).toBe(1);
  });

  it('honors a bounded Retry-After delay for rate-limited responses', async () => {
    let calls = 0;
    const signals = await fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) return new Response('', { status: 429, headers: { 'retry-after': '0' } });
        return new Response(JSON.stringify({ workflow_runs: [] }), { status: 200 });
      },
    });

    expect(calls).toBe(2);
    expect(signals).toEqual([]);
  });

  it('retries a transient server failure once', async () => {
    let calls = 0;

    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) return new Response('', { status: 503 });
        return new Response(JSON.stringify({ workflow_runs: [] }), { status: 200 });
      },
    })).resolves.toEqual([]);

    expect(calls).toBe(2);
  });

  it('retries a network failure once', async () => {
    let calls = 0;

    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => {
        calls += 1;
        if (calls === 1) throw new Error('network unavailable');
        return new Response(JSON.stringify({ workflow_runs: [] }), { status: 200 });
      },
    })).resolves.toEqual([]);

    expect(calls).toBe(2);
  });

  it('returns an empty signal list for an empty GitHub response', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => new Response(JSON.stringify({ workflow_runs: [] }), { status: 200 }),
    })).resolves.toEqual([]);
  });

  it('rejects invalid repository configuration', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'invalid-repository',
      fetchImpl: async () => new Response('', { status: 200 }),
    })).rejects.toEqual(new SourceError(503, 'malformed'));
  });

  it('marks a run older than one day as unknown freshness', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      now: () => Date.parse('2026-08-26T12:00:00Z'),
      fetchImpl: async () => new Response(JSON.stringify({
        workflow_runs: [{
          id: 43,
          name: 'Old build',
          status: 'completed',
          conclusion: 'success',
          created_at: '2026-08-24T08:00:00Z',
          updated_at: '2026-08-24T09:00:00Z',
          html_url: 'https://github.com/Kellenkjames/iss/actions/runs/43',
        }],
      }), { status: 200 }),
    })).resolves.toMatchObject([{ source: { freshness: 'Unknown' } }]);
  });

  it('applies the five-second budget while parsing the response body', async () => {
    vi.useFakeTimers();
    try {
      const result = fetchGitHubSignals({
        token: 'server-token',
        repository: 'Kellenkjames/iss',
        fetchImpl: async (_input, init) => new ResponseWithHangingBody(init?.signal),
      });
      const rejection = expect(result).rejects.toEqual(new SourceError(503, 'unavailable'));

      await vi.advanceTimersByTimeAsync(5000);
      await rejection;
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects malformed GitHub responses without creating signals', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => new Response(JSON.stringify({ workflow_runs: [{ id: 'invalid' }] }), { status: 200 }),
    })).rejects.toEqual(new SourceError(502, 'malformed'));
  });

  async function requestApi(
    path: string,
    handlerOrOptions: ((request: import('node:http').IncomingMessage, response: import('node:http').ServerResponse) => Promise<void>) | { method?: string; body?: string; headers?: Record<string, string> } = handleRequest,
  ): Promise<{ statusCode?: number; body: string }> {
    const handler = typeof handlerOrOptions === 'function' ? handlerOrOptions : handleRequest;
    server = createServer(handler);
    await new Promise<void>((resolve) => server?.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Signal API test server did not bind to a port.');
    }

    return new Promise((resolve, reject) => {
      const options = typeof handlerOrOptions === 'function' ? {} : handlerOrOptions;
      const client = request({ hostname: '127.0.0.1', port: address.port, path, method: options.method, headers: options.headers }, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => resolve({ statusCode: response.statusCode, body: Buffer.concat(chunks).toString() }));
      });
      client.on('error', reject);
      client.end(options.body);
    });
  }
});

class ResponseWithHangingBody extends Response {
  public override readonly ok = true;
  public override readonly status = 200;

  public constructor(signal: AbortSignal | null | undefined) {
    super();
    Object.defineProperty(this, 'json', {
      value: () => new Promise<unknown>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
      }),
    });
  }
}
