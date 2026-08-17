export type SupportedProvider = 'openai';

export interface ProviderRuntimeConfig {
  provider: SupportedProvider;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}

export type ProviderConfigInput = Partial<ProviderRuntimeConfig> & {
  provider?: string;
};

const DEFAULT_MODEL = 'gpt-4o-mini';

export const normalizeProviderConfig = (
  config: ProviderConfigInput = {},
): ProviderRuntimeConfig => {
  const provider = config.provider ?? 'openai';

  if (provider !== 'openai') {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  const normalized: ProviderRuntimeConfig = {
    provider: 'openai',
    model: config.model ?? DEFAULT_MODEL,
  };

  if (config.apiKey) {
    normalized.apiKey = config.apiKey;
  }

  if (config.baseUrl) {
    normalized.baseUrl = config.baseUrl;
  }

  if (config.organization) {
    normalized.organization = config.organization;
  }

  if (config.defaultSystemMessage) {
    normalized.defaultSystemMessage = config.defaultSystemMessage;
  }

  return normalized;
};

export const validateProviderConfig = (
  config: ProviderConfigInput = {},
): ProviderRuntimeConfig => {
  const normalized = normalizeProviderConfig(config);

  if (!normalized.apiKey) {
    throw new Error('OpenAI API key is required for factory-based provider creation.');
  }

  return normalized;
};

export const createProviderConfig = normalizeProviderConfig;
