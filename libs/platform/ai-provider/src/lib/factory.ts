import { createAiProvider } from './ai-provider';
import { createOpenAiAdapter } from './openai-adapter';
import type { AiProvider, AiProviderOptions } from './types';

export interface ProviderConfig {
  provider: 'openai';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}

export interface ProviderFactoryOptions {
  telemetry?: AiProviderOptions['telemetry'];
}

export interface ProviderFactory {
  create(config: ProviderConfig): AiProvider;
}

export const createProviderFactory = (options: ProviderFactoryOptions = {}): ProviderFactory => {
  const create = (config: ProviderConfig): AiProvider => {
    if (config.provider !== 'openai') {
      throw new Error('Unsupported AI provider');
    }

    if (!config.apiKey) {
      throw new Error('OpenAI API key is required for factory-based provider creation.');
    }

    const adapter = createOpenAiAdapter({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      model: config.model,
      organization: config.organization,
      defaultSystemMessage: config.defaultSystemMessage,
    });

    return createAiProvider(
      {
        provider: 'openai',
        model: config.model ?? 'gpt-4o-mini',
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
