import { estimateOpenAiCost } from './openai-pricing';
import type { AiProviderAdapter, AiProviderRequest, AiProviderResponse, OpenAiAdapterOptions } from './types';

type OpenAiResponsePayload = {
  id?: string;
  model?: string;
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string }>;
    };
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
};

const getContent = (payload: OpenAiResponsePayload): string => {
  const content = payload.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content.map((part) => part.text ?? '').join('');
  }

  return content ?? '';
};

const createDemoResponse = (request: AiProviderRequest, model: string): OpenAiResponsePayload => {
  const finalPrompt = request.prompt;
  const promptTokens = Math.max(1, Math.ceil(finalPrompt.length / 4));
  const completionTokens = Math.max(1, Math.ceil(finalPrompt.length / 8));

  return {
    model,
    choices: [{ message: { content: `OpenAI adapter response for: ${finalPrompt}` } }],
    usage: {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    },
  };
};

const isBrowserRuntime = (): boolean => typeof window !== 'undefined';

const normalizeOpenAiResponse = (
  payload: OpenAiResponsePayload,
  request: AiProviderRequest,
): AiProviderResponse => {
  const promptTokens = Number(payload.usage?.prompt_tokens ?? 0);
  const completionTokens = Number(payload.usage?.completion_tokens ?? 0);
  const totalTokens = Number(payload.usage?.total_tokens ?? promptTokens + completionTokens);
  const model = payload.model ?? request.model ?? 'gpt-4o-mini';
  const costEstimate = estimateOpenAiCost(model, promptTokens, completionTokens);

  return {
    content: getContent(payload),
    model,
    provider: 'openai',
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
  const baseUrl = (options.baseUrl ?? 'https://api.openai.com/v1').replace(/\/$/, '');

  return {
    providerName,
    execute: async (request: AiProviderRequest): Promise<AiProviderResponse> => {
      if (!options.apiKey) {
        throw new Error('OpenAI API key is required for runtime execution.');
      }

      const model = request.model ?? options.model ?? 'gpt-4o-mini';

      if (options.apiKey === 'demo-key') {
        return normalizeOpenAiResponse(createDemoResponse(request, model), request);
      }

      if (isBrowserRuntime()) {
        throw new Error('Live OpenAI execution is server-only; use the demo key in browser applications.');
      }

      const messages = [
        ...(options.defaultSystemMessage || request.systemContext
          ? [{ role: 'system', content: options.defaultSystemMessage ?? JSON.stringify(request.systemContext) }]
          : []),
        { role: 'user', content: request.prompt },
      ];
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          'Content-Type': 'application/json',
          ...(options.organization ? { 'OpenAI-Organization': options.organization } : {}),
        },
        body: JSON.stringify({
          model,
          messages,
          ...(request.temperature === undefined ? {} : { temperature: request.temperature }),
          ...(request.maxTokens === undefined ? {} : { max_tokens: request.maxTokens }),
        }),
      });

      const payload = (await response.json()) as OpenAiResponsePayload;

      if (!response.ok || payload.error) {
        const error = new Error(
          payload.error?.message ?? `OpenAI request failed with status ${response.status}.`,
        ) as Error & { code?: string };
        error.code = payload.error?.code ?? payload.error?.type;
        throw error;
      };

      return normalizeOpenAiResponse(payload, request);
    },
  };
};

export const openAiAdapter = createOpenAiAdapter;
