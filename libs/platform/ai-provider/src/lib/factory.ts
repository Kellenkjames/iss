import { createAiProvider } from './ai-provider';
import { resolveProviderConfigFromEnvironment, validateProviderConfig } from './config';
import { createOpenAiAdapter } from './openai-adapter';
import type { AiProvider, AiProviderOptions } from './types';

export type ProviderConfig = {
  provider: 'openai';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
};

export interface ProviderFactoryOptions {
  telemetry?: AiProviderOptions['telemetry'];
}

export interface ProviderFactory {
  create(config: ProviderConfig): AiProvider;
}

export const createProviderFactory = (options: ProviderFactoryOptions = {}): ProviderFactory => {
  const create = (config: ProviderConfig): AiProvider => {
    const resolvedConfig = {
      ...resolveProviderConfigFromEnvironment(),
      ...config,
    };

    const normalizedConfig = validateProviderConfig(resolvedConfig);

    const adapter = createOpenAiAdapter({
      apiKey: normalizedConfig.apiKey,
      baseUrl: normalizedConfig.baseUrl,
      model: normalizedConfig.model,
      organization: normalizedConfig.organization,
      defaultSystemMessage: normalizedConfig.defaultSystemMessage,
    });

    return createAiProvider(
      {
        provider: normalizedConfig.provider,
        model: normalizedConfig.model,
        telemetry: options.telemetry,
      },
      adapter,
    );
  };

  return {
    create,
  };
};

export const createFactory = createProviderFactory;
