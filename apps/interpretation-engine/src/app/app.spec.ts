import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';

describe('Interpretation Engine App', () => {
  it('renders the focused interpretation workflow', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Interpretation Engine');
    expect(element.querySelectorAll('iss-input')).toHaveLength(3);
    expect(element.querySelector('iss-table')).not.toBeNull();
    expect(element.querySelector('iss-select[label="Source record"]')).not.toBeNull();
    expect(element.querySelector('iss-button')?.textContent).toContain('Interpret context');
    expect(element.querySelector('iss-state')).not.toBeNull();
  });

  it('exposes the source dataset and maps a selected record into interpretation context', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();

    const fixture = TestBed.createComponent(App);
    const instance = fixture.componentInstance as unknown as {
      selectedSourceId: string;
      selectedSource: { subject: string; context: string } | undefined;
      useSelectedSource: () => void;
      sourceRows: unknown[];
      subject: string;
      context: string;
    };
    instance.selectedSourceId = 'ops-101';
    instance.useSelectedSource();

    expect(instance.sourceRows).toHaveLength(3);
    expect(instance.selectedSource?.subject).toBe('Release build 42');
    expect(instance.subject).toBe('Release build 42');
    expect(instance.context).toContain('telemetry package update');
  });
});
