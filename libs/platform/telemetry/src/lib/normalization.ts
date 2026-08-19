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

const isSensitiveKey = (key: string): boolean =>
  SENSITIVE_FRAGMENTS.some((fragment) => key.toLowerCase().includes(fragment));

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.replace(/\s+/g, ' ').trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !isSensitiveKey(key))
      .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)]),
  );
};

export const sanitizeMetadata = (metadata: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !isSensitiveKey(key))
      .map(([key, value]) => [key, sanitizeValue(value)]),
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
    costEstimateStatus: input.costEstimateStatus ?? (input.estimatedCostUsd === undefined ? 'unavailable' : 'estimated'),
    latencyMs: toFiniteNumber(input.latencyMs),
    invocationContext: sanitizeMetadata(input.invocationContext),
    success: input.success ?? true,
    errorMetadata: sanitizeMetadata(input.errorMetadata),
  };
};
