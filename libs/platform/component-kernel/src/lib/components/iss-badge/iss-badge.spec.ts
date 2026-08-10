import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { defineIssBadge, IssBadge } from '../../../index';

describe('iss-badge', () => {
  beforeAll(() => {
    defineIssBadge();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssBadge()).not.toThrow();
    expect(customElements.get('iss-badge')).toBe(IssBadge);
  });

  it('renders a slot for visible text content', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.textContent = 'Active';
    document.body.appendChild(element);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).toBeTruthy();
    expect(slot?.assignedNodes().length).toBeGreaterThan(0);
  });

  it('defaults tone to neutral when attribute is absent', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('neutral');
    expect(element.getAttribute('tone')).toBe('neutral');
  });

  it('accepts neutral tone explicitly', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'neutral');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('neutral');
  });

  it('accepts success tone', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'success');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('success');
    expect(element.getAttribute('tone')).toBe('success');
  });

  it('accepts warning tone', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'warning');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('warning');
    expect(element.getAttribute('tone')).toBe('warning');
  });

  it('accepts danger tone', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'danger');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('danger');
    expect(element.getAttribute('tone')).toBe('danger');
  });

  it('accepts info tone', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'info');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('info');
    expect(element.getAttribute('tone')).toBe('info');
  });

  it('normalizes unsupported tone to neutral', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', 'critical');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('neutral');
  });

  it('normalizes empty string tone to neutral', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.setAttribute('tone', '');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.tone).toBe('neutral');
  });

  it('does not render a button or link inside the shadow root', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.textContent = 'Blocked';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('button')).toBeNull();
    expect(element.shadowRoot?.querySelector('a')).toBeNull();
    expect(element.shadowRoot?.querySelector('[role="button"]')).toBeNull();
    expect(element.shadowRoot?.querySelector('[onclick]')).toBeNull();
  });

  it('does not carry inappropriate live-region role by default', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.textContent = 'Open';
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.getAttribute('role')).toBeNull();
    expect(element.getAttribute('aria-live')).toBeNull();

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot?.getAttribute('role')).toBeNull();
    expect(slot?.getAttribute('aria-live')).toBeNull();
  });

  it('does not generate label text from tone alone', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.tone = 'danger';
    document.body.appendChild(element);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    const assignedText = slot
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();

    expect(assignedText).toBe('');
  });

  it('makes slotted visible text available to assistive technology', async () => {
    const element = document.createElement('iss-badge') as IssBadge;
    element.textContent = 'Needs review';
    document.body.appendChild(element);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot') as HTMLSlotElement;
    const text = slot
      .assignedNodes({ flatten: true })
      .map((n) => n.textContent ?? '')
      .join('')
      .trim();

    expect(text).toBe('Needs review');
  });

  it('uses canonical token references for all tone colors', () => {
    const styles = IssBadge.styles.toString();
    expect(styles).toContain('--iss-color-status-success');
    expect(styles).toContain('--iss-color-status-warning');
    expect(styles).toContain('--iss-color-status-danger');
    expect(styles).toContain('--iss-color-status-info');
    expect(styles).toContain('--iss-color-surface-2');
    expect(styles).toContain('--iss-color-text-muted');
  });

  it('uses micro typography tokens', () => {
    const styles = IssBadge.styles.toString();
    expect(styles).toContain('--iss-font-micro-size');
    expect(styles).toContain('--iss-font-micro-weight');
    expect(styles).toContain('--iss-font-micro-letter-spacing');
  });
});
