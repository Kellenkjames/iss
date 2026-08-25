export type SignalStatus = 'Open' | 'Review' | 'Blocked';
export type SignalFreshness = 'Current' | 'Stale' | 'Unknown';

export interface SignalSource {
  system: 'CI';
  recordId: string;
  observedAt: string;
  freshness: SignalFreshness;
}

export interface SignalRecord {
  id: string;
  title: string;
  summary: string;
  evidence: string;
  status: SignalStatus;
  owner: string;
  confidence: 'Low' | 'Medium' | 'High';
  source: SignalSource;
}

interface CiBuildRecord {
  recordId: string;
  title: string;
  summary: string;
  evidence: string;
  status: SignalStatus;
  owner: string;
  confidence: 'Low' | 'Medium' | 'High';
  observedAt: string;
  freshness: SignalFreshness;
}

const ciBuildRecords: CiBuildRecord[] = [
  {
    recordId: 'build-2026-08-101',
    title: 'Release build failure',
    summary: 'Production pipeline is failing after a dependency refresh.',
    evidence: 'The build exited with an error after the telemetry package update and the issue is currently untriaged.',
    status: 'Blocked',
    owner: 'Platform team',
    confidence: 'High',
    observedAt: '2026-08-25T16:30:00Z',
    freshness: 'Current',
  },
  {
    recordId: 'build-2026-08-102',
    title: 'Dependency drift review',
    summary: 'A transitive package changed during the weekly update cycle.',
    evidence: 'The lockfile changed during the automatic dependency refresh and requires engineering review before merge.',
    status: 'Review',
    owner: 'Reliability team',
    confidence: 'Medium',
    observedAt: '2026-08-25T15:45:00Z',
    freshness: 'Current',
  },
  {
    recordId: 'build-2026-08-103',
    title: 'Deployment health check pending',
    summary: 'The deployment completed, but the final health verification remains open.',
    evidence: 'The release was shipped successfully, but the post-deploy verification step has not yet closed.',
    status: 'Open',
    owner: 'Operations team',
    confidence: 'Medium',
    observedAt: '2026-08-25T14:20:00Z',
    freshness: 'Current',
  },
];

export const mapCiBuildToSignal = (record: CiBuildRecord, index: number): SignalRecord => ({
  id: `sig-${101 + index}`,
  title: record.title,
  summary: record.summary,
  evidence: record.evidence,
  status: record.status,
  owner: record.owner,
  confidence: record.confidence,
  source: {
    system: 'CI',
    recordId: record.recordId,
    observedAt: record.observedAt,
    freshness: record.freshness,
  },
});

export const signalRecords: SignalRecord[] = ciBuildRecords.map(mapCiBuildToSignal);

export const signalColumns = [
  { key: 'title', label: 'Signal' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
  { key: 'freshness', label: 'Freshness' },
];

export const signalTableRows = signalRecords.map((record) => ({
  id: record.id,
  title: record.title,
  status: record.status,
  owner: record.owner,
  freshness: record.source.freshness,
}));

export const signalSelectOptions = signalRecords.map((record) => ({
  value: record.id,
  label: record.title,
}));

export const summarizeSignalStatuses = (records: SignalRecord[] = signalRecords) => {
  const statuses: SignalStatus[] = ['Open', 'Review', 'Blocked'];

  return statuses.map((status) => {
    const count = records.filter((record) => record.status === status).length;
    return {
      status,
      count,
      percentage: records.length ? Math.round((count / records.length) * 100) : 0,
    };
  });
};
