import { describe, expect, it } from 'vitest';
import { runAiProviderDemo } from './ai-provider-demo';

describe('ai-provider demo consumer', () => {
  it('returns a normalized result through the provider boundary', async () => {
    const response = await runAiProviderDemo('Review the current incident queue');

    expect(response.success).toBe(true);
    expect(response.provider).toBe('demo-openai');
    expect(response.content.length).toBeGreaterThan(0);
  });
});
