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
    expect(compiled.querySelector('h1')?.textContent).toContain('Shell');
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

  it('shows a guided platform walkthrough for future evaluators', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Demo hub');
    expect(compiled.textContent).toContain('Start here:');
    expect(compiled.textContent).toContain('Signal System is the recommended first walkthrough');
    expect(compiled.querySelectorAll('.hub-card')).toHaveLength(4);
    expect(compiled.textContent).toContain('How this demo works');
    expect(compiled.textContent).toContain('Keep human judgment in control');
    expect(compiled.textContent).toContain('browser-safe demo mode');
  });

  it('keeps the shell on the explicit browser-safe demo provider configuration by default', () => {
    const config = resolveShellProviderConfig({});

    expect(config.provider).toBe('openai');
    expect(config.model).toBe('gpt-4o-mini');
    expect(config.apiKey).toBe('demo-key');
    expect(config.defaultSystemMessage).toContain('operational triage');
  });
});
