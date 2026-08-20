import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOpenAiAdapter } from './openai-adapter';

describe('openai adapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates an OpenAI adapter with a stable provider contract', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      model: 'gpt-4o-mini',
      choices: [{ message: { content: 'Incident summary' } }],
      usage: { prompt_tokens: 12, completion_tokens: 7, total_tokens: 19 },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    vi.stubGlobal('fetch', fetchMock);
    const adapter = createOpenAiAdapter({ apiKey: 'test-key', model: 'gpt-4o-mini' });

    const response = await adapter.execute({
      prompt: 'Summarize this incident',
      metadata: { workflow: 'ops' },
    });

    expect(response.provider).toBe('openai');
    expect(response.model).toBe('gpt-4o-mini');
    expect(response.success).toBe(true);
    expect(response.content).toBe('Incident summary');
    expect(response.totalTokens).toBe(19);
    expect(fetchMock).toHaveBeenCalledWith('https://api.openai.com/v1/chat/completions', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer test-key' }),
    }));
  });

  it('keeps the explicit demo key offline for browser-safe demonstrations', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const adapter = createOpenAiAdapter({ apiKey: 'demo-key', model: 'gpt-4o-mini' });
    const response = await adapter.execute({ prompt: 'demo prompt' });

    expect(response.success).toBe(true);
    expect(response.content).toContain('demo prompt');
    expect(response.totalTokens).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects live credentials in browser runtimes', async () => {
    vi.stubGlobal('window', {});
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const adapter = createOpenAiAdapter({ apiKey: 'live-key' });

    await expect(adapter.execute({ prompt: 'browser request' })).rejects.toThrow('server-only');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends request options and organization headers to the configured endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      model: 'gpt-4o-mini',
      choices: [{ message: { content: 'ok' } }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const adapter = createOpenAiAdapter({
      apiKey: 'test-key',
      baseUrl: 'https://example.test/v1/',
      organization: 'iss-org',
      defaultSystemMessage: 'Be concise.',
    });

    await adapter.execute({ prompt: 'Summarize', temperature: 0.2, maxTokens: 30 });

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock.mock.calls[0][0]).toBe('https://example.test/v1/chat/completions');
    expect(requestInit.headers).toEqual(expect.objectContaining({ 'OpenAI-Organization': 'iss-org' }));
    expect(JSON.parse(requestInit.body as string)).toMatchObject({
      messages: [
        { role: 'system', content: 'Be concise.' },
        { role: 'user', content: 'Summarize' },
      ],
      temperature: 0.2,
      max_tokens: 30,
    });
  });

  it('normalizes provider error responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      error: { message: 'quota exceeded', code: 'rate_limit_exceeded' },
    }), { status: 429 })));

    const adapter = createOpenAiAdapter({ apiKey: 'test-key' });

    await expect(adapter.execute({ prompt: 'fail' })).rejects.toMatchObject({
      message: 'quota exceeded',
      code: 'rate_limit_exceeded',
    });
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
