import { describe, expect, it } from 'vitest';
import { runAiProviderDemo } from './ai-provider-demo';

describe('ai-provider demo consumer', () => {
  it('returns a normalized result through the provider boundary', async () => {
    localStorage.removeItem('iss.telemetry.history');
    localStorage.removeItem('iss.telemetry.aggregate');

    const response = await runAiProviderDemo('Review the current incident queue');

    expect(response.success).toBe(true);
    expect(response.provider).toBe('openai');
    expect(response.content.length).toBeGreaterThan(0);

    const history = JSON.parse(localStorage.getItem('iss.telemetry.history') ?? '[]') as Array<{
      provider: string;
      model: string;
      success: boolean;
    }>;
    const aggregate = JSON.parse(localStorage.getItem('iss.telemetry.aggregate') ?? '{}') as {
      totalInvocations?: number;
    };

    expect(history).toHaveLength(1);
    expect(history[0].provider).toBe('openai');
    expect(history[0].model).toBe('gpt-4o-mini');
    expect(history[0].success).toBe(true);
    expect(aggregate.totalInvocations).toBe(1);
  });
});
