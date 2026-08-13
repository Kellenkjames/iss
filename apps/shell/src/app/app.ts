import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type {
  ColumnDef,
  IssTableRow,
  IssTableSortDetail,
} from '@iss/component-kernel';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected title = 'shell';
  protected buttonClicks = 0;
  protected inputValue = 'OPS-001';
  protected stateActionCount = 0;
  protected lastStateAction = 'None';
  protected tableSortCount = 0;
  protected lastTableSort = 'None';

  protected tableColumns: ColumnDef[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'owner', label: 'Owner' },
  ];

  protected tableRows: IssTableRow[] = [
    { id: 'case-001', name: 'Case 001', status: 'Open', owner: 'Team Alpha' },
    { id: 'case-002', name: 'Case 002', status: 'Blocked', owner: 'Team Delta' },
    { id: 'case-003', name: 'Case 003', status: 'Review', owner: 'Team Sigma' },
  ];

  protected compactTableRows: IssTableRow[] = [
    { id: 'ops-101', name: 'OPS-101', status: 'Ready', owner: 'Ops East' },
    { id: 'ops-102', name: 'OPS-102', status: 'Pending', owner: 'Ops North' },
  ];

  protected emptyTableRows: IssTableRow[] = [];
  protected tableSortKey = '';
  protected tableSortDirection: 'none' | 'ascending' | 'descending' = 'none';

  protected onPrimaryAction(): void {
    this.buttonClicks += 1;
  }

  protected onInputChange(event: Event): void {
    const target = event.target as (EventTarget & { value?: string }) | null;
    this.inputValue = target?.value ?? '';
  }

  protected onStateAction(status: 'empty' | 'error'): void {
    this.stateActionCount += 1;
    this.lastStateAction = status;
  }

  protected onTableSort(event: Event): void {
    const customEvent = event as CustomEvent<IssTableSortDetail>;
    this.tableSortCount += 1;
    this.tableSortKey = customEvent.detail.key;
    this.tableSortDirection = customEvent.detail.direction;
    this.lastTableSort = `${customEvent.detail.key}:${customEvent.detail.direction}`;
  }
}
