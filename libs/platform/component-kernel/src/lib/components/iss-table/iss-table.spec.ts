import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
    defineIssState,
    defineIssTable,
    IssTable,
    type ColumnDef,
    type IssTableRow,
} from '../../../index';

describe('iss-table', () => {
  const columns: ColumnDef[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
  ];

  const rows: IssTableRow[] = [
    { id: 'case-001', name: 'Case 001', status: 'Open' },
    { id: 'case-002', name: 'Case 002', status: 'Blocked' },
  ];

  beforeAll(() => {
    defineIssState();
    defineIssTable();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssTable()).not.toThrow();
    expect(customElements.get('iss-table')).toBe(IssTable);
  });

  it('defaults to the default variant when no variant is provided', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('default');
    expect(element.getAttribute('variant')).toBe('default');
  });

  it('normalizes unsupported variants to the default variant', async () => {
    const element = createTable();
    element.setAttribute('variant', 'dense');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('default');
  });

  it('supports compact variant', async () => {
    const element = createTable();
    element.variant = 'compact';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('compact');
    expect(element.getAttribute('variant')).toBe('compact');
  });

  it('renders semantic native table structure with thead and tbody', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('table')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('thead')).toBeTruthy();
    expect(element.shadowRoot?.querySelector('tbody')).toBeTruthy();
  });

  it('renders column headers with scope=col', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    const headers = Array.from(element.shadowRoot?.querySelectorAll('th') ?? []);
    expect(headers).toHaveLength(2);
    expect(headers[0].getAttribute('scope')).toBe('col');
    expect(headers[1].getAttribute('scope')).toBe('col');
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Status');
  });

  it('renders multiple rows and data cells from consumer-supplied row data', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    const bodyRows = element.shadowRoot?.querySelectorAll('tbody tr') ?? [];
    const cells = element.shadowRoot?.querySelectorAll('tbody td') ?? [];

    expect(bodyRows.length).toBe(2);
    expect(cells.length).toBe(4);
    expect(cells[0].textContent?.trim()).toBe('Case 001');
    expect(cells[1].textContent?.trim()).toBe('Open');
    expect(cells[2].textContent?.trim()).toBe('Case 002');
    expect(cells[3].textContent?.trim()).toBe('Blocked');
  });

  it('renders nullish values as empty strings', async () => {
    const element = createTable(
      columns,
      [{ id: 'case-003', name: null, status: undefined }] satisfies IssTableRow[]
    );
    document.body.appendChild(element);
    await element.updateComplete;

    const cells = element.shadowRoot?.querySelectorAll('tbody td') ?? [];
    expect(cells[0].textContent?.trim()).toBe('');
    expect(cells[1].textContent?.trim()).toBe('');
  });

  it('renders sorting affordances only for sortable columns', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    const sortableButton = element.shadowRoot?.querySelector('th .sort-button');
    const plainHeaderButton = element.shadowRoot?.querySelectorAll('th .sort-button')[1];

    expect(sortableButton).toBeTruthy();
    expect(plainHeaderButton).toBeUndefined();
  });

  it('uses native button controls for sortable headers to preserve keyboard activation semantics', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('th .sort-button');
    expect(button?.tagName.toLowerCase()).toBe('button');
  });

  it('applies aria-sort to active sortable columns', async () => {
    const element = createTable();
    element.sortKey = 'name';
    element.sortDirection = 'ascending';
    document.body.appendChild(element);
    await element.updateComplete;

    const sortableHeader = element.shadowRoot?.querySelector('th[aria-sort]');
    expect(sortableHeader?.getAttribute('aria-sort')).toBe('ascending');
  });

  it('does not expose conflicting aria-pressed state for sortable header buttons', async () => {
    const element = createTable();
    element.sortKey = 'name';
    element.sortDirection = 'none';
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('.sort-button') as HTMLButtonElement;
    const sortableHeader = element.shadowRoot?.querySelector('th[aria-sort]');

    expect(sortableHeader?.getAttribute('aria-sort')).toBe('none');
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('normalizes unsupported sort-direction values to none', async () => {
    const element = createTable();
    element.setAttribute('sort-direction', 'upward');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.sortDirection).toBe('none');
    const sortableHeader = element.shadowRoot?.querySelector('th[aria-sort]');
    expect(sortableHeader?.getAttribute('aria-sort')).toBe('none');
  });

  it('emits a composed, bubbling sort event with requested direction', async () => {
    const host = document.createElement('div');
    const element = createTable();
    host.appendChild(element);
    document.body.appendChild(host);
    await element.updateComplete;

    const handler = vi.fn((event: Event) => {
      const sortEvent = event as CustomEvent;
      expect(sortEvent.bubbles).toBe(true);
      expect(sortEvent.composed).toBe(true);
      expect(sortEvent.detail).toEqual({ key: 'name', direction: 'ascending' });
    });

    host.addEventListener('sort', handler);

    const button = element.shadowRoot?.querySelector('.sort-button') as HTMLButtonElement;
    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('cycles sort direction based on consumer-provided sort state', async () => {
    const element = createTable();
    element.sortKey = 'name';
    element.sortDirection = 'ascending';
    document.body.appendChild(element);
    await element.updateComplete;

    const handler = vi.fn();
    element.addEventListener('sort', handler);

    const button = element.shadowRoot?.querySelector('.sort-button') as HTMLButtonElement;
    button.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect((handler.mock.calls[0]?.[0] as CustomEvent).detail).toEqual({
      key: 'name',
      direction: 'descending',
    });
  });

  it('does not internally reorder consumer-supplied rows', async () => {
    const element = createTable();
    element.sortKey = 'name';
    element.sortDirection = 'ascending';
    document.body.appendChild(element);
    await element.updateComplete;

    const firstCellBefore = getFirstBodyCellText(element);

    const button = element.shadowRoot?.querySelector('.sort-button') as HTMLButtonElement;
    button.click();
    await element.updateComplete;

    const firstCellAfter = getFirstBodyCellText(element);
    expect(firstCellBefore).toBe('Case 001');
    expect(firstCellAfter).toBe('Case 001');
  });

  it('renders shared iss-state empty state when no rows are provided', async () => {
    const element = createTable(columns, []);
    element.emptyMessage = 'No records match the current filters.';
    document.body.appendChild(element);
    await element.updateComplete;

    const state = element.shadowRoot?.querySelector('iss-state');
    expect(state).toBeTruthy();
    expect(state?.getAttribute('status')).toBe('empty');
    expect(state?.getAttribute('message')).toBe('No records match the current filters.');
    expect(element.shadowRoot?.querySelector('table')).toBeNull();
  });

  it('does not render selection or pagination UI', async () => {
    const element = createTable();
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('input[type="checkbox"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('iss-checkbox')).toBeNull();
    expect(element.shadowRoot?.querySelector('nav')).toBeNull();
    expect(element.shadowRoot?.querySelector('[data-pagination]')).toBeNull();
  });

  it('references required table token families in styles', () => {
    const styles = IssTable.styles.toString();
    expect(styles).toContain('--iss-color-border');
    expect(styles).toContain('--iss-space-3');
    expect(styles).toContain('--iss-space-4');
    expect(styles).toContain('--iss-font-body-size');
  });

  function createTable(
    nextColumns: ColumnDef[] = columns,
    nextRows: IssTableRow[] = rows
  ): IssTable {
    const element = document.createElement('iss-table') as IssTable;
    element.columns = nextColumns;
    element.rows = nextRows;
    return element;
  }

  function getFirstBodyCellText(element: IssTable): string {
    return (element.shadowRoot?.querySelector('tbody td')?.textContent ?? '').trim();
  }
});
