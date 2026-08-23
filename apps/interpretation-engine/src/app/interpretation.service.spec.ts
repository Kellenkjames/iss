import type { AiProviderResponse } from '@iss/ai-provider';
import { describe, expect, it } from 'vitest';
import { buildInterpretationPrompt } from './interpretation.service';
import { resolveInterpretationProviderConfig } from './provider-runtime-config';

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
});
