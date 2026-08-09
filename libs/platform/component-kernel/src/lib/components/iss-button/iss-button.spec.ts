import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssButton, IssButton } from '../../../index';

describe('iss-button', () => {
  beforeAll(() => {
    defineIssButton();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssButton()).not.toThrow();
    expect(customElements.get('iss-button')).toBe(IssButton);
  });

  it('renders a native button with slotted label content', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.textContent = 'Run analysis';
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    const slot = element.shadowRoot?.querySelector('slot:not([name])') as
      | HTMLSlotElement
      | undefined;

    expect(button).toBeTruthy();
    expect(slot?.assignedNodes().length).toBeGreaterThan(0);
  });

  it('supports only documented variants through attribute conversion', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.setAttribute('variant', 'secondary');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('secondary');

    element.setAttribute('variant', 'ghost');
    await element.updateComplete;

    expect(element.variant).toBe('primary');
  });

  it('maps disabled to native button semantics and blocks activation', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.disabled = true;
    document.body.appendChild(element);
    await element.updateComplete;

    let clickCount = 0;
    element.addEventListener('click', () => {
      clickCount += 1;
    });

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBe(true);
    expect(clickCount).toBe(0);
  });

  it('represents loading state with aria-busy and preserved label text', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.textContent = 'Save changes';
    element.loading = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const labelSlot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const spinner = element.shadowRoot?.querySelector('.spinner');
    const assignedLabelText = labelSlot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.disabled).toBe(true);
    expect(assignedLabelText).toBe('Save changes');
    expect(spinner).toBeTruthy();
  });

  it('surfaces normal activation as native click behavior to consumers', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.textContent = 'Export';
    document.body.appendChild(element);
    await element.updateComplete;

    let clickCount = 0;
    element.addEventListener('click', () => {
      clickCount += 1;
    });

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(clickCount).toBe(1);
  });

  it('contains implementation focus-visible styling for keyboard users', () => {
    expect(IssButton.styles.toString()).toContain(':focus-visible');
    expect(IssButton.styles.toString()).toContain('outline: 2px');
  });

  it('renders leading and trailing icon slots', async () => {
    const element = document.createElement('iss-button') as IssButton;
    element.innerHTML =
      '<span slot="leading-icon">L</span><span>Label</span><span slot="trailing-icon">T</span>';
    document.body.appendChild(element);
    await element.updateComplete;

    const leading = element.shadowRoot?.querySelector('slot[name="leading-icon"]');
    const trailing = element.shadowRoot?.querySelector('slot[name="trailing-icon"]');

    expect(leading).toBeTruthy();
    expect(trailing).toBeTruthy();
  });
});
