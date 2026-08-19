import { describe, expect, it } from 'vitest';
import { runAiProviderDemo } from './ai-provider-demo';

describe('ai-provider demo consumer', () => {
  it('persists reviewable operational evidence through the provider boundary', async () => {
    localStorage.removeItem('iss.telemetry.history');
    localStorage.removeItem('iss.telemetry.aggregate');

    const prompt = 'Review the current incident queue';
    const response = await runAiProviderDemo(prompt);

    expect(response.success).toBe(true);
    expect(response.provider).toBe('openai');
    expect(response.content.length).toBeGreaterThan(0);

    const history = JSON.parse(localStorage.getItem('iss.telemetry.history') ?? '[]') as Array<{
      completionTokens: number;
      costEstimateStatus: 'estimated' | 'unavailable';
      estimatedCostUsd: number;
      invocationContext: Record<string, unknown>;
      latencyMs: number;
      promptTokens: number;
      provider: string;
      model: string;
      success: boolean;
      timestamp: string;
      totalTokens: number;
    }>;
    const aggregate = JSON.parse(localStorage.getItem('iss.telemetry.aggregate') ?? '{}') as {
      averageLatencyMs?: number;
      from?: string;
      models?: Record<string, number>;
      providers?: Record<string, number>;
      to?: string;
      totalCompletionTokens?: number;
      totalEstimatedCostUsd?: number;
      totalInvocations?: number;
      totalPromptTokens?: number;
      totalTokens?: number;
    };

    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o-mini',
      invocationContext: {
        workflow: 'ai-provider',
      },
      costEstimateStatus: 'estimated',
      success: true,
    });
    expect(history[0].promptTokens).toBeGreaterThanOrEqual(0);
    expect(history[0].completionTokens).toBeGreaterThanOrEqual(0);
    expect(history[0].totalTokens).toBeGreaterThanOrEqual(0);
    expect(history[0].estimatedCostUsd).toBeGreaterThan(0);
    expect(history[0].latencyMs).toBeGreaterThanOrEqual(0);
    expect(Number.isNaN(new Date(history[0].timestamp).getTime())).toBe(false);
    expect(JSON.stringify(history)).not.toContain(prompt);

    expect(aggregate.totalInvocations).toBe(1);
    expect(aggregate.totalPromptTokens).toBe(history[0].promptTokens);
    expect(aggregate.totalCompletionTokens).toBe(history[0].completionTokens);
    expect(aggregate.totalTokens).toBe(history[0].totalTokens);
    expect(aggregate.totalEstimatedCostUsd).toBe(history[0].estimatedCostUsd);
    expect(aggregate.averageLatencyMs).toBe(history[0].latencyMs);
    expect(aggregate.providers).toEqual({ openai: 1 });
    expect(aggregate.models).toEqual({ 'gpt-4o-mini': 1 });
    expect(Number.isNaN(new Date(aggregate.from ?? '').getTime())).toBe(false);
    expect(Number.isNaN(new Date(aggregate.to ?? '').getTime())).toBe(false);
  });
});
