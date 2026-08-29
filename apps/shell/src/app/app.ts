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
import { summarizeIncidentQueue } from './incident-provider.service';
import { interpretInformation } from './interpretation-provider.service';

type DemoSurfaceCard = {
  name: string;
  purpose: string;
  boundary: string;
  experience: string;
  nextStep: string;
  launchLabel: string;
  launchUrl: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [JsonPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  private readonly defaultInterpretationSubject = 'Deployment OPS-001';
  private readonly defaultInterpretationContext = 'The dependency check failed during release validation.';
  private readonly defaultInterpretationQuestion = 'What should we inspect first?';

  protected title = 'shell';
  protected buttonClicks = 0;
  protected inputValue = 'OPS-001';
  protected stateActionCount = 0;
  protected lastStateAction = 'None';
  protected tableSortCount = 0;
  protected lastTableSort = 'None';
  protected checkboxChangeCount = 0;
  protected lastCheckboxState = 'Unchecked';
  protected radioChangeCount = 0;
  protected selectedPriority = 'None';
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
  protected aiProviderStatus: 'empty' | 'loading' | 'error' = 'empty';
  protected aiProviderMessage = 'No AI invocation has run yet.';
  protected aiProviderResponse = 'Awaiting provider execution.';
  protected interpretationSubject = '';
  protected interpretationContext = '';
  protected interpretationQuestion = '';
  protected interpretationStatus: 'empty' | 'loading' | 'error' = 'empty';
  protected interpretationMessage = 'No interpretation has been requested yet.';
  protected interpretationResponse = 'Awaiting interpretation.';
  protected demoSurfaceCards: DemoSurfaceCard[] = [
    {
      name: 'Signal System',
      purpose: 'Operational signal review demo',
      boundary: 'Flagship browser workflow with human-decision control and server-mediated interpretation.',
      experience: 'Guided signal triage with evidence inspection and explicit source-state messaging.',
      nextStep: 'Select a signal, load evidence, request interpretation, and record a human decision.',
      launchLabel: 'Open Signal System',
      launchUrl: 'http://127.0.0.1:4200/',
    },
    {
      name: 'Shell',
      purpose: 'Platform composition reference',
      boundary: 'Component-kernel and provider-boundary integration reference for ISS applications.',
      experience: 'Interactive component, provider, and telemetry boundary walkthrough.',
      nextStep: 'Use this page to inspect platform primitives and composition behavior.',
      launchLabel: 'Open Shell',
      launchUrl: 'http://127.0.0.1:4201/',
    },
    {
      name: 'Interpretation Engine',
      purpose: 'AI reasoning boundary',
      boundary: 'Focused browser consumer for concise interpretation of structured context.',
      experience: 'Single-flow interpretation review using deterministic source records.',
      nextStep: 'Choose a source record, frame context, and review interpretation output.',
      launchLabel: 'Open Interpretation Engine',
      launchUrl: 'http://127.0.0.1:4202/',
    },
    {
      name: 'Signal API',
      purpose: 'Server-only integration boundary',
      boundary: 'Read-only server contract for normalized signal retrieval and server-side interpretation.',
      experience: 'JSON endpoint surface for browser clients and integration verification.',
      nextStep: 'Inspect source payloads from /api/signals and interpretation responses from /api/interpretations.',
      launchLabel: 'Inspect Signal API',
      launchUrl: 'http://127.0.0.1:4300/api/signals',
    },
  ];

  protected onPrimaryAction(): void {
    this.buttonClicks += 1;
  }

  protected async onAiProviderAction(): Promise<void> {
    this.aiProviderStatus = 'loading';
    this.aiProviderMessage = 'Requesting AI execution through the shared provider boundary...';
    this.aiProviderResponse = 'Waiting for the response...';

    try {
      const response = await summarizeIncidentQueue({
        prompt: 'Review the current incident queue and summarize the most urgent operational action.',
        workflow: 'incident-queue-review',
        source: 'shell-app',
      });
      this.aiProviderStatus = response.success ? 'empty' : 'error';
      this.aiProviderMessage = response.success
        ? `AI execution succeeded via ${response.provider} (${response.model}).`
        : `AI execution failed via ${response.provider} (${response.model}).`;
      this.aiProviderResponse = response.summary;
    } catch (error) {
      this.aiProviderStatus = 'error';
      this.aiProviderMessage = 'AI execution failed at the boundary.';
      this.aiProviderResponse = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  protected async onInterpretationAction(): Promise<void> {
    this.interpretationStatus = 'loading';
    this.interpretationMessage = 'Interpreting the supplied context through the shared provider boundary...';
    this.interpretationResponse = 'Waiting for the interpretation...';

    try {
      const response = await interpretInformation({
        subject: this.interpretationSubject || this.defaultInterpretationSubject,
        context: this.interpretationContext || this.defaultInterpretationContext,
        question: this.interpretationQuestion || this.defaultInterpretationQuestion,
        source: 'shell-app',
      });
      this.interpretationStatus = response.success ? 'empty' : 'error';
      this.interpretationMessage = response.success
        ? `Interpretation succeeded via ${response.provider} (${response.model}).`
        : `Interpretation failed via ${response.provider} (${response.model}).`;
      this.interpretationResponse = response.payload?.interpretation ?? response.summary;
    } catch (error) {
      this.interpretationStatus = 'error';
      this.interpretationMessage = 'Interpretation could not be started.';
      this.interpretationResponse = error instanceof Error ? error.message : 'Unknown error';
    }
  }

  protected onInputChange(event: Event): void {
    const target = event.target as (EventTarget & { value?: string }) | null;
    this.inputValue = target?.value ?? '';
  }

  protected onInterpretationSubjectChange(event: Event): void {
    this.interpretationSubject = this.readInputValue(event);
  }

  protected onInterpretationContextChange(event: Event): void {
    this.interpretationContext = this.readInputValue(event);
  }

  protected onInterpretationQuestionChange(event: Event): void {
    this.interpretationQuestion = this.readInputValue(event);
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

  protected onRadioChange(event: Event): void {
    const target = event.target as (EventTarget & { value?: string }) | null;
    this.radioChangeCount += 1;
    this.selectedPriority = target?.value ?? 'None';
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

  private readInputValue(event: Event): string {
    const target = event.target as (EventTarget & { value?: string }) | null;
    return target?.value ?? '';
  }
}
