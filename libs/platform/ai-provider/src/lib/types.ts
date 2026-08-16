export type AiProviderStatus = 'success' | 'error';

export interface AiProviderRequest {
  prompt: string;
  model?: string;
  systemContext?: Record<string, unknown>;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface AiProviderError {
  code?: string;
  message?: string;
}

export interface AiProviderResponse {
  content: string;
  model: string;
  provider: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  success: boolean;
  error?: AiProviderError;
}

export interface AiProviderAdapter {
  providerName: string;
  execute(request: AiProviderRequest): Promise<AiProviderResponse> | AiProviderResponse;
}

export interface AiProvider {
  complete(request: AiProviderRequest): Promise<AiProviderResponse>;
}

export interface AiProviderOptions {
  model?: string;
  provider?: string;
  telemetry?: {
    recordInvocation: (input: {
      provider: string;
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      estimatedCostUsd: number;
      latencyMs: number;
      invocationContext?: Record<string, unknown>;
      success?: boolean;
      errorMetadata?: Record<string, unknown>;
      timestamp?: string;
    }) => void | Promise<void>;
  };
}
