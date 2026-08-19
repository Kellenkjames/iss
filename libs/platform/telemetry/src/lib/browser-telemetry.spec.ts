import { afterEach, describe, expect, it } from 'vitest';
import { createBrowserTelemetry } from './browser-telemetry';

const HISTORY_KEY = 'iss.telemetry.history';

const createMemoryStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
    get length() {
      return values.size;
    },
  };
};

describe('browser telemetry', () => {
  afterEach(() => {
    delete (globalThis as { localStorage?: Storage }).localStorage;
  });

  it('normalizes malformed values and preserves failed invocation evidence', () => {
    const storage = createMemoryStorage();
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
    const telemetry = createBrowserTelemetry();

    telemetry.recordInvocation({
      provider: '  openai  ',
      model: '  gpt-4o-mini  ',
      promptTokens: Number.NaN,
      completionTokens: Number.POSITIVE_INFINITY,
      estimatedCostUsd: Number.NaN,
      latencyMs: Number.NaN,
      invocationContext: {
        workflow: '  support   escalation  ',
        authorization: 'secret',
      },
      success: false,
      errorMetadata: {
        reason: '  upstream timeout  ',
        apiToken: 'secret',
      },
      timestamp: 'not-a-timestamp',
    });

    const [record] = JSON.parse(storage.getItem(HISTORY_KEY) ?? '[]');

    expect(record.provider).toBe('openai');
    expect(record.model).toBe('gpt-4o-mini');
    expect(record.promptTokens).toBe(0);
    expect(record.completionTokens).toBe(0);
    expect(record.totalTokens).toBe(0);
    expect(record.success).toBe(false);
    expect(record.invocationContext).toEqual({ workflow: 'support escalation' });
    expect(record.errorMetadata).toEqual({ reason: 'upstream timeout' });
    expect(Number.isNaN(new Date(record.timestamp).getTime())).toBe(false);
  });
});
