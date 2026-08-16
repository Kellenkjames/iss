export interface TelemetryRecordInput {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens?: number;
  estimatedCostUsd?: number;
  latencyMs?: number;
  invocationContext?: Record<string, unknown>;
  success?: boolean;
  errorMetadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface TelemetryRecord extends Required<Pick<TelemetryRecordInput, 'provider' | 'model' | 'promptTokens' | 'completionTokens' | 'totalTokens' | 'estimatedCostUsd' | 'latencyMs' | 'invocationContext' | 'success' | 'timestamp'>> {
  errorMetadata?: Record<string, unknown>;
}

export interface TelemetryAggregateSummary {
  totalInvocations: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalEstimatedCostUsd: number;
  averageLatencyMs: number;
  providers: Record<string, number>;
  models: Record<string, number>;
  from: string;
  to: string;
}

export interface TelemetryOptions {
  outputDir?: string;
  fileName?: string;
  aggregateFileName?: string;
  includeTimestampInFileName?: boolean;
}

export interface TelemetryApi {
  recordInvocation(input: TelemetryRecordInput): void | Promise<void>;
  readHistory(): TelemetryRecord[];
  generateJsonAggregate(): TelemetryAggregateSummary;
  generateMarkdownReport(): string;
  calculateTokenTotals(items: TelemetryRecord[]): { prompt: number; completion: number; total: number };
  calculateEstimatedCost(items: TelemetryRecord[]): number;
}
