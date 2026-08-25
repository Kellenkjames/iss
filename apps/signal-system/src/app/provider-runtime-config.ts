import type { ProviderConfigInput, SupportedProvider } from '@iss/ai-provider';

export const resolveSignalProviderConfig = (
  environment: Record<string, string | undefined> = {},
): ProviderConfigInput => ({
  provider: (environment['ISS_AI_PROVIDER'] ?? 'openai') as SupportedProvider,
  model: environment['ISS_AI_MODEL'] ?? 'gpt-4o-mini',
  apiKey: environment['ISS_AI_API_KEY'] ?? 'demo-key',
  defaultSystemMessage: 'You are an operational signal review assistant. Stay concise, evidence-based, and preserve human judgment.',
});
