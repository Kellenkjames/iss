import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { resolveShellProviderConfig } from './provider-runtime-config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('ISS shell');
  });

  it('composes the interpretation consumer from kernel controls', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const interpretationSection = compiled.querySelector(
      '[aria-label="Interpretation Engine demo"]',
    );

    expect(interpretationSection).not.toBeNull();
    expect(interpretationSection?.querySelectorAll('iss-input')).toHaveLength(3);
    expect(
      interpretationSection?.querySelector('iss-input[label="Question"]')?.getAttribute('placeholder'),
    ).toBe('What should we inspect first?');
    expect(
      interpretationSection?.querySelector('iss-input[label="Context"]')?.getAttribute('placeholder'),
    ).toBe('Dependency check failed during validation.');
    expect(
      interpretationSection?.querySelector('iss-input[label="Question"]')?.hasAttribute('multiline'),
    ).toBe(false);
    expect(interpretationSection?.querySelector('iss-button')).not.toBeNull();
    expect(interpretationSection?.querySelector('iss-state')).not.toBeNull();
  });

  it('keeps the shell on the explicit browser-safe demo provider configuration by default', () => {
    const config = resolveShellProviderConfig({});

    expect(config.provider).toBe('openai');
    expect(config.model).toBe('gpt-4o-mini');
    expect(config.apiKey).toBe('demo-key');
    expect(config.defaultSystemMessage).toContain('operational triage');
  });
});
