import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { mapCiBuildToSignal } from './signal-data';

describe('Signal System App', () => {
  it('renders the focused signal review workflow', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Signal System');
    expect(element.querySelectorAll('iss-input')).toHaveLength(3);
    expect(element.querySelector('iss-table')).not.toBeNull();
    expect(element.querySelector('[aria-labelledby="status-summary-heading"]')).not.toBeNull();
    expect(element.querySelectorAll('.status-row')).toHaveLength(3);
    expect(element.querySelector('iss-select[label="Signal"]')).not.toBeNull();
    expect(element.querySelector('iss-button')?.textContent).toContain('Interpret signal');
    expect(element.querySelector('iss-state')).not.toBeNull();
  });

  it('exposes the signal dataset and maps a selected signal into review context', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const instance = fixture.componentInstance as unknown as {
      selectedSignalId: string;
      selectedSignal: { title: string; evidence: string } | undefined;
      useSelectedSignal: () => void;
      signalRows: unknown[];
      subject: string;
      context: string;
    };

    instance.selectedSignalId = 'sig-101';
    instance.useSelectedSignal();

    expect(instance.signalRows).toHaveLength(3);
    expect(instance.selectedSignal?.title).toBe('Release build failure');
    expect(instance.subject).toBe('Release build failure');
    expect(instance.context).toContain('telemetry package update');
  });

  it('captures a human decision for the selected signal', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const instance = fixture.componentInstance as unknown as {
      selectedSignalId: string;
      useSelectedSignal: () => void;
      recordDecision: (decision: 'accept' | 'defer' | 'escalate') => void;
      decision: string;
      message: string;
    };

    instance.selectedSignalId = 'sig-101';
    instance.useSelectedSignal();
    instance.recordDecision('accept');

    expect(instance.decision).toBe('accept');
    expect(instance.message).toContain('Decision recorded');
  });

  it('shows a guided demo flow and explains the source boundary for evaluators', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('How this demo works');
    expect(element.textContent).toContain('Select a signal');
    expect(element.textContent).toContain('Keep human judgment in control');
  });

  it('maps CI source records into signals with provenance and freshness', () => {
    const signal = mapCiBuildToSignal(
      {
        recordId: 'build-test-001',
        title: 'Test build',
        summary: 'A deterministic CI fixture.',
        evidence: 'The fixture completed with a review state.',
        status: 'Review',
        owner: 'Platform team',
        confidence: 'Medium',
        observedAt: '2026-08-25T16:30:00Z',
        freshness: 'Current',
      },
      0,
    );

    expect(signal.id).toBe('sig-101');
    expect(signal.source).toEqual({
      system: 'CI',
      recordId: 'build-test-001',
      observedAt: '2026-08-25T16:30:00Z',
      freshness: 'Current',
    });
  });
});
