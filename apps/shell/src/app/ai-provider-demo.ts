import {
  createProviderFactory,
  validateProviderConfig,
} from '@iss/ai-provider';

export function createShellProvider() {
  const config = validateProviderConfig({
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: 'demo-key',
    defaultSystemMessage: 'You are assisting with operational triage and concise incident summaries.',
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
