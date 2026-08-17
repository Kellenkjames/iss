import type { ProviderConfigInput } from '@iss/ai-provider';

export type RuntimeEnvironment = Record<string, string | undefined>;

export const getRuntimeEnvironment = (): RuntimeEnvironment => {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: RuntimeEnvironment };
  };

  return globalWithProcess.process?.env ?? {};
};

export const resolveShellProviderConfig = (
  env: RuntimeEnvironment = getRuntimeEnvironment(),
): ProviderConfigInput => ({
  provider: 'openai',
  model: env['OPENAI_MODEL'] ?? 'gpt-4o-mini',
  apiKey: env['OPENAI_API_KEY'] ?? 'demo-key',
  baseUrl: env['OPENAI_BASE_URL'],
  organization: env['OPENAI_ORGANIZATION'],
  defaultSystemMessage:
    env['OPENAI_DEFAULT_SYSTEM_MESSAGE'] ??
    'You are assisting with operational triage and concise incident summaries.',
});
