import {
  createProviderFactory,
  validateProviderConfig,
} from '@iss/ai-provider';
import { createBrowserTelemetry } from '@iss/telemetry/browser';
import { resolveShellProviderConfig } from './provider-runtime-config';

export function createShellProvider() {
  const config = validateProviderConfig(resolveShellProviderConfig());
  const telemetry = createBrowserTelemetry();

  return createProviderFactory({
    telemetry,
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
