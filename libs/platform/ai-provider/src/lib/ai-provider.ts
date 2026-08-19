import type {
  AiProvider,
  AiProviderAdapter,
  AiProviderOptions,
  AiProviderRequest,
  AiProviderResponse,
} from './types';

const sanitizeMetadata = (metadata: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!metadata) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value.replace(/\s+/g, ' ').trim()];
      }

      return [key, value];
    }),
  );
};

const normalizeError = (error: unknown): { code?: string; message?: string } => {
  if (error instanceof Error) {
    return {
      code: 'provider_error',
      message: error.message,
    };
  }

  return {
    code: 'provider_error',
    message: 'Unknown AI provider error',
  };
};

const defaultTelemetry = {
  recordInvocation: async () => undefined,
};

export const createAiProvider = (
  options: AiProviderOptions = {},
  adapter: AiProviderAdapter,
): AiProvider => {
  const providerName = adapter.providerName || options.provider || 'ai-provider';
  const modelName = options.model || 'default-model';
  const telemetry = options.telemetry ?? defaultTelemetry;

  const complete = async (request: AiProviderRequest): Promise<AiProviderResponse> => {
    const startedAt = Date.now();

    try {
      const response = await adapter.execute({
        ...request,
        model: request.model ?? modelName,
      });

      const latencyMs = Date.now() - startedAt;
      const normalizedResponse: AiProviderResponse = {
        content: response.content ?? '',
        model: response.model ?? request.model ?? modelName,
        provider: response.provider ?? providerName,
        latencyMs: response.latencyMs ?? latencyMs,
        promptTokens: response.promptTokens ?? 0,
        completionTokens: response.completionTokens ?? 0,
        totalTokens: response.totalTokens ?? response.promptTokens + response.completionTokens,
        estimatedCostUsd: response.estimatedCostUsd ?? 0,
        costEstimateStatus: response.costEstimateStatus ?? 'unavailable',
        success: response.success ?? true,
        error: response.error,
      };

      await telemetry.recordInvocation({
        provider: normalizedResponse.provider,
        model: normalizedResponse.model,
        promptTokens: normalizedResponse.promptTokens,
        completionTokens: normalizedResponse.completionTokens,
        totalTokens: normalizedResponse.totalTokens,
        estimatedCostUsd: normalizedResponse.estimatedCostUsd,
        costEstimateStatus: normalizedResponse.costEstimateStatus,
        latencyMs: normalizedResponse.latencyMs,
        invocationContext: {
          workflow: 'ai-provider',
          metadata: sanitizeMetadata(request.metadata),
          systemContext: sanitizeMetadata(request.systemContext),
        },
        success: normalizedResponse.success,
        timestamp: new Date().toISOString(),
      });

      return normalizedResponse;
    } catch (error) {
      const latencyMs = Date.now() - startedAt;
      const normalizedError = normalizeError(error);
      const failedResponse: AiProviderResponse = {
        content: '',
        model: request.model ?? modelName,
        provider: providerName,
        latencyMs,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        costEstimateStatus: 'unavailable',
        success: false,
        error: normalizedError,
      };

      await telemetry.recordInvocation({
        provider: providerName,
        model: request.model ?? modelName,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
        costEstimateStatus: 'unavailable',
        latencyMs,
        invocationContext: {
          workflow: 'ai-provider',
          metadata: sanitizeMetadata(request.metadata),
          systemContext: sanitizeMetadata(request.systemContext),
        },
        success: false,
        errorMetadata: {
          error: normalizedError,
        },
        timestamp: new Date().toISOString(),
      });

      return failedResponse;
    }
  };

  return {
    complete,
  };
};

export const createProvider = createAiProvider;
