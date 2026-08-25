import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { resolveSignalProviderConfig } from './provider-runtime-config';
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
  protected selectedSignalId = '';
  protected subject = '';
  protected context = '';
  protected question = '';
  protected status: 'empty' | 'loading' | 'error' = 'empty';
  protected message = 'Choose a signal to begin the review.';
  protected result = 'Signal interpretation will appear here.';
  protected decision: SignalDecision | '' = '';
  protected statusSummary = summarizeSignalStatuses();

  protected get selectedSignal(): SignalRecord | undefined {
    return signalRecords.find((record) => record.id === this.selectedSignalId);
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
      const response = await interpretSignal(
        { subject: this.subject, context: this.context, question: this.question },
        resolveSignalProviderConfig(),
      );

      this.status = response.success ? 'empty' : 'error';
      this.message = response.success
        ? `Signal interpreted via ${response.provider} (${response.model}).`
        : `Signal interpretation failed via ${response.provider} (${response.model}).`;
      this.result = response.payload?.interpretation ?? response.summary;
    } catch (error) {
      this.status = 'error';
      this.message = 'Signal interpretation could not be started.';
      this.result = error instanceof Error ? error.message : 'Unknown error';
    }
  }
}
