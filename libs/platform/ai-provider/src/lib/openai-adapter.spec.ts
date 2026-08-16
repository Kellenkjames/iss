import { describe, expect, it } from 'vitest';
import { createOpenAiAdapter } from './openai-adapter';

describe('openai adapter', () => {
  it('creates an OpenAI adapter with a stable provider contract', async () => {
    const adapter = createOpenAiAdapter({ apiKey: 'test-key', model: 'gpt-4o-mini' });

    const response = await adapter.execute({
      prompt: 'Summarize this incident',
      metadata: { workflow: 'ops' },
    });

    expect(response.provider).toBe('openai');
    expect(response.model).toBe('gpt-4o-mini');
    expect(response.success).toBe(true);
    expect(response.totalTokens).toBeGreaterThan(0);
  });

  it('fails fast when no API key is configured', async () => {
    const adapter = createOpenAiAdapter({ model: 'gpt-4o-mini' });

    await expect(
      adapter.execute({
        prompt: 'should fail',
      }),
    ).rejects.toThrow('OpenAI API key is required');
  });
});
