export type SignalStatus = 'Open' | 'Review' | 'Blocked';
export type SignalFreshness = 'Current' | 'Stale' | 'Unknown';

export interface SignalApiRecord {
  id: string;
  title: string;
  summary: string;
  evidence: string;
  status: SignalStatus;
  owner: string;
  confidence: 'Low' | 'Medium' | 'High';
  source: {
    system: 'CI';
    recordId: string;
    observedAt: string;
    freshness: SignalFreshness;
  };
}

interface GitHubWorkflowRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubActionsConfig {
  token: string;
  repository: string;
  fetchImpl?: typeof fetch;
  now?: () => number;
}

export class SourceError extends Error {
  constructor(public readonly statusCode: number, public readonly code: 'unavailable' | 'unauthorized' | 'rate_limited' | 'malformed') {
    super(`GitHub source ${code}.`);
  }
}

const allowedStatuses = new Set(['queued', 'in_progress', 'completed']);
const allowedConclusions = new Set(['success', 'failure', 'cancelled', 'timed_out', 'neutral', null]);

const parseRepository = (repository: string): { owner: string; name: string } => {
  const match = /^([^/]+)\/([^/]+)$/.exec(repository.trim());
  if (!match) {
    throw new SourceError(503, 'malformed');
  }
  return { owner: match[1], name: match[2] };
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isWorkflowRun = (value: unknown): value is GitHubWorkflowRun => {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.id === 'number' && value.id > 0
    && typeof value.name === 'string' && value.name.trim().length > 0
    && typeof value.status === 'string' && allowedStatuses.has(value.status)
    && (typeof value.conclusion === 'string' || value.conclusion === null)
    && allowedConclusions.has(value.conclusion)
    && typeof value.created_at === 'string' && !Number.isNaN(Date.parse(value.created_at))
    && typeof value.updated_at === 'string' && !Number.isNaN(Date.parse(value.updated_at))
    && typeof value.html_url === 'string' && /^https:\/\/github\.com\//.test(value.html_url);
};

const freshnessFor = (updatedAt: string, now: number): SignalFreshness => {
  const age = now - Date.parse(updatedAt);
  if (age < 0 || age < 60 * 60 * 1000) return 'Current';
  if (age <= 24 * 60 * 60 * 1000) return 'Stale';
  return 'Unknown';
};

const mapRun = (run: GitHubWorkflowRun, repository: string, now: number): SignalApiRecord => {
  const failed = run.status === 'completed' && run.conclusion !== 'success';
  const status: SignalStatus = run.status !== 'completed' ? 'Review' : failed ? 'Blocked' : 'Open';
  const confidence = failed ? 'High' : 'Medium';
  return {
    id: `sig-github-${run.id}`,
    title: run.name,
    summary: `GitHub Actions workflow run for ${repository}.`,
    evidence: `Workflow run ${run.id} for ${repository} concluded as ${run.conclusion ?? run.status}. Source: ${run.html_url}`,
    status,
    owner: 'Platform team',
    confidence,
    source: {
      system: 'CI',
      recordId: `github-actions:${run.id}`,
      observedAt: run.updated_at,
      freshness: freshnessFor(run.updated_at, now),
    },
  };
};

const delay = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

const retryDelay = (response: Response, remaining: number): number => {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    const milliseconds = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : Number.NaN;
    if (Number.isFinite(milliseconds) && milliseconds <= remaining) return milliseconds;
  }
  return 250 <= remaining ? 250 : Number.POSITIVE_INFINITY;
};

export async function fetchGitHubSignals(config: GitHubActionsConfig): Promise<SignalApiRecord[]> {
  const { owner, name } = parseRepository(config.repository);
  const fetchImpl = config.fetchImpl ?? fetch;
  const now = config.now ?? Date.now;
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/actions/runs?per_page=10`;
  const startedAt = now();
  let response: Response | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const remaining = 5000 - (now() - startedAt);
    if (remaining <= 0) throw new SourceError(503, 'unavailable');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), remaining);
    try {
      response = await fetchImpl(url, {
        headers: {
          Authorization: `Bearer ${config.token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        signal: controller.signal,
      });
    } catch {
      clearTimeout(timeout);
      if (attempt === 0 && 5000 - (now() - startedAt) >= 250) {
        await delay(250);
        continue;
      }
      throw new SourceError(503, 'unavailable');
    }

    if (response.ok) {
      try {
        let payload: unknown;
        try {
          payload = await response.json();
        } catch {
          if (controller.signal.aborted) throw new SourceError(503, 'unavailable');
          throw new SourceError(502, 'malformed');
        }
        if (!isRecord(payload) || !Array.isArray(payload.workflow_runs)) {
          throw new SourceError(502, 'malformed');
        }
        const rawRuns = payload.workflow_runs;
        const runs = rawRuns.filter(isWorkflowRun);
        if (rawRuns.length > 0 && runs.length === 0) throw new SourceError(502, 'malformed');
        if (runs.length === 0) return [];
        const latest = runs.sort((left, right) => Date.parse(right.updated_at) - Date.parse(left.updated_at) || right.id - left.id)[0];
        return [mapRun(latest, config.repository, now())];
      } finally {
        clearTimeout(timeout);
      }
    }

    clearTimeout(timeout);
    if ((response.status === 401 || response.status === 403)) throw new SourceError(503, 'unauthorized');
    const retryRemaining = 5000 - (now() - startedAt);
    const wait = response.status === 429 ? retryDelay(response, retryRemaining) : 250;
    if (attempt === 0 && (response.status === 429 || response.status >= 500)
      && wait !== Number.POSITIVE_INFINITY && wait <= retryRemaining) {
      await delay(wait);
      continue;
    }
    throw new SourceError(503, response.status === 429 ? 'rate_limited' : 'unavailable');
  }

  throw new SourceError(503, 'unavailable');
}
