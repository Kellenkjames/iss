import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { resolveSignalProviderConfig } from './provider-runtime-config';
import { loadSignals, requestInterpretation } from './signal-api.client';
import {
    signalColumns,
    signalRecords,
    signalSelectOptions,
    signalTableRows,
    summarizeSignalStatuses,
    type SignalRecord,
} from './signal-data';
import { interpretSignal } from './signal.service';

type SignalDecision = 'accept' | 'defer' | 'escalate';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  protected signalColumns = signalColumns;
  protected signalRows = signalTableRows;
  protected signalOptions = signalSelectOptions;
  protected signals = signalRecords;
  protected selectedSignalId = '';
  protected subject = '';
  protected context = '';
  protected question = '';
  protected status: 'empty' | 'loading' | 'error' = 'empty';
  protected message = 'Choose a signal to begin the review.';
  protected result = 'Signal interpretation will appear here.';
  protected decision: SignalDecision | '' = '';
  protected statusSummary = summarizeSignalStatuses();
  protected sourceMode: 'fixture' | 'api' | 'empty' | 'unavailable' | 'github-actions' = 'fixture';

  public async ngOnInit(): Promise<void> {
    try {
      const response = await loadSignals();
      this.signals = response.signals;
      this.signalRows = response.signals.map((signal) => ({
        id: signal.id,
        title: signal.title,
        status: signal.status,
        owner: signal.owner,
        freshness: signal.source.freshness,
      }));
      this.signalOptions = response.signals.map((signal) => ({ value: signal.id, label: signal.title }));
      this.statusSummary = summarizeSignalStatuses(response.signals);
      this.sourceMode = response.source;
      if (this.selectedSignalId && !this.selectedSignal) {
        this.selectedSignalId = '';
        this.decision = '';
      }
    } catch {
      this.sourceMode = 'fixture';
    }
  }

  protected get selectedSignal(): SignalRecord | undefined {
    return this.signals.find((record) => record.id === this.selectedSignalId);
  }

  protected onSignalChange(event: Event): void {
    const target = event.target as EventTarget & { value?: string };
    this.selectedSignalId = target.value ?? '';
    this.decision = '';
  }

  protected useSelectedSignal(): void {
    const signal = this.selectedSignal;
    if (!signal) {
      return;
    }

    this.subject = signal.title;
    this.context = signal.evidence;
    this.question = '';
    this.decision = '';
    this.message = `Signal ${signal.id} loaded for review.`;
    this.result = 'The signal evidence is ready for interpretation.';
    this.status = 'empty';
  }

  protected recordDecision(decision: SignalDecision): void {
    const signal = this.selectedSignal;
    if (!signal) {
      return;
    }

    const decisionMap: Record<SignalDecision, string> = {
      accept: 'accepted',
      defer: 'deferred',
      escalate: 'escalated',
    };

    this.decision = decision;
    this.status = 'empty';
    this.message = `Decision recorded: signal ${signal.title} was ${decisionMap[decision]}.`;
    this.result = `Human decision: ${decisionMap[decision]}. The operator retains final authority for the response.`;
  }

  protected onInput(field: 'subject' | 'context' | 'question', event: Event): void {
    const target = event.target as EventTarget & { value?: string };
    this[field] = target.value ?? '';
  }

  protected async interpret(): Promise<void> {
    this.status = 'loading';
    this.message = 'Reviewing signal evidence...';
    this.result = 'Awaiting interpretation...';

    try {
      if (this.sourceMode === 'api' || this.sourceMode === 'github-actions') {
        const response = await requestInterpretation({ subject: this.subject, evidence: this.context, question: this.question });
        this.status = response.success ? 'empty' : 'error';
        this.message = response.success
          ? `Signal interpreted via ${response.provider} (${response.model}).`
          : `Signal interpretation failed: ${response.error?.message ?? 'Unavailable.'}`;
        this.result = response.success ? response.interpretation ?? '' : 'Signal interpretation is unavailable.';
      } else {
        const response = await interpretSignal(
          { subject: this.subject, context: this.context, question: this.question },
          resolveSignalProviderConfig(),
        );
        this.status = response.success ? 'empty' : 'error';
        this.message = response.success
          ? `Signal interpreted via ${response.provider} (${response.model}).`
          : `Signal interpretation failed via ${response.provider} (${response.model}).`;
        this.result = response.payload?.interpretation ?? response.summary;
      }
    } catch (error) {
      this.status = 'error';
      this.message = 'Signal interpretation could not be started.';
      this.result = error instanceof Error ? error.message : 'Unknown error';
    }
  }
}
