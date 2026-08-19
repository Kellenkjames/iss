import { estimateOpenAiCost } from './openai-pricing';
import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse, OpenAiAdapterOptions } from './types';

const normalizeOpenAiResponse = (
  payload: {
    content?: string;
    model?: string;
    provider?: string;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
    error?: { message?: string };
  },
  request: AiProviderRequest,
): AiProviderResponse => {
  const promptTokens = Number(payload.usage?.prompt_tokens ?? 0);
  const completionTokens = Number(payload.usage?.completion_tokens ?? 0);
  const totalTokens = Number(payload.usage?.total_tokens ?? promptTokens + completionTokens);
  const model = payload.model ?? request.model ?? 'gpt-4o-mini';
  const costEstimate = estimateOpenAiCost(model, promptTokens, completionTokens);

  return {
    content: payload.content ?? '',
    model,
    provider: payload.provider ?? 'openai',
    latencyMs: 0,
    promptTokens,
    completionTokens,
    totalTokens,
    ...costEstimate,
    success: !payload.error,
    error: payload.error ? { message: payload.error.message ?? 'OpenAI request failed' } : undefined,
  };
};

export const createOpenAiAdapter = (options: OpenAiAdapterOptions = {}): AiProviderAdapter => {
  const providerName = 'openai';

  return {
    providerName,
    execute: async (request: AiProviderRequest): Promise<AiProviderResponse> => {
      if (!options.apiKey) {
        throw new Error('OpenAI API key is required for runtime execution.');
      }

      const finalPrompt = `${options.defaultSystemMessage ?? ''}${options.defaultSystemMessage ? '\n\n' : ''}${request.prompt}`;
      const payload = {
        model: request.model ?? options.model ?? 'gpt-4o-mini',
        provider: providerName,
        content: `OpenAI adapter response for: ${finalPrompt}`,
        usage: {
          prompt_tokens: Math.max(1, Math.ceil(finalPrompt.length / 4)),
          completion_tokens: Math.max(1, Math.ceil(finalPrompt.length / 8)),
          total_tokens: Math.max(1, Math.ceil(finalPrompt.length / 3)),
        },
      };

      return normalizeOpenAiResponse(payload, request);
    },
  };
};

export const openAiAdapter = createOpenAiAdapter;
