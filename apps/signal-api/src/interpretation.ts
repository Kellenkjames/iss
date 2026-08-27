import { createProviderFactory, validateProviderConfig, type AiProviderResponse } from '@iss/ai-provider';
import { createTelemetry } from '@iss/telemetry';

export interface InterpretationRequest {
  subject: string;
  evidence: string;
  question?: string;
}

export type InterpretationResponse =
  | { success: true; provider: string; model: string; interpretation: string }
  | { success: false; error: { code: 'invalid_request' | 'unavailable' | 'unauthorized' | 'malformed'; message: string } };

const REQUEST_LIMIT = 6 * 1024;
const MAX_INTERPRETATION_LENGTH = 8000;

export class InterpretationRequestError extends Error {
  constructor(message = 'Interpretation request is invalid.') {
    super(message);
  }
}

const invalidRequest = (): Error => new InterpretationRequestError();

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const parseRequest = (payload: unknown): InterpretationRequest => {
  if (!isRecord(payload)
    || typeof payload.subject !== 'string'
    || typeof payload.evidence !== 'string'
    || payload.subject.trim().length < 1
    || payload.subject.trim().length > 200
    || payload.evidence.trim().length < 1
    || payload.evidence.trim().length > 4000
    || (payload.question !== undefined && (typeof payload.question !== 'string' || payload.question.trim().length > 1000))) {
    throw invalidRequest();
  }

  return {
    subject: payload.subject.trim(),
    evidence: payload.evidence.trim(),
    question: typeof payload.question === 'string' && payload.question.trim() ? payload.question.trim() : undefined,
  };
};

const buildPrompt = (request: InterpretationRequest): string => [
  'Interpret the following signal and provide a concise, evidence-based assessment.',
  `Subject: ${request.subject}`,
  `Evidence: ${request.evidence}${request.question ? `\nQuestion: ${request.question}` : ''}`,
  'Keep the answer short, operationally relevant, and preserve human decision authority.',
].join('\n');

const providerConfig = (environment: NodeJS.ProcessEnv): Parameters<typeof validateProviderConfig>[0] => {
  const provider = environment['ISS_AI_PROVIDER'] ?? 'openai';
  if (provider !== 'openai') {
    throw new Error('Unsupported AI provider.');
  }
  return {
    provider,
    model: environment['OPENAI_MODEL'] ?? 'gpt-4o-mini',
    apiKey: environment['OPENAI_API_KEY'] ?? (environment['NODE_ENV'] === 'production' ? undefined : 'demo-key'),
    baseUrl: environment['OPENAI_BASE_URL'],
    organization: environment['OPENAI_ORGANIZATION'],
    defaultSystemMessage: environment['OPENAI_DEFAULT_SYSTEM_MESSAGE'
      ] ?? 'You are an operational signal review assistant. Stay concise, evidence-based, and preserve human judgment.',
  };
};

const mapResponse = (response: AiProviderResponse): InterpretationResponse => {
  if (!response.success) {
    const errorMessage = response.error?.message?.toLowerCase() ?? '';
    return {
      success: false,
      error: {
        code: errorMessage.includes('api key') || errorMessage.includes('unauthorized') ? 'unauthorized' : 'unavailable',
        message: 'Signal interpretation is unavailable.',
      },
    };
  }

  return {
    success: true,
    provider: response.provider,
    model: response.model,
    interpretation: response.content.slice(0, MAX_INTERPRETATION_LENGTH),
  };
};

export async function interpretRequest(
  payload: unknown,
  environment: NodeJS.ProcessEnv = process.env,
): Promise<InterpretationResponse> {
  const request = parseRequest(payload);
  const config = providerConfig(environment);
  const telemetry = createTelemetry();
  const provider = createProviderFactory({
    telemetry: { recordInvocation: telemetry.recordInvocation },
  }).create(validateProviderConfig(config));
  const response = await provider.complete({
    prompt: buildPrompt(request),
    metadata: { workflow: 'signal-system', source: 'signal-api' },
  });

  return mapResponse(response);
}

export { REQUEST_LIMIT };
