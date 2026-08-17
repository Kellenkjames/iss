import {
  createProviderFactory,
  resolveProviderConfigFromEnvironment,
  validateProviderConfig,
} from '@iss/ai-provider';

type RuntimeEnvironment = Record<string, string | undefined>;

const getRuntimeEnv = (): RuntimeEnvironment => {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: RuntimeEnvironment };
  };

  return globalWithProcess.process?.env ?? {};
};

export function createShellProvider() {
  const runtimeEnv = getRuntimeEnv();
  const config = validateProviderConfig({
    ...resolveProviderConfigFromEnvironment(runtimeEnv),
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: runtimeEnv['OPENAI_API_KEY'] ?? 'demo-key',
    defaultSystemMessage: runtimeEnv['OPENAI_DEFAULT_SYSTEM_MESSAGE'] ?? 'You are assisting with operational triage and concise incident summaries.',
  });

  return createProviderFactory({
    telemetry: {
      recordInvocation: async () => undefined,
    },
  }).create(config);
}

export async function runAiProviderDemo(prompt: string) {
  const provider = createShellProvider();

  return provider.complete({
    prompt,
    metadata: {
      workflow: 'shell-demo',
      source: 'app-level-consumer',
    },
  });
}
