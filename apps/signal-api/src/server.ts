import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchGitHubSignals, type SignalApiRecord, SourceError } from './github-actions';
import { interpretRequest, InterpretationRequestError, REQUEST_LIMIT } from './interpretation';

const fixtureSignals: SignalApiRecord[] = [
  {
    id: 'sig-101',
    title: 'Release build failure',
    summary: 'Production pipeline is failing after a dependency refresh.',
    evidence: 'The build exited with an error after the telemetry package update and the issue is currently untriaged.',
    status: 'Blocked',
    owner: 'Platform team',
    confidence: 'High',
    source: {
      system: 'CI',
      recordId: 'build-2026-08-101',
      observedAt: '2026-08-25T16:30:00Z',
      freshness: 'Current',
    },
  },
];

const writeJson = (response: ServerResponse, statusCode: number, body: unknown): void => {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
};

const fixtureResponse = { source: 'fixture', signals: fixtureSignals };

const readBody = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > REQUEST_LIMIT) {
      throw new Error('body-too-large');
    }
    chunks.push(buffer);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('invalid-json');
  }
};

export const createRequestHandler = (
  environment: NodeJS.ProcessEnv = process.env,
  githubFetcher: typeof fetchGitHubSignals = fetchGitHubSignals,
) => async (
  request: IncomingMessage,
  response: ServerResponse,
): Promise<void> => {
  if (request.method === 'GET' && request.url === '/api/signals') {
    const token = environment['GITHUB_TOKEN'];
    const repository = environment['GITHUB_REPOSITORY'];
    if (!token || !repository) {
      if (environment['NODE_ENV'] === 'production') {
        writeJson(response, 503, { source: 'unavailable', error: 'Signal source configuration is unavailable.' });
      } else {
        writeJson(response, 200, fixtureResponse);
      }
      return;
    }

    try {
      const signals = await githubFetcher({ token, repository });
      writeJson(response, 200, { source: signals.length ? 'github-actions' : 'empty', signals });
    } catch (error) {
      const sourceError = error instanceof SourceError ? error : new SourceError(503, 'unavailable');
      writeJson(response, sourceError.statusCode, { source: 'unavailable', error: sourceError.message });
    }
    return;
  }

  if (request.method === 'POST' && request.url === '/api/interpretations') {
    try {
      const payload = await readBody(request);
      const result = await interpretRequest(payload, environment);
      writeJson(response, result.success ? 200 : result.error.code === 'invalid_request' ? 400 : result.error.code === 'unauthorized' ? 502 : 503, result);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message === 'body-too-large' || message === 'invalid-json' || error instanceof InterpretationRequestError) {
        writeJson(response, 400, {
          success: false,
          error: { code: 'invalid_request', message: message === 'body-too-large' ? 'Interpretation request is too large.' : 'Interpretation request is invalid.' },
        });
      } else {
        writeJson(response, 503, {
          success: false,
          error: { code: 'unavailable', message: 'Signal interpretation is unavailable.' },
        });
      }
    }
    return;
  }

  writeJson(response, 404, { error: 'Route not found.' });
};

export const handleRequest = createRequestHandler();
