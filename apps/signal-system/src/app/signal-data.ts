export type SignalStatus = 'Open' | 'Review' | 'Blocked';

export interface SignalRecord {
  id: string;
  title: string;
  summary: string;
  evidence: string;
  status: SignalStatus;
  owner: string;
  confidence: 'Low' | 'Medium' | 'High';
}

export const signalRecords: SignalRecord[] = [
  {
    id: 'sig-101',
    title: 'Release build failure',
    summary: 'Production pipeline is failing after a dependency refresh.',
    evidence: 'The build exited with an error after the telemetry package update and the issue is currently untriaged.',
    status: 'Blocked',
    owner: 'Platform team',
    confidence: 'High',
  },
  {
    id: 'sig-102',
    title: 'Dependency drift review',
    summary: 'A transitive package changed during the weekly update cycle.',
    evidence: 'The lockfile changed during the automatic dependency refresh and requires engineering review before merge.',
    status: 'Review',
    owner: 'Reliability team',
    confidence: 'Medium',
  },
  {
    id: 'sig-103',
    title: 'Deployment health check pending',
    summary: 'The deployment completed, but the final health verification remains open.',
    evidence: 'The release was shipped successfully, but the post-deploy verification step has not yet closed.',
    status: 'Open',
    owner: 'Operations team',
    confidence: 'Medium',
  },
];

export const signalColumns = [
  { key: 'title', label: 'Signal' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
];

export const signalTableRows = signalRecords.map((record) => ({
  id: record.id,
  title: record.title,
  status: record.status,
  owner: record.owner,
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
