import type { AiProviderResponse } from '@iss/ai-provider';
import { describe, expect, it } from 'vitest';
import {
    buildWorkflowResult,
    runAppWorkflow,
} from './incident-provider.service';

const successfulResponse: AiProviderResponse = {
  content: 'Prioritize the blocked deployment.',
  model: 'gpt-4o-mini',
  provider: 'demo-openai',
  latencyMs: 12,
  promptTokens: 10,
  completionTokens: 6,
  totalTokens: 16,
  success: true,
};

const failedResponse: AiProviderResponse = {
  content: '',
  model: 'gpt-4o-mini',
  provider: 'demo-openai',
  latencyMs: 8,
  promptTokens: 10,
  completionTokens: 0,
  totalTokens: 10,
  success: false,
  error: {
    code: 'provider_error',
    message: 'Provider unavailable',
  },
};

describe('app workflow service contract', () => {
  it('normalizes successful provider output and preserves mapped payloads', () => {
    const result = buildWorkflowResult(successfulResponse, {
      priority: 'high',
    });

    expect(result).toEqual({
      success: true,
      provider: 'demo-openai',
      model: 'gpt-4o-mini',
      summary: 'Prioritize the blocked deployment.',
      payload: { priority: 'high' },
    });
  });

  it('normalizes provider failures into a stable app response', () => {
    const result = buildWorkflowResult(failedResponse);

    expect(result).toEqual({
      success: false,
      provider: 'demo-openai',
      model: 'gpt-4o-mini',
      summary: 'Provider unavailable',
      error: 'Provider unavailable',
    });
  });

  it('passes the workflow request to the app executor', async () => {
    const request = {
      prompt: 'Review the incident queue.',
      workflow: 'incident-queue-review',
      source: 'shell-app',
    };
    let receivedRequest: unknown;

    const result = await runAppWorkflow(request, async (_provider, workflowRequest) => {
      receivedRequest = workflowRequest;
      return successfulResponse;
    });

    expect(receivedRequest).toEqual(request);
    expect(result.success).toBe(true);
    expect(result.summary).toBe(successfulResponse.content);
  });
});
