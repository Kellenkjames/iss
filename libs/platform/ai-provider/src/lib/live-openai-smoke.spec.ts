import { describe, expect, it } from 'vitest';
import { createProviderFactory } from './factory';

const apiKey = process.env['OPENAI_API_KEY'];

describe('live OpenAI smoke test', () => {
  it('executes one live request through the provider boundary', async () => {
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY is not set in this terminal. Export it here before running the live smoke test.',
      );
    }

    const telemetryRecords: Array<{
      provider: string;
      model: string;
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
      latencyMs: number;
      success?: boolean;
    }> = [];
    const provider = createProviderFactory({
      telemetry: {
        recordInvocation: async (record) => {
          telemetryRecords.push(record);
        },
      },
    }).create({
      provider: 'openai',
      model: process.env['OPENAI_MODEL'] ?? 'gpt-4o-mini',
      apiKey,
    });

    const response = await provider.complete({
      prompt: 'Reply with the single word: verified',
      metadata: { workflow: 'manual-live-smoke-test' },
    });

    if (!response.success) {
      throw new Error(
        `Live OpenAI request failed: ${response.error?.code ?? 'unknown'}: ${response.error?.message ?? 'unknown error'}`,
      );
    }

    expect(response.success).toBe(true);
    expect(response.provider).toBe('openai');
    expect(response.content.length).toBeGreaterThan(0);
    expect(response.promptTokens).toBeGreaterThan(0);
    expect(response.completionTokens).toBeGreaterThan(0);
    expect(response.totalTokens).toBeGreaterThan(0);
    expect(response.latencyMs).toBeGreaterThan(0);
    expect(response.model).toMatch(/^gpt-4o-mini(?:-|$)/);
    expect(telemetryRecords).toHaveLength(1);
    expect(telemetryRecords[0]).toMatchObject({
      provider: 'openai',
      model: response.model,
      success: true,
    });
    expect(telemetryRecords[0].latencyMs).toBeGreaterThan(0);
  });
});
