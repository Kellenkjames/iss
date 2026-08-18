import type {
    TelemetryAggregateSummary,
    TelemetryApi,
    TelemetryRecord,
    TelemetryRecordInput,
} from './types';

const HISTORY_KEY = 'iss.telemetry.history';
const AGGREGATE_KEY = 'iss.telemetry.aggregate';

const getStorage = (): Storage | undefined => {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
};

const sanitizeMetadata = (metadata: Record<string, unknown> | undefined): Record<string, unknown> => {
  if (!metadata) {
    return {};
  }

  const sensitiveFragments = ['apikey', 'token', 'secret', 'password', 'authorization', 'cookie'];

  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !sensitiveFragments.some((fragment) => key.toLowerCase().includes(fragment)))
      .map(([key, value]) => [
        key,
        typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value,
      ]),
  );
};

const readRecords = (): TelemetryRecord[] => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const parsed = JSON.parse(storage.getItem(HISTORY_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const calculateAggregate = (records: TelemetryRecord[]): TelemetryAggregateSummary => {
  const promptTokens = records.reduce((total, record) => total + record.promptTokens, 0);
  const completionTokens = records.reduce((total, record) => total + record.completionTokens, 0);
  const timestamps = records.map((record) => new Date(record.timestamp).getTime());
  const providers = records.reduce<Record<string, number>>((counts, record) => {
    counts[record.provider] = (counts[record.provider] ?? 0) + 1;
    return counts;
  }, {});
  const models = records.reduce<Record<string, number>>((counts, record) => {
    counts[record.model] = (counts[record.model] ?? 0) + 1;
    return counts;
  }, {});

  return {
    totalInvocations: records.length,
    totalPromptTokens: promptTokens,
    totalCompletionTokens: completionTokens,
    totalTokens: promptTokens + completionTokens,
    totalEstimatedCostUsd: records.reduce((total, record) => total + record.estimatedCostUsd, 0),
    averageLatencyMs: records.length
      ? Number((records.reduce((total, record) => total + record.latencyMs, 0) / records.length).toFixed(2))
      : 0,
    providers,
    models,
    from: records.length ? new Date(Math.min(...timestamps)).toISOString() : '',
    to: records.length ? new Date(Math.max(...timestamps)).toISOString() : '',
  };
};

export const createBrowserTelemetry = (): TelemetryApi => {
  const recordInvocation = (input: TelemetryRecordInput): void => {
    const record: TelemetryRecord = {
      provider: input.provider,
      model: input.model,
      promptTokens: Number(input.promptTokens) || 0,
      completionTokens: Number(input.completionTokens) || 0,
      totalTokens: Number(input.totalTokens ?? input.promptTokens + input.completionTokens) || 0,
      estimatedCostUsd: Number(input.estimatedCostUsd) || 0,
      latencyMs: Number(input.latencyMs) || 0,
      invocationContext: sanitizeMetadata(input.invocationContext),
      success: input.success ?? true,
      errorMetadata: sanitizeMetadata(input.errorMetadata),
      timestamp: input.timestamp ?? new Date().toISOString(),
    };
    const records = [...readRecords(), record];
    const aggregate = calculateAggregate(records);
    const storage = getStorage();

    storage?.setItem(HISTORY_KEY, JSON.stringify(records));
    storage?.setItem(AGGREGATE_KEY, JSON.stringify(aggregate));
  };

  return {
    recordInvocation,
    readHistory: readRecords,
    generateJsonAggregate: () => calculateAggregate(readRecords()),
    generateMarkdownReport: () => {
      const aggregate = calculateAggregate(readRecords());
      return [
        '# Telemetry Report',
        '',
        `- Total invocations: ${aggregate.totalInvocations}`,
        `- Total tokens: ${aggregate.totalTokens}`,
        `- Estimated cost (USD): $${aggregate.totalEstimatedCostUsd.toFixed(6)}`,
        `- Average latency (ms): ${aggregate.averageLatencyMs}`,
        '',
        'This report captures operational AI telemetry for engineering review.',
      ].join('\n');
    },
    calculateTokenTotals: (records) => ({
      prompt: records.reduce((total, record) => total + record.promptTokens, 0),
      completion: records.reduce((total, record) => total + record.completionTokens, 0),
      total: records.reduce((total, record) => total + record.promptTokens + record.completionTokens, 0),
    }),
    calculateEstimatedCost: (records) => records.reduce((total, record) => total + record.estimatedCostUsd, 0),
  };
};
