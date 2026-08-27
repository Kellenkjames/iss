import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchGitHubSignals, type SignalApiRecord, SourceError } from './github-actions';

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

export const createRequestHandler = (environment: NodeJS.ProcessEnv = process.env) => async (
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
      const signals = await fetchGitHubSignals({ token, repository });
      writeJson(response, 200, { source: 'github-actions', signals });
    } catch (error) {
      const sourceError = error instanceof SourceError ? error : new SourceError(503, 'unavailable');
      writeJson(response, sourceError.statusCode, { source: 'unavailable', error: sourceError.message });
    }
    return;
  }

  writeJson(response, 404, { error: 'Route not found.' });
};

export const handleRequest = createRequestHandler();
