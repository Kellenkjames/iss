import type { AiProviderResponse, ProviderConfigInput } from '@iss/ai-provider';
import { createProviderFactory, validateProviderConfig } from '@iss/ai-provider';
import { createBrowserTelemetry } from '@iss/telemetry/browser';

export interface InterpretationRequest {
  subject: string;
  context: string;
  question?: string;
}

export interface InterpretationPayload {
  subject: string;
  interpretation: string;
  question?: string;
}

export interface InterpretationResult {
  success: boolean;
  payload?: InterpretationPayload;
  summary: string;
  provider: string;
  model: string;
}

const validateRequest = (request: InterpretationRequest): void => {
  if (!request.subject.trim()) {
    throw new Error('Subject is required.');
  }
  if (!request.context.trim()) {
    throw new Error('Context is required.');
  }
};

export const buildInterpretationPrompt = (request: InterpretationRequest): string => {
  const question = request.question?.trim();
  return [
    'Interpret the following information and provide a concise, evidence-based explanation.',
    `Subject: ${request.subject.trim()}`,
    `Context: ${request.context.trim()}${question ? `\nQuestion: ${question}` : ''}`,
  ].join('\n');
};

const mapResponse = (request: InterpretationRequest, response: AiProviderResponse): InterpretationResult => ({
  success: response.success,
  payload: response.success
    ? {
        subject: request.subject.trim(),
        interpretation: response.content,
        question: request.question?.trim() || undefined,
      }
    : undefined,
  summary: response.success ? response.content : response.error?.message ?? 'Interpretation failed.',
  provider: response.provider,
  model: response.model,
});

export async function interpretInformation(
  request: InterpretationRequest,
  config: ProviderConfigInput,
): Promise<InterpretationResult> {
  validateRequest(request);
  const provider = createProviderFactory({ telemetry: createBrowserTelemetry() }).create(
    validateProviderConfig(config),
  );
  const response = await provider.complete({
    prompt: buildInterpretationPrompt(request),
    metadata: { workflow: 'interpretation-engine', source: 'interpretation-engine-app' },
  });
  return mapResponse(request, response);
}
