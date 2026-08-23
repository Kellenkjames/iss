import type { ColumnDef, IssSelectOption, IssTableRow } from '@iss/component-kernel';

/** Application-scoped deterministic fixture for the PRD-06 reference workflow. */
export interface SourceRecord {
  id: string;
  subject: string;
  context: string;
  status: 'Open' | 'Review' | 'Blocked';
  owner: string;
}

export interface SourceStatusSummary {
  status: SourceRecord['status'];
  count: number;
  percentage: number;
}

export const sourceRecords: SourceRecord[] = [
  {
    id: 'ops-101',
    subject: 'Release build 42',
    context: 'The production build is failing after the telemetry package update.',
    status: 'Blocked',
    owner: 'Platform team',
  },
  {
    id: 'ops-102',
    subject: 'Dependency review',
    context: 'A transitive dependency changed during the weekly lockfile refresh.',
    status: 'Review',
    owner: 'Reliability team',
  },
  {
    id: 'ops-103',
    subject: 'Deployment OPS-103',
    context: 'The deployment completed, but its post-release health check is still open.',
    status: 'Open',
    owner: 'Operations team',
  },
];

export const sourceColumns: ColumnDef[] = [
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
];

export const sourceSelectOptions: IssSelectOption[] = sourceRecords.map((record) => ({
  value: record.id,
  label: record.subject,
}));

export const sourceTableRows: IssTableRow[] = sourceRecords.map((record) => ({
  id: record.id,
  subject: record.subject,
  status: record.status,
  owner: record.owner,
}));

export const summarizeSourceStatuses = (records: SourceRecord[] = sourceRecords): SourceStatusSummary[] => {
  const statuses: SourceRecord['status'][] = ['Open', 'Review', 'Blocked'];

  return statuses.map((status) => {
    const count = records.filter((record) => record.status === status).length;
    return {
      status,
      count,
      percentage: records.length ? Math.round((count / records.length) * 100) : 0,
    };
  });
};
