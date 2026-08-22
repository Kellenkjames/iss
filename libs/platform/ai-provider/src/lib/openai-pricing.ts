export type CostEstimateStatus = 'estimated' | 'unavailable';

export interface CostEstimate {
  estimatedCostUsd: number;
  costEstimateStatus: CostEstimateStatus;
}

const TOKENS_PER_MILLION = 1_000_000;

// Standard OpenAI API pricing verified against https://developers.openai.com/api/docs/pricing/ on 2026-08-18.
const GPT_4O_MINI_PRICING = {
  inputUsdPerMillionTokens: 0.15,
  outputUsdPerMillionTokens: 0.6,
} as const;

const isGpt4oMiniModel = (model: string): boolean =>
  model === 'gpt-4o-mini' || /^gpt-4o-mini-\d{4}-\d{2}-\d{2}$/.test(model);

export const estimateOpenAiCost = (
  model: string,
  promptTokens: number,
  completionTokens: number,
): CostEstimate => {
  if (!isGpt4oMiniModel(model)) {
    return {
      estimatedCostUsd: 0,
      costEstimateStatus: 'unavailable',
    };
  }

  const estimatedCostUsd =
    (promptTokens / TOKENS_PER_MILLION) * GPT_4O_MINI_PRICING.inputUsdPerMillionTokens
    + (completionTokens / TOKENS_PER_MILLION) * GPT_4O_MINI_PRICING.outputUsdPerMillionTokens;

  return {
    estimatedCostUsd: Number(estimatedCostUsd.toFixed(12)),
    costEstimateStatus: 'estimated',
  };
};
