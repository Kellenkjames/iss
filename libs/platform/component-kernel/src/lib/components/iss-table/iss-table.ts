import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

export const ISS_TABLE_TAG = 'iss-table';

const VARIANTS = ['default', 'compact'] as const;
const SORT_DIRECTIONS = ['none', 'ascending', 'descending'] as const;

export type IssTableVariant = (typeof VARIANTS)[number];
export type IssTableSortDirection = (typeof SORT_DIRECTIONS)[number];

export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
}

export type IssTableRow = Record<string, unknown>;

export interface IssTableSortDetail {
  key: string;
  direction: IssTableSortDirection;
}

function normalizeVariant(value: string | null | undefined): IssTableVariant {
  return VARIANTS.includes(value as IssTableVariant) ? (value as IssTableVariant) : 'default';
}

function normalizeSortDirection(value: string | null | undefined): IssTableSortDirection {
  return SORT_DIRECTIONS.includes(value as IssTableSortDirection)
    ? (value as IssTableSortDirection)
    : 'none';
}

export class IssTable extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--iss-color-text-primary);
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
      --_iss-table-row-height: 44px;
      --_iss-table-cell-padding-x: var(--iss-space-4);
      --_iss-table-cell-padding-y: var(--iss-space-3);
    }

    :host([variant='compact']) {
      --_iss-table-row-height: 32px;
      --_iss-table-cell-padding-y: var(--iss-space-2);
    }

    .table-wrap {
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    thead tr {
      height: var(--_iss-table-row-height);
      background: var(--iss-color-surface-1);
    }

    tbody tr {
      height: var(--_iss-table-row-height);
    }

    tbody tr:not(:last-child) {
      border-bottom: 1px solid var(--iss-color-border);
    }

    th,
    td {
      text-align: left;
      padding: var(--_iss-table-cell-padding-y) var(--_iss-table-cell-padding-x);
      vertical-align: middle;
      font-size: var(--iss-font-body-size);
    }

    th {
      color: var(--iss-color-text-muted);
      border-bottom: 1px solid var(--iss-color-border);
      font-weight: 600;
      white-space: nowrap;
    }

    td {
      color: var(--iss-color-text-primary);
    }

    .sort-button {
      display: inline-flex;
      align-items: center;
      gap: var(--iss-space-2);
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 0;
      margin: 0;
      cursor: pointer;
      min-height: 32px;
      min-width: 32px;
    }

    .sort-button:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
      border-radius: var(--iss-radius-1);
    }

    .sort-indicator {
      color: var(--iss-color-text-muted);
      font-size: 0.85em;
      line-height: 1;
    }

    .sort-button[aria-pressed='true'] .sort-indicator {
      color: var(--iss-color-text-primary);
    }
  `;

  @property({ reflect: true, converter: normalizeVariant })
  accessor variant: IssTableVariant = 'default';

  @property({ attribute: false })
  accessor columns: ColumnDef[] = [];

  @property({ attribute: false })
  accessor rows: IssTableRow[] = [];

  @property({ attribute: false })
  accessor sortKey = '';

  @property({ reflect: true, attribute: 'sort-direction', converter: normalizeSortDirection })
  accessor sortDirection: IssTableSortDirection = 'none';

  @property({ attribute: 'empty-message' })
  accessor emptyMessage = '';

  override render() {
    if (this.rows.length === 0) {
      return html`
        <iss-state status="empty" message=${this.emptyMessage}></iss-state>
      `;
    }

    return html`
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${this.columns.map((column) => this.renderHeaderCell(column))}
            </tr>
          </thead>
          <tbody>
            ${repeat(
              this.rows,
              (row, index) => this.getRowIdentity(row, index),
              (row) => html`
                <tr>
                  ${this.columns.map((column) => this.renderCell(row, column))}
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderHeaderCell(column: ColumnDef) {
    const activeSort = this.sortKey === column.key;
    const ariaSort = activeSort ? this.sortDirection : 'none';

    if (!column.sortable) {
      return html`<th scope="col">${column.label}</th>`;
    }

    return html`
      <th scope="col" aria-sort=${ariaSort}>
        <button
          class="sort-button"
          type="button"
          aria-label=${`Sort by ${column.label}`}
          @click=${() => this.handleSort(column)}
        >
          <span>${column.label}</span>
          <span class="sort-indicator" aria-hidden="true">${this.getSortIndicator(column)}</span>
        </button>
      </th>
    `;
  }

  private renderCell(row: IssTableRow, column: ColumnDef) {
    const value = row[column.key];
    const renderedValue = value == null ? '' : String(value);

    return html`<td>${renderedValue}</td>`;
  }

  private handleSort(column: ColumnDef): void {
    const direction = this.getNextSortDirection(column.key);
    this.dispatchEvent(
      new CustomEvent<IssTableSortDetail>('sort', {
        bubbles: true,
        composed: true,
        detail: {
          key: column.key,
          direction,
        },
      })
    );
  }

  private getNextSortDirection(columnKey: string): IssTableSortDirection {
    if (this.sortKey !== columnKey) {
      return 'ascending';
    }

    if (this.sortDirection === 'ascending') {
      return 'descending';
    }

    if (this.sortDirection === 'descending') {
      return 'none';
    }

    return 'ascending';
  }

  private getSortIndicator(column: ColumnDef): string {
    if (this.sortKey !== column.key || this.sortDirection === 'none') {
      return '↕';
    }

    return this.sortDirection === 'ascending' ? '↑' : '↓';
  }

  private getRowIdentity(row: IssTableRow, index: number): string | number {
    const maybeId = row['id'];
    if (typeof maybeId === 'string' || typeof maybeId === 'number') {
      return maybeId;
    }

    return index;
  }
}
