import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type {
    TelemetryAggregateSummary,
    TelemetryApi,
    TelemetryOptions,
    TelemetryRecord,
    TelemetryRecordInput,
} from './types';
import { createTelemetryRecord } from './normalization';

const DEFAULT_OUTPUT_DIR = 'tmp/telemetry';
const DEFAULT_FILE_NAME = 'telemetry-log.json';
const DEFAULT_AGGREGATE_FILE_NAME = 'telemetry-aggregate.json';

const ensureDirectory = (dir: string) => {
  mkdirSync(dir, { recursive: true });
};

const writeJsonFile = (targetPath: string, value: unknown) => {
  ensureDirectory(targetPath.slice(0, targetPath.lastIndexOf('/')) || '.');
  writeFileSync(targetPath, JSON.stringify(value, null, 2), 'utf8');
};

export const calculateTokenTotals = (items: TelemetryRecord[]) => {
  const totalPrompt = items.reduce((sum, item) => sum + (Number(item.promptTokens) || 0), 0);
  const totalCompletion = items.reduce((sum, item) => sum + (Number(item.completionTokens) || 0), 0);
  const total = totalPrompt + totalCompletion;

  return {
    prompt: totalPrompt,
    completion: totalCompletion,
    total,
  };
};

export const calculateEstimatedCost = (items: TelemetryRecord[]) =>
  items.reduce((sum, item) => sum + (Number(item.estimatedCostUsd) || 0), 0);

export const createTelemetry = (options: TelemetryOptions = {}): TelemetryApi => {
  const outputDir = options.outputDir ?? DEFAULT_OUTPUT_DIR;
  const fileName = options.fileName ?? DEFAULT_FILE_NAME;
  const aggregateFileName = options.aggregateFileName ?? DEFAULT_AGGREGATE_FILE_NAME;
  const includeTimestampInFileName = options.includeTimestampInFileName ?? false;

  const logPath = join(process.cwd(), outputDir, includeTimestampInFileName ? `${Date.now()}-${fileName}` : fileName);
  const aggregatePath = join(process.cwd(), outputDir, includeTimestampInFileName ? `${Date.now()}-${aggregateFileName}` : aggregateFileName);

  const readHistory = (): TelemetryRecord[] => {
    if (!existsSync(logPath)) {
      return [];
    }

    try {
      const raw = readFileSync(logPath, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const recordInvocation = (input: TelemetryRecordInput): void | Promise<void> => {
    const record = createTelemetryRecord(input);

    const history = readHistory();
    const nextHistory = [...history, record];

    ensureDirectory(join(process.cwd(), outputDir));
    writeJsonFile(logPath, nextHistory);
    generateJsonAggregate();

    return;
  };

  const generateJsonAggregate = (): TelemetryAggregateSummary => {
    const history = readHistory();

    if (!history.length) {
      return {
        totalInvocations: 0,
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalTokens: 0,
        totalEstimatedCostUsd: 0,
        averageLatencyMs: 0,
        providers: {},
        models: {},
        from: '',
        to: '',
      };
    }

    const totals = calculateTokenTotals(history);
    const cost = calculateEstimatedCost(history);
    const uniqueProviders = history.reduce<Record<string, number>>((acc, item) => {
      acc[item.provider] = (acc[item.provider] ?? 0) + 1;
      return acc;
    }, {});
    const uniqueModels = history.reduce<Record<string, number>>((acc, item) => {
      acc[item.model] = (acc[item.model] ?? 0) + 1;
      return acc;
    }, {});
    const averageLatencyMs = history.reduce((sum, item) => sum + (Number(item.latencyMs) || 0), 0) / history.length;
    const timestamps = history.map((item) => new Date(item.timestamp).getTime());

    const aggregate: TelemetryAggregateSummary = {
      totalInvocations: history.length,
      totalPromptTokens: totals.prompt,
      totalCompletionTokens: totals.completion,
      totalTokens: totals.total,
      totalEstimatedCostUsd: cost,
      averageLatencyMs: Number(averageLatencyMs.toFixed(2)),
      providers: uniqueProviders,
      models: uniqueModels,
      from: new Date(Math.min(...timestamps)).toISOString(),
      to: new Date(Math.max(...timestamps)).toISOString(),
    };

    writeJsonFile(aggregatePath, aggregate);
    return aggregate;
  };

  const generateMarkdownReport = (): string => {
    const aggregate = generateJsonAggregate();

    if (!aggregate.totalInvocations) {
      return '# Telemetry Report\n\nNo AI invocations recorded.';
    }

    const providerSummary = Object.entries(aggregate.providers)
      .map(([name, count]) => `- ${name}: ${count} invocations`)
      .join('\n');

    const modelSummary = Object.entries(aggregate.models)
      .map(([name, count]) => `- ${name}: ${count} invocations`)
      .join('\n');

    return [
      '# Telemetry Report',
      '',
      '## Summary',
      '',
      `- Total invocations: ${aggregate.totalInvocations}`,
      `- Prompt tokens: ${aggregate.totalPromptTokens}`,
      `- Completion tokens: ${aggregate.totalCompletionTokens}`,
      `- Total tokens: ${aggregate.totalTokens}`,
      `- Estimated cost (USD): $${aggregate.totalEstimatedCostUsd.toFixed(6)}`,
      `- Average latency (ms): ${aggregate.averageLatencyMs}`,
      `- Period: ${aggregate.from} to ${aggregate.to}`,
      '',
      '## Providers',
      '',
      providerSummary || '- None',
      '',
      '## Models',
      '',
      modelSummary || '- None',
      '',
      '## Scope',
      '',
      'This report captures operational AI telemetry for engineering review. It does not include user analytics, product analytics, or hosted observability platform data.',
    ].join('\n');
  };

  return {
    recordInvocation,
    readHistory,
    generateJsonAggregate,
    generateMarkdownReport,
    calculateTokenTotals,
    calculateEstimatedCost,
  };
};

export const createTelemetryApi = createTelemetry;
