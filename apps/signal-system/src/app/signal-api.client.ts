import type { SignalRecord } from './signal-data';

interface SignalResponse {
  source: 'github-actions' | 'fixture' | 'empty' | 'unavailable';
  signals: SignalRecord[];
}

interface InterpretationResponse {
  success: boolean;
  provider?: string;
  model?: string;
  interpretation?: string;
  error?: { code: string; message: string };
}

export async function loadSignals(fetchImpl: typeof fetch = fetch): Promise<SignalResponse> {
  const response = await fetchImpl('/api/signals');
  if (!response.ok) {
    throw new Error('Signal source is unavailable.');
  }
  const payload = (await response.json()) as SignalResponse;
  if (!Array.isArray(payload.signals) || !['github-actions', 'fixture', 'empty', 'unavailable'].includes(payload.source)) {
    throw new Error('Signal source response is invalid.');
  }
  return payload;
}

export async function requestInterpretation(
  request: { subject: string; evidence: string; question?: string },
  fetchImpl: typeof fetch = fetch,
): Promise<InterpretationResponse> {
  const response = await fetchImpl('/api/interpretations', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(request),
  });
  const payload = (await response.json()) as InterpretationResponse;
  if (!response.ok && payload.success !== false) {
    throw new Error('Signal interpretation is unavailable.');
  }
  return payload;
}
