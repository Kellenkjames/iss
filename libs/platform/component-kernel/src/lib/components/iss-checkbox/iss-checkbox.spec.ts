import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssCheckbox, IssCheckbox } from '../../../index';

describe('iss-checkbox', () => {
  beforeAll(() => {
    defineIssCheckbox();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssCheckbox()).not.toThrow();
    expect(customElements.get('iss-checkbox')).toBe(IssCheckbox);
  });

  it('renders a native checkbox and visible slotted label', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    element.textContent = 'Accept terms';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    const label = element.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const slot = element.shadowRoot?.querySelector('slot') as HTMLSlotElement;

    expect(input.type).toBe('checkbox');
    expect(element.textContent).toContain('Accept terms');
    expect(slot.assignedNodes()[0]?.textContent).toContain('Accept terms');
    expect(label.htmlFor).toBe(input.id);
  });

  it('starts unchecked and synchronizes external checked state', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(element.checked).toBe(false);
    expect(input.checked).toBe(false);

    element.checked = true;
    await element.updateComplete;
    expect(input.checked).toBe(true);
  });

  it('updates public checked state and surfaces composed change events', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    document.body.appendChild(element);
    await element.updateComplete;

    const changeHandler = vi.fn();
    element.addEventListener('change', changeHandler);
    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.click();
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(changeHandler).toHaveBeenCalledTimes(1);
  });

  it('synchronizes public and native indeterminate state', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    element.indeterminate = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);

    input.checked = true;
    input.indeterminate = false;
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.checked).toBe(true);
    expect(element.indeterminate).toBe(false);
  });

  it('maps disabled state to native semantics and prevents toggling', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    element.disabled = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    input.click();
    expect(element.checked).toBe(false);
  });

  it('supports label activation as one click target', async () => {
    const element = document.createElement('iss-checkbox') as IssCheckbox;
    element.textContent = 'Select record';
    document.body.appendChild(element);
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('label') as HTMLLabelElement;
    label.click();
    await element.updateComplete;

    expect(element.checked).toBe(true);
  });

  it('contains visible focus-visible styling', () => {
    expect(IssCheckbox.styles.toString()).toContain(':focus-visible');
    expect(IssCheckbox.styles.toString()).toContain('outline: 2px');
  });
});
