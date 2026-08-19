import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { resolveTelemetryConfig } from './config';
import { createTelemetry } from './telemetry';

describe('telemetry', () => {
  const outputDir = join(process.cwd(), 'tmp/test-telemetry');

  afterEach(() => {
    if (existsSync(outputDir)) {
      rmSync(outputDir, { recursive: true, force: true });
    }
  });

  it('records a single invocation and keeps the history', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 120,
      completionTokens: 350,
      totalTokens: 470,
      estimatedCostUsd: 0.003,
      latencyMs: 840,
      invocationContext: { workflow: 'summarize' },
      success: true,
    });

    const history = telemetry.readHistory();

    expect(history).toHaveLength(1);
    expect(history[0].provider).toBe('openai');
    expect(history[0].model).toBe('gpt-4o-mini');
    expect(history[0].success).toBe(true);
  });

  it('calculates aggregate token totals correctly', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 100,
      completionTokens: 200,
      totalTokens: 300,
      estimatedCostUsd: 0.002,
      latencyMs: 500,
      invocationContext: { workflow: 'search' },
      success: true,
    });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 50,
      completionTokens: 150,
      totalTokens: 200,
      estimatedCostUsd: 0.001,
      latencyMs: 350,
      invocationContext: { workflow: 'search' },
      success: true,
    });

    const aggregate = telemetry.generateJsonAggregate();

    expect(aggregate.totalInvocations).toBe(2);
    expect(aggregate.totalPromptTokens).toBe(150);
    expect(aggregate.totalCompletionTokens).toBe(350);
    expect(aggregate.totalTokens).toBe(500);
    expect(aggregate.totalEstimatedCostUsd).toBe(0.003);
  });

  it('generates a markdown summary report', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 100,
      completionTokens: 100,
      totalTokens: 200,
      estimatedCostUsd: 0.001,
      latencyMs: 600,
      invocationContext: { workflow: 'analysis' },
      success: true,
    });

    const report = telemetry.generateMarkdownReport();

    expect(report).toContain('# Telemetry Report');
    expect(report).toContain('Total invocations: 1');
    expect(report).toContain('Estimated cost (USD)');
    expect(report).toContain('openai');
  });

  it('strips sensitive metadata from stored context', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 25,
      completionTokens: 25,
      totalTokens: 50,
      estimatedCostUsd: 0.0005,
      latencyMs: 200,
      invocationContext: {
        workflow: 'support',
        apiKey: 'secret-value',
        password: 'hide-me',
        authorization: 'Bearer token',
      },
      success: true,
    });

    const history = telemetry.readHistory();

    expect(history[0].invocationContext).toEqual({ workflow: 'support' });
  });

  it('normalizes malformed values and preserves failed invocation evidence', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

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

    const [record] = telemetry.readHistory();

    expect(record.provider).toBe('openai');
    expect(record.model).toBe('gpt-4o-mini');
    expect(record.promptTokens).toBe(0);
    expect(record.completionTokens).toBe(0);
    expect(record.totalTokens).toBe(0);
    expect(record.estimatedCostUsd).toBe(0);
    expect(record.latencyMs).toBe(0);
    expect(record.success).toBe(false);
    expect(record.invocationContext).toEqual({ workflow: 'support escalation' });
    expect(record.errorMetadata).toEqual({ reason: 'upstream timeout' });
    expect(Number.isNaN(new Date(record.timestamp).getTime())).toBe(false);
  });

  describe('runtime configuration', () => {
    it('resolves default telemetry config when environment is empty', () => {
      const config = resolveTelemetryConfig({});

      expect(config.outputDir).toBe('tmp/telemetry');
      expect(config.fileName).toBe('telemetry-log.json');
      expect(config.aggregateFileName).toBe('telemetry-aggregate.json');
      expect(config.includeTimestampInFileName).toBe(false);
    });

    it('overrides config from environment variables', () => {
      const config = resolveTelemetryConfig({
        ISS_TELEMETRY_OUTPUT_DIR: 'custom/telemetry/path',
        ISS_TELEMETRY_LOG_FILE: 'custom-log.json',
        ISS_TELEMETRY_AGGREGATE_FILE: 'custom-aggregate.json',
        ISS_TELEMETRY_INCLUDE_TIMESTAMP: 'true',
      });

      expect(config.outputDir).toBe('custom/telemetry/path');
      expect(config.fileName).toBe('custom-log.json');
      expect(config.aggregateFileName).toBe('custom-aggregate.json');
      expect(config.includeTimestampInFileName).toBe(true);
    });

    it('treats non-true values for timestamp flag as false', () => {
      expect(resolveTelemetryConfig({ ISS_TELEMETRY_INCLUDE_TIMESTAMP: 'false' }).includeTimestampInFileName).toBe(false);
      expect(resolveTelemetryConfig({ ISS_TELEMETRY_INCLUDE_TIMESTAMP: '1' }).includeTimestampInFileName).toBe(false);
      expect(resolveTelemetryConfig({ ISS_TELEMETRY_INCLUDE_TIMESTAMP: 'yes' }).includeTimestampInFileName).toBe(false);
    });
  });

  it('creates the output files in the configured directory', () => {
    const telemetry = createTelemetry({ outputDir: 'tmp/test-telemetry', fileName: 'telemetry-log.json' });

    telemetry.recordInvocation({
      provider: 'openai',
      model: 'gpt-4o-mini',
      promptTokens: 10,
      completionTokens: 10,
      totalTokens: 20,
      estimatedCostUsd: 0.0001,
      latencyMs: 100,
      invocationContext: { workflow: 'small' },
      success: true,
    });

    expect(existsSync(join(process.cwd(), 'tmp/test-telemetry/telemetry-log.json'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'tmp/test-telemetry/telemetry-aggregate.json'))).toBe(true);
  });
});
