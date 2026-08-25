import type { AiProviderResponse, ProviderConfigInput } from '@iss/ai-provider';
import { createProviderFactory, validateProviderConfig } from '@iss/ai-provider';
import { createBrowserTelemetry } from '@iss/telemetry/browser';

export interface SignalInterpretationRequest {
  subject: string;
  context: string;
  question?: string;
}

export interface SignalInterpretationResult {
  success: boolean;
  summary: string;
  provider: string;
  model: string;
  payload?: {
    subject: string;
    interpretation: string;
    question?: string;
  };
}

const validateRequest = (request: SignalInterpretationRequest): void => {
  if (!request.subject.trim()) {
    throw new Error('Signal subject is required.');
  }

  if (!request.context.trim()) {
    throw new Error('Signal evidence is required.');
  }
};

export const buildSignalInterpretationPrompt = (request: SignalInterpretationRequest): string => {
  const question = request.question?.trim();

  return [
    'Interpret the following signal and provide a concise, evidence-based assessment.',
    `Subject: ${request.subject.trim()}`,
    `Evidence: ${request.context.trim()}${question ? `\nQuestion: ${question}` : ''}`,
    'Keep the answer short, operationally relevant, and preserve human decision authority.',
  ].join('\n');
};

const mapResponse = (request: SignalInterpretationRequest, response: AiProviderResponse): SignalInterpretationResult => ({
  success: response.success,
  summary: response.success ? response.content : response.error?.message ?? 'Interpretation failed.',
  provider: response.provider,
  model: response.model,
  payload: response.success
    ? {
        subject: request.subject.trim(),
        interpretation: response.content,
        question: request.question?.trim() || undefined,
      }
    : undefined,
});

export async function interpretSignal(
  request: SignalInterpretationRequest,
  config: ProviderConfigInput,
): Promise<SignalInterpretationResult> {
  validateRequest(request);

  const provider = createProviderFactory({ telemetry: createBrowserTelemetry() }).create(
    validateProviderConfig(config),
  );

  const response = await provider.complete({
    prompt: buildSignalInterpretationPrompt(request),
    metadata: { workflow: 'signal-system', source: 'signal-system-app' },
  });

  return mapResponse(request, response);
}
