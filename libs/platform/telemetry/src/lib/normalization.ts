import type { TelemetryRecord, TelemetryRecordInput } from './types';

const SENSITIVE_FRAGMENTS = ['apikey', 'token', 'secret', 'password', 'authorization', 'cookie'];

const toFiniteNumber = (value: unknown, fallback = 0): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeTimestamp = (value: unknown): string => {
  if (typeof value === 'string' && Number.isFinite(new Date(value).getTime())) {
    return value;
  }

  return new Date().toISOString();
};

export const sanitizeMetadata = (metadata: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !SENSITIVE_FRAGMENTS.some((fragment) => key.toLowerCase().includes(fragment)))
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value,
      ]),
  );
};

export const createTelemetryRecord = (input: TelemetryRecordInput): TelemetryRecord => {
  const promptTokens = toFiniteNumber(input.promptTokens);
  const completionTokens = toFiniteNumber(input.completionTokens);

  return {
    timestamp: normalizeTimestamp(input.timestamp),
    provider: typeof input.provider === 'string' ? input.provider.trim() : 'unknown',
    model: typeof input.model === 'string' ? input.model.trim() : 'unknown',
    promptTokens,
    completionTokens,
    totalTokens: toFiniteNumber(input.totalTokens, promptTokens + completionTokens),
    estimatedCostUsd: toFiniteNumber(input.estimatedCostUsd),
    latencyMs: toFiniteNumber(input.latencyMs),
    invocationContext: sanitizeMetadata(input.invocationContext),
    success: input.success ?? true,
    errorMetadata: sanitizeMetadata(input.errorMetadata),
  };
};
