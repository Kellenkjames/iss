import { createServer, request } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
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

  it('returns a sanitized configuration error in production without credentials', async () => {
    const response = await requestApi('/api/signals', createRequestHandler({ NODE_ENV: 'production' }));

    expect(response.statusCode).toBe(503);
    expect(response.body).toContain('Signal source configuration is unavailable.');
    expect(response.body).not.toContain('token');
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

  it('returns an empty signal list for an empty GitHub response', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => new Response(JSON.stringify({ workflow_runs: [] }), { status: 200 }),
    })).resolves.toEqual([]);
  });

  it('rejects malformed GitHub responses without creating signals', async () => {
    await expect(fetchGitHubSignals({
      token: 'server-token',
      repository: 'Kellenkjames/iss',
      fetchImpl: async () => new Response(JSON.stringify({ workflow_runs: [{ id: 'invalid' }] }), { status: 200 }),
    })).rejects.toEqual(new SourceError(502, 'malformed'));
  });

  async function requestApi(path: string, handler = handleRequest): Promise<{ statusCode?: number; body: string }> {
    server = createServer(handler);
    await new Promise<void>((resolve) => server?.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Signal API test server did not bind to a port.');
    }

    return new Promise((resolve, reject) => {
      const client = request({ hostname: '127.0.0.1', port: address.port, path }, (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk: Buffer) => chunks.push(chunk));
        response.on('end', () => resolve({ statusCode: response.statusCode, body: Buffer.concat(chunks).toString() }));
      });
      client.on('error', reject);
      client.end();
    });
  }
});
