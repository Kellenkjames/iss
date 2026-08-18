import type { AiProviderResponse } from '@iss/ai-provider';
import { describe, expect, it } from 'vitest';
import {
    buildInterpretationPrompt,
    interpretInformation,
} from './interpretation-provider.service';

const successfulResponse: AiProviderResponse = {
  content: 'The deployment is blocked by a failed dependency check.',
  model: 'gpt-4o-mini',
  provider: 'demo-openai',
  latencyMs: 18,
  promptTokens: 24,
  completionTokens: 11,
  totalTokens: 35,
  success: true,
};

const failedResponse: AiProviderResponse = {
  ...successfulResponse,
  content: '',
  success: false,
  error: {
    code: 'provider_error',
    message: 'Provider unavailable',
  },
};

describe('interpretation service consumer', () => {
  it('builds a prompt from subject, context, and question', () => {
    const prompt = buildInterpretationPrompt({
      subject: 'Deployment OPS-001',
      context: 'The dependency check failed during release validation.',
      question: 'What should the operator inspect first?',
    });

    expect(prompt).toContain('Subject: Deployment OPS-001');
    expect(prompt).toContain('Context: The dependency check failed during release validation.');
    expect(prompt).toContain('Question: What should the operator inspect first?');
  });

  it('rejects an empty required field before provider execution', async () => {
    let executionCount = 0;

    await expect(
      interpretInformation(
        { subject: ' ', context: 'Release context' },
        async () => {
          executionCount += 1;
          return successfulResponse;
        },
      ),
    ).rejects.toThrow('Interpretation subject is required.');

    expect(executionCount).toBe(0);
  });

  it('delegates valid input and returns a domain payload', async () => {
    let receivedPrompt = '';

    const result = await interpretInformation(
      {
        subject: 'Deployment OPS-001',
        context: 'The dependency check failed during release validation.',
        question: 'What should the operator inspect first?',
      },
      async (_provider, workflowRequest) => {
        receivedPrompt = workflowRequest.prompt;
        return successfulResponse;
      },
    );

    expect(receivedPrompt).toContain('Deployment OPS-001');
    expect(result.success).toBe(true);
    expect(result.payload).toEqual({
      subject: 'Deployment OPS-001',
      interpretation: successfulResponse.content,
      question: 'What should the operator inspect first?',
    });
  });

  it('preserves shared failure semantics without a domain payload', async () => {
    const result = await interpretInformation(
      { subject: 'Deployment OPS-001', context: 'Release validation failed.' },
      async () => failedResponse,
    );

    expect(result.success).toBe(false);
    expect(result.summary).toBe('Provider unavailable');
    expect(result.error).toBe('Provider unavailable');
    expect(result.payload).toBeUndefined();
  });
});
