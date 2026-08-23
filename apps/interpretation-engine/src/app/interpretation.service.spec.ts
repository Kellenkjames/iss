import type { AiProviderResponse } from '@iss/ai-provider';
import { describe, expect, it } from 'vitest';
import { buildInterpretationPrompt } from './interpretation.service';
import { resolveInterpretationProviderConfig } from './provider-runtime-config';
import { sourceRecords, summarizeSourceStatuses } from './source-dataset';

const response: AiProviderResponse = {
  content: 'The failed dependency check is the first item to inspect.',
  model: 'gpt-4o-mini',
  provider: 'demo-openai',
  latencyMs: 12,
  promptTokens: 20,
  completionTokens: 12,
  totalTokens: 32,
  estimatedCostUsd: 0.00001,
  costEstimateStatus: 'estimated',
  success: true,
};

describe('interpretation engine boundary', () => {
  it('builds a prompt from structured input', () => {
    const prompt = buildInterpretationPrompt({
      subject: 'Deployment OPS-001',
      context: 'The dependency check failed during validation.',
      question: 'What should we inspect first?',
    });

    expect(prompt).toContain('Subject: Deployment OPS-001');
    expect(prompt).toContain('Context: The dependency check failed during validation.');
    expect(prompt).toContain('Question: What should we inspect first?');
  });

  it('keeps browser execution on the explicit demo configuration', () => {
    expect(resolveInterpretationProviderConfig({})).toMatchObject({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'demo-key',
    });
  });

  it('keeps the provider response shape available to the consumer boundary', () => {
    expect(response.success).toBe(true);
    expect(response.content).toContain('failed dependency check');
  });

  it('derives status counts from the local fixture and handles empty data', () => {
    expect(summarizeSourceStatuses(sourceRecords)).toEqual([
      { status: 'Open', count: 1, percentage: 33 },
      { status: 'Review', count: 1, percentage: 33 },
      { status: 'Blocked', count: 1, percentage: 33 },
    ]);
    expect(summarizeSourceStatuses([])).toEqual([
      { status: 'Open', count: 0, percentage: 0 },
      { status: 'Review', count: 0, percentage: 0 },
      { status: 'Blocked', count: 0, percentage: 0 },
    ]);
  });
});
