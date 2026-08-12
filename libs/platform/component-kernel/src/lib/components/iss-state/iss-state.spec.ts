import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssButton, defineIssState, IssState } from '../../../index';

describe('iss-state', () => {
  beforeAll(() => {
    defineIssButton();
    defineIssState();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssState()).not.toThrow();
    expect(customElements.get('iss-state')).toBe(IssState);
  });

  it('defaults to empty status when no status is provided', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.status).toBe('empty');
    expect(element.getAttribute('status')).toBe('empty');
  });

  it('normalizes absent, empty-string, and unsupported status values to empty', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);
    await element.updateComplete;

    element.removeAttribute('status');
    await element.updateComplete;
    expect(element.status).toBe('empty');

    element.setAttribute('status', '');
    await element.updateComplete;
    expect(element.status).toBe('empty');

    element.setAttribute('status', 'pending');
    await element.updateComplete;
    expect(element.status).toBe('empty');
  });

  it('renders literal consumer-supplied messages for empty, loading, and error', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);

    element.status = 'empty';
    element.message = 'No records match the current filters.';
    await element.updateComplete;
    expect(getMessageText(element)).toBe('No records match the current filters.');

    element.status = 'loading';
    element.message = 'Analyzing 240 records...';
    await element.updateComplete;
    expect(getMessageText(element)).toBe('Analyzing 240 records...');

    element.status = 'error';
    element.message = "Couldn't load records. Reason follows.";
    await element.updateComplete;
    expect(getMessageText(element)).toBe("Couldn't load records. Reason follows.");
  });

  it('renders loading placeholder structure only during loading', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);

    element.status = 'loading';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.placeholder')).toBeTruthy();

    element.status = 'empty';
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('.placeholder')).toBeNull();
  });

  it('exposes aria-busy=true only during loading', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);

    element.status = 'loading';
    await element.updateComplete;

    const region = element.shadowRoot?.querySelector('.state') as HTMLElement;
    expect(region.getAttribute('aria-busy')).toBe('true');

    element.status = 'empty';
    await element.updateComplete;
    expect(region.hasAttribute('aria-busy')).toBe(false);
  });

  it('applies live-region semantics for error messages only', async () => {
    const element = document.createElement('iss-state') as IssState;
    document.body.appendChild(element);

    element.status = 'error';
    element.message = 'Unable to load cases.';
    await element.updateComplete;

    const message = element.shadowRoot?.querySelector('.message') as HTMLElement;
    expect(message.getAttribute('role')).toBe('status');
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect(message.getAttribute('aria-atomic')).toBe('true');

    element.status = 'empty';
    await element.updateComplete;
    expect(message.hasAttribute('role')).toBe(false);
    expect(message.hasAttribute('aria-live')).toBe(false);
  });

  it('renders no action when actionLabel is absent', async () => {
    const element = document.createElement('iss-state') as IssState;
    element.status = 'empty';
    element.message = 'No records match the current filters.';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('iss-button')).toBeNull();
  });

  it('renders one optional action for empty when actionLabel is provided', async () => {
    const element = document.createElement('iss-state') as IssState;
    element.status = 'empty';
    element.message = 'No records match the current filters.';
    element.actionLabel = 'Clear filters';
    document.body.appendChild(element);
    await element.updateComplete;

    const actionButton = element.shadowRoot?.querySelector('iss-button');
    expect(actionButton).toBeTruthy();
    expect(actionButton?.textContent?.trim()).toBe('Clear filters');
  });

  it('renders one optional action for error when actionLabel is provided', async () => {
    const element = document.createElement('iss-state') as IssState;
    element.status = 'error';
    element.message = 'Unable to load cases.';
    element.actionLabel = 'Retry';
    document.body.appendChild(element);
    await element.updateComplete;

    const actionButton = element.shadowRoot?.querySelector('iss-button');
    expect(actionButton).toBeTruthy();
    expect(actionButton?.textContent?.trim()).toBe('Retry');
  });

  it('never renders an action during loading even when actionLabel is provided', async () => {
    const element = document.createElement('iss-state') as IssState;
    element.status = 'loading';
    element.message = 'Loading cases...';
    element.actionLabel = 'Retry';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('iss-button')).toBeNull();
  });

  it('emits exactly one host-level action event per activation', async () => {
    const element = document.createElement('iss-state') as IssState;
    element.status = 'error';
    element.message = 'Unable to load cases.';
    element.actionLabel = 'Retry';
    document.body.appendChild(element);
    await element.updateComplete;

    const handler = vi.fn();
    element.addEventListener('action', handler);

    const actionButton = element.shadowRoot?.querySelector('iss-button') as HTMLElement;
    actionButton.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('emits action events that bubble and are composed at the host boundary', async () => {
    const container = document.createElement('div');
    const element = document.createElement('iss-state') as IssState;
    element.status = 'empty';
    element.message = 'No records match the current filters.';
    element.actionLabel = 'Clear filters';
    container.appendChild(element);
    document.body.appendChild(container);
    await element.updateComplete;

    const handler = vi.fn((event: Event) => {
      const customEvent = event as CustomEvent;
      expect(customEvent.bubbles).toBe(true);
      expect(customEvent.composed).toBe(true);
    });

    container.addEventListener('action', handler);

    const actionButton = element.shadowRoot?.querySelector('iss-button') as HTMLElement;
    actionButton.click();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not register standalone spinner or skeleton components', () => {
    expect(customElements.get('iss-spinner')).toBeUndefined();
    expect(customElements.get('iss-skeleton')).toBeUndefined();
  });

  it('uses required token references for muted text, spacing, and body font size', () => {
    const styles = IssState.styles.toString();
    expect(styles).toContain('--iss-color-text-muted');
    expect(styles).toContain('--iss-space-8');
    expect(styles).toContain('--iss-font-body-size');
  });

  function getMessageText(element: IssState): string {
    return (element.shadowRoot?.querySelector('.message')?.textContent ?? '').trim();
  }
});
