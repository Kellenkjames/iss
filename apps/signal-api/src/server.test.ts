import { createServer, request } from 'node:http';
import { afterEach, describe, expect, it } from 'vitest';
import { handleRequest } from './server';

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

  async function requestApi(path: string): Promise<{ statusCode?: number; body: string }> {
    server = createServer(handleRequest);
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
