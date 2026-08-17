import type { AiProviderResponse } from '@iss/ai-provider';
import { createShellProvider } from './ai-provider-demo';

export interface IncidentPromptRequest {
  prompt: string;
  workflow?: string;
  source?: string;
}

export interface IncidentSummaryResult {
  success: boolean;
  provider: string;
  model: string;
  summary: string;
  error?: string;
}

export async function summarizeIncidentQueue(
  request: IncidentPromptRequest,
): Promise<IncidentSummaryResult> {
  const provider = createShellProvider();
  const response: AiProviderResponse = await provider.complete({
    prompt: request.prompt,
    metadata: {
      workflow: request.workflow ?? 'incident-queue',
      source: request.source ?? 'shell-incident-service',
    },
  });

  if (!response.success) {
    return {
      success: false,
      provider: response.provider,
      model: response.model,
      summary: response.error?.message ?? 'Unknown provider error',
      error: response.error?.message ?? 'Unknown provider error',
    };
  }

  return {
    success: true,
    provider: response.provider,
    model: response.model,
    summary: response.content,
  };
}
