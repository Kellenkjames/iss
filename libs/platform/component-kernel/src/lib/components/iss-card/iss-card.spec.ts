import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssBadge, defineIssButton, defineIssCard, IssCard } from '../../../index';

describe('iss-card', () => {
  beforeAll(() => {
    defineIssBadge();
    defineIssButton();
    defineIssCard();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssCard()).not.toThrow();
    expect(customElements.get('iss-card')).toBe(IssCard);
  });

  it('defaults to the default variant when no variant is provided', async () => {
    const element = document.createElement('iss-card') as IssCard;
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('default');
    expect(element.getAttribute('variant')).toBe('default');
  });

  it('normalizes unsupported variants to the default variant', async () => {
    const element = document.createElement('iss-card') as IssCard;
    element.setAttribute('variant', 'ghost');
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.variant).toBe('default');
  });

  it('renders header, body and footer slots for content composition', async () => {
    const element = document.createElement('iss-card') as IssCard;
    document.body.appendChild(element);
    await element.updateComplete;

    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]');
    const bodySlot = element.shadowRoot?.querySelector('slot:not([name])');
    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]');

    expect(headerSlot).toBeTruthy();
    expect(bodySlot).toBeTruthy();
    expect(footerSlot).toBeTruthy();
  });

  it('supports multiple nodes in the header slot', async () => {
    const element = document.createElement('iss-card') as IssCard;
    const title = document.createElement('span');
    title.slot = 'header';
    title.textContent = 'Case OPS-001';

    const badge = document.createElement('iss-badge');
    badge.slot = 'header';
    badge.textContent = 'Needs review';

    element.append(title, badge);
    document.body.appendChild(element);
    await element.updateComplete;

    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
    const assignedNodes = headerSlot.assignedNodes({ flatten: true });

    expect(assignedNodes).toHaveLength(2);
  });

  it('uses header and body content for the interactive card accessible name', async () => {
    const element = document.createElement('iss-card') as IssCard;
    element.variant = 'interactive';

    const header = document.createElement('span');
    header.slot = 'header';
    header.textContent = 'Case OPS-001';

    const body = document.createElement('p');
    body.textContent = 'Signal requires review.';

    element.append(header, body);
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Case OPS-001 Signal requires review.');
  });

  it('updates the interactive card accessible name when slotted content changes', async () => {
    const element = document.createElement('iss-card') as IssCard;
    element.variant = 'interactive';

    const header = document.createElement('span');
    header.slot = 'header';
    header.textContent = 'Case OPS-001';

    const body = document.createElement('p');
    body.textContent = 'Signal requires review.';

    element.append(header, body);
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

    header.textContent = 'Case OPS-002';
    await element.updateComplete;

    expect(button.getAttribute('aria-label')).toBe('Case OPS-002 Signal requires review.');
  });

  it('renders consumer body content through the default slot', async () => {
    const element = document.createElement('iss-card') as IssCard;
    const body = document.createElement('p');
    body.textContent = 'Signal requires review.';
    element.appendChild(body);
    document.body.appendChild(element);
    await element.updateComplete;

    const bodySlot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const assignedNodes = bodySlot.assignedNodes({ flatten: true });

    expect(assignedNodes).toHaveLength(1);
    expect(assignedNodes[0].textContent).toBe('Signal requires review.');
  });

  it('renders consumer footer content through the footer slot', async () => {
    const element = document.createElement('iss-card') as IssCard;
    const button = document.createElement('iss-button');
    button.slot = 'footer';
    button.textContent = 'Review';
    element.appendChild(button);
    document.body.appendChild(element);
    await element.updateComplete;

    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]') as HTMLSlotElement;
    const assignedNodes = footerSlot.assignedNodes({ flatten: true });

    expect(assignedNodes).toHaveLength(1);
    expect(assignedNodes[0].textContent).toBe('Review');
  });

  it('keeps the default variant non-interactive and not artificially focusable', async () => {
    const element = document.createElement('iss-card') as IssCard;
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button');
    expect(button).toBeNull();
    expect(element.tabIndex).toBe(-1);
  });

  it('uses a native button for the interactive variant and exposes click behavior', async () => {
    const element = document.createElement('iss-card') as IssCard;
    element.variant = 'interactive';
    document.body.appendChild(element);
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const clickHandler = vi.fn();
    element.addEventListener('click', clickHandler);

    button.click();

    expect(button).toBeTruthy();
    expect(button.tagName.toLowerCase()).toBe('button');
    expect(clickHandler).toHaveBeenCalled();
  });

  it('supports badge composition in the header and button composition in the footer for the default variant', async () => {
    const element = document.createElement('iss-card') as IssCard;
    const headerTitle = document.createElement('span');
    headerTitle.slot = 'header';
    headerTitle.textContent = 'Case OPS-001';

    const badge = document.createElement('iss-badge');
    badge.slot = 'header';
    badge.textContent = 'Needs review';

    const footerButton = document.createElement('iss-button');
    footerButton.slot = 'footer';
    footerButton.textContent = 'Review';

    element.append(headerTitle, badge, footerButton);
    document.body.appendChild(element);
    await element.updateComplete;

    const headerSlot = element.shadowRoot?.querySelector('slot[name="header"]') as HTMLSlotElement;
    const footerSlot = element.shadowRoot?.querySelector('slot[name="footer"]') as HTMLSlotElement;

    expect(headerSlot.assignedNodes({ flatten: true }).length).toBe(2);
    expect(footerSlot.assignedNodes({ flatten: true }).length).toBe(1);
  });

  it('references focus and elevation design tokens in its styles', () => {
    const styles = IssCard.styles.toString();
    expect(styles).toContain(':focus-visible');
    expect(styles).toContain('--iss-elevation-1');
    expect(styles).toContain('--iss-elevation-2');
    expect(styles).toContain('--iss-motion-fast');
  });

  it('lays the interactive overlay above the content container', () => {
    const styles = IssCard.styles.toString();
    expect(styles).toContain('z-index: 2;');
  });
});
