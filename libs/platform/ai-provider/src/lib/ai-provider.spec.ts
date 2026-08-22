import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAiProvider } from './ai-provider';
import {
  normalizeProviderConfig,
  resolveProviderConfigFromEnvironment,
  validateProviderConfig,
} from './config';
import { createProviderFactory } from './factory';
import { createOpenAiAdapter } from './openai-adapter';
import { estimateOpenAiCost } from './openai-pricing';

describe('ai-provider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

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
        estimatedCostUsd: 0,
        costEstimateStatus: 'unavailable',
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
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_125);

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
        estimatedCostUsd: 0,
        costEstimateStatus: 'unavailable',
        success: true,
      }),
    });

    await provider.complete({ prompt: 'ping' });

    expect(telemetryCall).not.toBeNull();
    if (telemetryCall && typeof telemetryCall === 'object') {
      expect((telemetryCall as { provider: string }).provider).toBe('local-test');
      expect((telemetryCall as { totalTokens: number }).totalTokens).toBe(25);
      expect((telemetryCall as { costEstimateStatus: string }).costEstimateStatus).toBe('unavailable');
      expect((telemetryCall as { latencyMs: number }).latencyMs).toBe(125);
    }
  });

  it('normalizes provider failures and records telemetry error state', async () => {
    let telemetryCall: {
      errorMetadata?: Record<string, unknown>;
      latencyMs: number;
      success?: boolean;
    } | undefined;
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
      execute: async () => {
        throw new Error('provider unavailable');
      },
    });

    const response = await provider.complete({ prompt: 'fail case' });

    expect(response.success).toBe(false);
    expect(response.error?.message).toContain('provider unavailable');
    expect(response.provider).toBe('local-test');
    expect(telemetryCall).toMatchObject({
      success: false,
      latencyMs: expect.any(Number),
      errorMetadata: {
        error: {
          message: 'provider unavailable',
        },
      },
    });
  });

  it('normalizes adapter transport failures and records failure telemetry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('upstream failure details', { status: 503 })));
    let telemetryCall: {
      completionTokens: number;
      errorMetadata?: Record<string, unknown>;
      latencyMs: number;
      promptTokens: number;
      success?: boolean;
      totalTokens: number;
    } | undefined;
    const provider = createAiProvider({
      provider: 'openai',
      model: 'gpt-4o-mini',
      telemetry: {
        recordInvocation: async (input) => {
          telemetryCall = input;
        },
      },
    }, createOpenAiAdapter({ apiKey: 'test-key' }));

    const response = await provider.complete({ prompt: 'transport failure' });

    expect(response).toMatchObject({
      provider: 'openai',
      success: false,
      error: {
        code: 'openai_http_error',
      },
    });
    expect(response.latencyMs).toBeGreaterThanOrEqual(0);
    expect(telemetryCall).toMatchObject({
      completionTokens: 0,
      errorMetadata: {
        error: {
          code: 'openai_http_error',
        },
      },
      latencyMs: expect.any(Number),
      promptTokens: 0,
      success: false,
      totalTokens: 0,
    });
  });

  it('creates a provider from configuration through the factory', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      model: 'gpt-4o-mini-2024-07-18',
      choices: [{ message: { content: 'factory response' } }],
      usage: { prompt_tokens: 8, completion_tokens: 4, total_tokens: 12 },
    }), { status: 200 })));

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
    expect(response.model).toBe('gpt-4o-mini-2024-07-18');
    expect(response.estimatedCostUsd).toBeGreaterThan(0);
    expect(response.costEstimateStatus).toBe('estimated');
    expect(response.success).toBe(true);
  });

  it('estimates standard cost for gpt-4o-mini token usage', () => {
    expect(estimateOpenAiCost('gpt-4o-mini', 1_000_000, 1_000_000)).toEqual({
      estimatedCostUsd: 0.75,
      costEstimateStatus: 'estimated',
    });
  });

  it('marks unsupported model pricing as unavailable', () => {
    expect(estimateOpenAiCost('unsupported-model', 1_000_000, 1_000_000)).toEqual({
      estimatedCostUsd: 0,
      costEstimateStatus: 'unavailable',
    });
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

  it('resolves provider configuration from a browser-safe global runtime object', () => {
    const runtime = globalThis as typeof globalThis & {
      process?: { env?: Record<string, string> };
    };
    const originalProcess = runtime.process;

    try {
      runtime.process = {
        env: {
          OPENAI_API_KEY: 'runtime-key',
          OPENAI_MODEL: 'gpt-4o-mini',
        },
      } as unknown as typeof runtime.process;

      const config = resolveProviderConfigFromEnvironment();

      expect(config.provider).toBe('openai');
      expect(config.apiKey).toBe('runtime-key');
      expect(config.model).toBe('gpt-4o-mini');
    } finally {
      runtime.process = originalProcess;
    }
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
