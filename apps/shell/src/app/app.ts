import { JsonPipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import type {
    ColumnDef,
    IssFilterDefinition,
    IssFilterState,
    IssSelectOption,
    IssTableRow,
    IssTableSortDetail,
} from '@iss/component-kernel';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [JsonPipe],
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
  protected checkboxChangeCount = 0;
  protected lastCheckboxState = 'Unchecked';
  protected selectValue = '';
  protected selectValues: string[] = [];
  protected selectChangeCount = 0;
  protected filterChangeCount = 0;
  protected filterState: IssFilterState = { search: '', selections: {} };
  protected filterDefinitions: IssFilterDefinition[] = [
    { key: 'status', label: 'Status', options: [
      { value: 'open', label: 'Open' },
      { value: 'review', label: 'Review' },
      { value: 'blocked', label: 'Blocked' },
    ] },
    { key: 'owner', label: 'Owner', mode: 'multi', options: [
      { value: 'alice', label: 'Alice' },
      { value: 'jordan', label: 'Jordan' },
    ] },
  ];
  protected viewDrawerOpen = false;
  protected editDrawerOpen = false;
  protected drawerCloseCount = 0;
  protected lastDrawerEvent = 'None';
  protected selectOptions: IssSelectOption[] = [
    { value: 'open', label: 'Open' },
    { value: 'review', label: 'Review' },
    { value: 'blocked', label: 'Blocked' },
  ];

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

  protected onCheckboxChange(event: Event): void {
    const target = event.target as (EventTarget & { checked?: boolean }) | null;
    this.checkboxChangeCount += 1;
    this.lastCheckboxState = target?.checked ? 'Checked' : 'Unchecked';
  }

  protected onSelectChange(event: Event): void {
    const target = event.target as (EventTarget & { value?: string }) | null;
    this.selectValue = target?.value ?? '';
    this.selectChangeCount += 1;
  }

  protected onMultiSelectChange(event: Event): void {
    const target = event.target as (EventTarget & { values?: string[] }) | null;
    this.selectValues = target?.values ?? [];
    this.selectChangeCount += 1;
  }

  protected onFilterChange(event: Event): void {
    const target = event.target as (EventTarget & { state?: IssFilterState }) | null;
    this.filterState = target?.state ?? this.filterState;
    this.filterChangeCount += 1;
  }

  protected openViewDrawer(): void {
    this.viewDrawerOpen = true;
  }

  protected openEditDrawer(): void {
    this.editDrawerOpen = true;
  }

  protected onViewDrawerClosed(): void {
    this.viewDrawerOpen = false;
    this.recordDrawerClose('view');
  }

  protected onEditDrawerClosed(): void {
    this.editDrawerOpen = false;
    this.recordDrawerClose('edit');
  }

  private recordDrawerClose(variant: 'view' | 'edit'): void {
    this.drawerCloseCount += 1;
    this.lastDrawerEvent = `${variant} closed`;
  }
}
