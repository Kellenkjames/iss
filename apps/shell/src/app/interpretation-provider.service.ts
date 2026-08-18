import type { AiProviderResponse } from '@iss/ai-provider';
import {
    type AppWorkflowExecutor,
    type AppWorkflowResult,
    runAppWorkflow,
} from './incident-provider.service';

export interface InterpretationRequest {
  subject: string;
  context: string;
  question?: string;
  source?: string;
}

export interface InterpretationPayload {
  subject: string;
  interpretation: string;
  question?: string;
}

export type InterpretationResult = AppWorkflowResult<InterpretationPayload>;

export const buildInterpretationPrompt = (request: InterpretationRequest): string => {
  const question = request.question?.trim();
  const questionLine = question ? `\nQuestion: ${question}` : '';

  return [
    'Interpret the following information and provide a concise, evidence-based explanation.',
    `Subject: ${request.subject.trim()}`,
    `Context: ${request.context.trim()}${questionLine}`,
  ].join('\n');
};

const validateInterpretationRequest = (request: InterpretationRequest): void => {
  if (!request.subject.trim()) {
    throw new Error('Interpretation subject is required.');
  }

  if (!request.context.trim()) {
    throw new Error('Interpretation context is required.');
  }
};

const executeInterpretation: AppWorkflowExecutor = async (provider, workflowRequest) =>
  provider.complete({
    prompt: workflowRequest.prompt,
    metadata: {
      workflow: 'interpretation',
      source: workflowRequest.source ?? 'shell-interpretation-service',
    },
  });

export async function interpretInformation(
  request: InterpretationRequest,
  executor: AppWorkflowExecutor = executeInterpretation,
): Promise<InterpretationResult> {
  validateInterpretationRequest(request);

  return runAppWorkflow(
    {
      prompt: buildInterpretationPrompt(request),
      workflow: 'interpretation',
      source: request.source,
    },
    executor,
    (response: AiProviderResponse): InterpretationPayload => ({
      subject: request.subject.trim(),
      interpretation: response.content,
      question: request.question?.trim() || undefined,
    }),
  );
}
