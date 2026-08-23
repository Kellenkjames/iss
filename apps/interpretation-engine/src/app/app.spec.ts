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
    expect(element.querySelector('iss-button')?.textContent).toContain('Interpret context');
    expect(element.querySelector('iss-state')).not.toBeNull();
  });
});
