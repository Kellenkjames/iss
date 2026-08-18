import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssInput, IssInput } from '../../../index';

describe('iss-input', () => {
  beforeAll(() => {
    defineIssInput();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssInput()).not.toThrow();
    expect(customElements.get('iss-input')).toBe(IssInput);
  });

  it('renders a native input in the shadow root', async () => {
    const element = document.createElement('iss-input') as IssInput;
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('renders a native textarea when multiline is enabled', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.multiline = true;
    element.value = 'A longer question that should remain readable.';
    document.body.appendChild(element);
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    expect(textarea).toBeTruthy();
    expect(textarea.value).toBe('A longer question that should remain readable.');
    expect(element.shadowRoot?.querySelector('input')).toBeNull();
  });

  it('renders a visible label associated to input by for/id', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.label = 'Case ID';
    document.body.appendChild(element);
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(label.textContent?.trim()).toBe('Case ID');
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('maps initial and external value updates to native input value', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.value = 'ABC-123';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('ABC-123');

    element.value = 'XYZ-789';
    await element.updateComplete;

    expect(input.value).toBe('XYZ-789');
  });

  it('updates public value from user typing and surfaces input events to consumers', async () => {
    const element = document.createElement('iss-input') as IssInput;
    document.body.appendChild(element);
    await element.updateComplete;

    const hostInputHandler = vi.fn();
    element.addEventListener('input', hostInputHandler);

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'operator-42';
    input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('operator-42');
    expect(hostInputHandler).toHaveBeenCalledTimes(1);
  });

  it('surfaces multiline typing through the same public value contract', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.multiline = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'Keep the full interpretation question visible.';
    textarea.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('Keep the full interpretation question visible.');
  });

  it('surfaces change events to consumers', async () => {
    const element = document.createElement('iss-input') as IssInput;
    document.body.appendChild(element);
    await element.updateComplete;

    const hostChangeHandler = vi.fn();
    element.addEventListener('change', hostChangeHandler);

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'after-change';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.value).toBe('after-change');
    expect(hostChangeHandler).toHaveBeenCalledTimes(1);
  });

  it('supports only documented variants through attribute conversion', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.setAttribute('variant', 'search');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('search');

    element.setAttribute('variant', 'ghost');
    await element.updateComplete;

    expect(element.variant).toBe('default');
  });

  it('applies native disabled behavior to prevent editing', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.disabled = true;
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('applies native readonly behavior while preserving readability', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.readOnly = true;
    element.value = 'locked value';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('locked value');
  });

  it('renders error semantics with aria-invalid and describedby linkage', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.label = 'Case ID';
    element.error = 'Case ID is required';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    const message = element.shadowRoot?.querySelector('.message') as HTMLParagraphElement;

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(message.textContent?.trim()).toBe('Case ID is required');
    expect(input.getAttribute('aria-describedby')).toBe(message.id);
  });

  it('renders helper semantics and associates helper text via describedby', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.helper = 'Use the external case identifier.';
    document.body.appendChild(element);
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    const message = element.shadowRoot?.querySelector('.message') as HTMLParagraphElement;

    expect(message.textContent?.trim()).toBe('Use the external case identifier.');
    expect(input.getAttribute('aria-describedby')).toBe(message.id);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  it('renders search clear control only when value exists and clears value accessibly', async () => {
    const element = document.createElement('iss-input') as IssInput;
    element.variant = 'search';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.clear')).toBeNull();

    element.value = 'query';
    await element.updateComplete;

    const clearButton = element.shadowRoot?.querySelector('.clear') as HTMLButtonElement;
    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    const hostInputHandler = vi.fn();
    element.addEventListener('input', hostInputHandler);

    expect(clearButton.getAttribute('aria-label')).toBe('Clear search input');

    clearButton.click();
    await element.updateComplete;

    expect(element.value).toBe('');
    expect(input.value).toBe('');
    expect(element.shadowRoot?.activeElement).toBe(input);
    expect(hostInputHandler).toHaveBeenCalled();
  });

  it('contains implementation focus styling for keyboard users', () => {
    expect(IssInput.styles.toString()).toContain(':focus-visible');
    expect(IssInput.styles.toString()).toContain('outline: 2px');
  });

  it('transitions the placeholder away when the native control receives focus', () => {
    const styles = IssInput.styles.toString();

    expect(styles).toContain('input:focus::placeholder');
    expect(styles).toContain('opacity: 0');
    expect(styles).toContain('box-sizing: border-box');
    expect(styles).toContain('max-width: 100%');
    expect(styles).toContain('box-sizing: border-box');
    expect(styles).toContain('grid-template-columns: minmax(0, 1fr)');
    expect(styles).toContain(":host([variant='search']) .field");
  });
});
