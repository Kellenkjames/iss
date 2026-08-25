import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';

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
});
