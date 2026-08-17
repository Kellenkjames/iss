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

export interface ProviderEnvironmentSource {
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_ORGANIZATION?: string;
  OPENAI_DEFAULT_SYSTEM_MESSAGE?: string;
}

const DEFAULT_MODEL = 'gpt-4o-mini';

type RuntimeProcessWithEnv = {
  env?: ProviderEnvironmentSource;
};

const getRuntimeEnvironmentSource = (): ProviderEnvironmentSource => {
  const runtime = globalThis as typeof globalThis & {
    process?: RuntimeProcessWithEnv;
  };

  return runtime.process?.env ?? {};
};

export const resolveProviderConfigFromEnvironment = (
  env: ProviderEnvironmentSource = getRuntimeEnvironmentSource(),
): ProviderConfigInput => ({
  provider: 'openai',
  model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
  apiKey: env.OPENAI_API_KEY,
  baseUrl: env.OPENAI_BASE_URL,
  organization: env.OPENAI_ORGANIZATION,
  defaultSystemMessage: env.OPENAI_DEFAULT_SYSTEM_MESSAGE,
});

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

export const maskSecretValue = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value.length <= 4) {
    return '****';
  }

  return `${value.slice(0, 2)}${'*'.repeat(Math.max(4, value.length - 4))}${value.slice(-2)}`;
};

export const sanitizeProviderConfig = (
  config: ProviderConfigInput = {},
): ProviderRuntimeConfig => {
  const normalized = normalizeProviderConfig(config);

  if (normalized.apiKey) {
    normalized.apiKey = maskSecretValue(normalized.apiKey);
  }

  return normalized;
};

export const validateProviderConfig = (
  config: ProviderConfigInput = {},
): ProviderRuntimeConfig => {
  const baseConfig = {
    ...resolveProviderConfigFromEnvironment(),
    ...config,
  };

  const normalized = normalizeProviderConfig(baseConfig);

  if (!normalized.apiKey) {
    throw new Error('OpenAI API key is required for factory-based provider creation.');
  }

  return normalized;
};

export const createProviderConfig = normalizeProviderConfig;
export const createProviderConfigFromEnvironment = resolveProviderConfigFromEnvironment;
