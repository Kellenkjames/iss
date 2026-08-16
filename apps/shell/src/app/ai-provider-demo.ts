import { createAiProvider, createOpenAiAdapter } from '@iss/ai-provider';

export async function runAiProviderDemo(prompt: string) {
  const provider = createAiProvider(
    {
      model: 'gpt-4o-mini',
      provider: 'demo-openai',
      telemetry: {
        recordInvocation: async () => undefined,
      },
    },
    {
      ...createOpenAiAdapter({
        apiKey: 'demo-key',
        model: 'gpt-4o-mini',
      }),
      providerName: 'demo-openai',
    },
  );

  return provider.complete({
    prompt,
    metadata: {
      workflow: 'shell-demo',
      source: 'app-level-consumer',
    },
  });
}
