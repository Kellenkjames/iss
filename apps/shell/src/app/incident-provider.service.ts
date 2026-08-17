import type { AiProviderResponse } from '@iss/ai-provider';
import { createShellProvider } from './ai-provider-demo';

export interface AppWorkflowRequest {
  prompt: string;
  workflow?: string;
  source?: string;
}

export interface AppWorkflowResult<T = string> {
  success: boolean;
  provider: string;
  model: string;
  summary: string;
  payload?: T;
  error?: string;
}

export type IncidentPromptRequest = AppWorkflowRequest;
export type IncidentSummaryResult = AppWorkflowResult<string>;

export const buildWorkflowResult = <T = string>(
  response: AiProviderResponse,
  payload?: T,
): AppWorkflowResult<T> => {
  if (!response.success) {
    const errorMessage = response.error?.message ?? 'Unknown provider error';

    return {
      success: false,
      provider: response.provider,
      model: response.model,
      summary: errorMessage,
      payload,
      error: errorMessage,
    };
  }

  return {
    success: true,
    provider: response.provider,
    model: response.model,
    summary: response.content,
    payload,
  };
};

export const normalizeProviderSummary = <T = string>(
  response: AiProviderResponse,
  payload?: T,
): AppWorkflowResult<T> => buildWorkflowResult(response, payload);

export async function runAppWorkflow<T = string>(
  request: AppWorkflowRequest,
  executor: (provider: Awaited<ReturnType<typeof createShellProvider>>) => Promise<AiProviderResponse>,
  mapResult?: (response: AiProviderResponse) => T,
): Promise<AppWorkflowResult<T>> {
  const provider = createShellProvider();
  const response = await executor(provider);
  const payload = mapResult ? mapResult(response) : undefined;

  return normalizeProviderSummary(response, payload);
}

export const summarizeIncidentQueue = async (
  request: IncidentPromptRequest,
): Promise<IncidentSummaryResult> => {
  return runAppWorkflow(
    request,
    async (provider) => provider.complete({
      prompt: request.prompt,
      metadata: {
        workflow: request.workflow ?? 'incident-queue',
        source: request.source ?? 'shell-incident-service',
      },
    }),
  );
};
