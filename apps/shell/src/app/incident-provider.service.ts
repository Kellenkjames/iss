import type { AiProviderResponse } from '@iss/ai-provider';
import { createShellProvider } from './ai-provider-demo';

export interface IncidentPromptRequest {
  prompt: string;
  workflow?: string;
  source?: string;
}

export async function summarizeIncidentQueue(
  request: IncidentPromptRequest,
): Promise<AiProviderResponse> {
  const provider = createShellProvider();

  return provider.complete({
    prompt: request.prompt,
    metadata: {
      workflow: request.workflow ?? 'incident-queue',
      source: request.source ?? 'shell-incident-service',
    },
  });
}
