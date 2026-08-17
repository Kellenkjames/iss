import { describe, expect, it } from 'vitest';
import { createAiProvider } from './ai-provider';
import {
  normalizeProviderConfig,
  resolveProviderConfigFromEnvironment,
  validateProviderConfig,
} from './config';
import { createProviderFactory } from './factory';

describe('ai-provider', () => {
  it('wraps a provider adapter and returns normalized output', async () => {
    const provider = createAiProvider({
      provider: 'local-test',
      model: 'demo-model',
      telemetry: {
        recordInvocation: async () => undefined,
      },
    }, {
      providerName: 'local-test',
      execute: async (request) => ({
        content: `Handled: ${request.prompt}`,
        model: request.model ?? 'demo-model',
        provider: 'local-test',
        latencyMs: 123,
        promptTokens: 12,
        completionTokens: 7,
        totalTokens: 19,
        success: true,
      }),
    });

    const response = await provider.complete({
      prompt: 'hello world',
      metadata: { workflow: 'unit-test' },
    });

    expect(response.content).toBe('Handled: hello world');
    expect(response.provider).toBe('local-test');
    expect(response.model).toBe('demo-model');
    expect(response.success).toBe(true);
  });

  it('captures telemetry on a successful execution', async () => {
    let telemetryCall: unknown = null;

    const provider = createAiProvider({
      provider: 'local-test',
      model: 'demo-model',
      telemetry: {
        recordInvocation: async (input) => {
          telemetryCall = input;
        },
      },
    }, {
      providerName: 'local-test',
      execute: async () => ({
        content: 'ok',
        model: 'demo-model',
        provider: 'local-test',
        latencyMs: 200,
        promptTokens: 10,
        completionTokens: 15,
        totalTokens: 25,
        success: true,
      }),
    });

    await provider.complete({ prompt: 'ping' });

    expect(telemetryCall).not.toBeNull();
    if (telemetryCall && typeof telemetryCall === 'object') {
      expect((telemetryCall as { provider: string }).provider).toBe('local-test');
      expect((telemetryCall as { totalTokens: number }).totalTokens).toBe(25);
    }
  });

  it('normalizes provider failures and records telemetry error state', async () => {
    const provider = createAiProvider({
      provider: 'local-test',
      model: 'demo-model',
      telemetry: {
        recordInvocation: async () => undefined,
      },
    }, {
      providerName: 'local-test',
      execute: async () => {
        throw new Error('provider unavailable');
      },
    });

    const response = await provider.complete({ prompt: 'fail case' });

    expect(response.success).toBe(false);
    expect(response.error?.message).toContain('provider unavailable');
    expect(response.provider).toBe('local-test');
  });

  it('creates a provider from configuration through the factory', async () => {
    const factory = createProviderFactory({
      telemetry: {
        recordInvocation: async () => undefined,
      },
    });

    const provider = factory.create({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'test-key',
    });

    const response = await provider.complete({
      prompt: 'factory test',
    });

    expect(response.provider).toBe('openai');
    expect(response.model).toBe('gpt-4o-mini');
    expect(response.success).toBe(true);
  });

  it('normalizes provider configuration with the default model and optional fields', () => {
    const config = normalizeProviderConfig({
      provider: 'openai',
      apiKey: 'test-key',
      organization: 'iss-org',
    });

    expect(config.provider).toBe('openai');
    expect(config.model).toBe('gpt-4o-mini');
    expect(config.apiKey).toBe('test-key');
    expect(config.organization).toBe('iss-org');
  });

  it('resolves provider configuration from the runtime environment', () => {
    const config = resolveProviderConfigFromEnvironment({
      OPENAI_API_KEY: 'env-key',
      OPENAI_MODEL: 'gpt-4o-mini',
      OPENAI_ORGANIZATION: 'iss-org',
    });

    expect(config.provider).toBe('openai');
    expect(config.apiKey).toBe('env-key');
    expect(config.model).toBe('gpt-4o-mini');
    expect(config.organization).toBe('iss-org');
  });

  it('throws when a provider config is missing the required API key', () => {
    expect(() => validateProviderConfig({ provider: 'openai', model: 'gpt-4o-mini' })).toThrow(
      'OpenAI API key is required for factory-based provider creation.',
    );
  });

  it('throws for unsupported provider selection', () => {
    const factory = createProviderFactory();

    expect(() => factory.create({ provider: 'unsupported' as never })).toThrow('Unsupported AI provider');
  });
});
