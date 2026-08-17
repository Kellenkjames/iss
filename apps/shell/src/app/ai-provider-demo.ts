import {
  createProviderFactory,
  validateProviderConfig,
} from '@iss/ai-provider';
import { resolveShellProviderConfig } from './provider-runtime-config';

export function createShellProvider() {
  const config = validateProviderConfig(resolveShellProviderConfig());

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
