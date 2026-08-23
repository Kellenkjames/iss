import type { ProviderConfigInput, SupportedProvider } from '@iss/ai-provider';

export const resolveInterpretationProviderConfig = (
  environment: Record<string, string | undefined> = {},
): ProviderConfigInput => ({
  provider: (environment['ISS_AI_PROVIDER'] ?? 'openai') as SupportedProvider,
  model: environment['ISS_AI_MODEL'] ?? 'gpt-4o-mini',
  apiKey: environment['ISS_AI_API_KEY'] ?? 'demo-key',
  defaultSystemMessage: 'You are an operational interpretation assistant. Stay concise and evidence-based.',
});
