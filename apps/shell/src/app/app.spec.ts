import { TestBed } from '@angular/core/testing';
import { App } from './app';

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
    expect(interpretationSection?.querySelector('iss-button')).not.toBeNull();
    expect(interpretationSection?.querySelector('iss-state')).not.toBeNull();
  });
});
