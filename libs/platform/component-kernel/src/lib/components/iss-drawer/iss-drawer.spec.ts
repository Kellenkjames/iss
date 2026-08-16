import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssButton, defineIssDrawer, IssDrawer } from '../../../index';

describe('iss-drawer', () => {
  beforeAll(() => {
    defineIssButton();
    defineIssDrawer();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  async function createDrawer(open = false): Promise<IssDrawer> {
    const drawer = document.createElement('iss-drawer') as IssDrawer;
    drawer.open = open;
    const title = document.createElement('span');
    title.slot = 'header';
    title.textContent = 'Case OPS-001';
    drawer.append(title, document.createElement('p'));
    document.body.appendChild(drawer);
    await drawer.updateComplete;
    return drawer;
  }

  async function closeDrawer(drawer: IssDrawer): Promise<void> {
    drawer.open = false;
    await drawer.updateComplete;
    vi.advanceTimersByTime(240);
    await drawer.updateComplete;
  }

  it('defaults to view and normalizes unsupported variants', async () => {
    const drawer = await createDrawer();

    expect(drawer.variant).toBe('view');
    drawer.setAttribute('variant', 'unknown');
    await drawer.updateComplete;
    expect(drawer.variant).toBe('view');

    drawer.variant = 'edit';
    await drawer.updateComplete;
    expect(drawer.variant).toBe('edit');
  });

  it('renders the dialog anatomy and associates the header title', async () => {
    const drawer = await createDrawer();
    const root = drawer.shadowRoot;
    const dialog = root?.querySelector('[role="dialog"]');
    const title = root?.querySelector('.header > div');

    expect(dialog).toBeTruthy();
    expect(dialog?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(root?.querySelector('slot[name="header"]')).toBeTruthy();
    expect(root?.querySelector('slot:not([name])')).toBeTruthy();
    expect(root?.querySelector('slot[name="footer"]')).toBeTruthy();
    expect(root?.querySelector('button.close')?.getAttribute('aria-label')).toBe('Close');
    expect(root?.querySelector('.drawer')?.getAttribute('aria-modal')).toBe('true');
  });

  it('gives multiple instances collision-safe title ids', async () => {
    const first = await createDrawer();
    const second = await createDrawer();

    const firstId = first.shadowRoot?.querySelector('.header > div')?.id;
    const secondId = second.shadowRoot?.querySelector('.header > div')?.id;
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it('activates only when externally opened and hides when closed', async () => {
    const drawer = await createDrawer();
    const overlay = () => drawer.shadowRoot?.querySelector('.overlay');

    expect(overlay()?.hasAttribute('hidden')).toBe(true);
    expect(overlay()?.getAttribute('aria-hidden')).toBe('true');

    drawer.open = true;
    await drawer.updateComplete;
    expect(overlay()?.hasAttribute('hidden')).toBe(false);
    expect(overlay()?.getAttribute('aria-hidden')).toBe('false');

    vi.useFakeTimers();
    await closeDrawer(drawer);
    expect(overlay()?.hasAttribute('hidden')).toBe(true);
    expect(drawer.shadowRoot?.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it.each([
    ['close button', (drawer: IssDrawer) => drawer.shadowRoot?.querySelector('button.close') as HTMLElement],
    ['scrim', (drawer: IssDrawer) => drawer.shadowRoot?.querySelector('button.scrim') as HTMLElement],
  ])('emits one composed bubbling closed event for %s', async (_name, trigger) => {
    const drawer = await createDrawer(true);
    const listener = vi.fn();
    drawer.addEventListener('closed', listener);

    trigger(drawer).click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0]).toMatchObject({ bubbles: true, composed: true });
  });

  it('emits one closed event for Escape and does not close from panel clicks', async () => {
    const drawer = await createDrawer(true);
    const listener = vi.fn();
    drawer.addEventListener('closed', listener);

    drawer.shadowRoot?.querySelector('.drawer')?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(listener).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('enters focus on the panel, traps focus, and restores the trigger', async () => {
    vi.useFakeTimers();
    const trigger = document.createElement('button');
    trigger.textContent = 'Open drawer';
    document.body.appendChild(trigger);
    trigger.focus();
    const drawer = await createDrawer(true);

    expect(drawer.shadowRoot?.activeElement?.classList.contains('drawer')).toBe(true);

    const first = document.createElement('button');
    first.textContent = 'First';
    const last = document.createElement('button');
    last.textContent = 'Last';
    drawer.append(first, last);
    await drawer.updateComplete;

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(drawer.shadowRoot?.activeElement).toBe(drawer.shadowRoot?.querySelector('button.close'));

    (drawer.shadowRoot?.querySelector('button.close') as HTMLElement).focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(last);

    await closeDrawer(drawer);
    expect(document.activeElement).toBe(trigger);
  });

  it('restores focus to a native control inside a custom-element trigger', async () => {
    const trigger = document.createElement('iss-button');
    document.body.appendChild(trigger);
    await (trigger as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
    const nativeTrigger = trigger.shadowRoot?.querySelector('button') as HTMLButtonElement;
    nativeTrigger.focus();
    const drawer = await createDrawer(true);

    await closeDrawerWithRealTimer(drawer);

    expect(document.activeElement).toBe(trigger);
    expect(trigger.shadowRoot?.activeElement).toBe(nativeTrigger);
  });

  it('finishes closing without a fixed delay when reduced motion is active', async () => {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const drawer = await createDrawer(true);

    drawer.open = false;
    await drawer.updateComplete;
    await Promise.resolve();
    await drawer.updateComplete;

    expect(drawer.shadowRoot?.querySelector('.overlay')?.hasAttribute('hidden')).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('handles a drawer with only its owned close control', async () => {
    const drawer = await createDrawer(true);
    const closeButton = drawer.shadowRoot?.querySelector('button.close') as HTMLElement;
    closeButton.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(drawer.shadowRoot?.activeElement).toBe(closeButton);
  });

  it('cleans up document listeners across close and disconnect', async () => {
    const drawer = await createDrawer(true);
    const listener = vi.fn();
    drawer.addEventListener('closed', listener);

    await closeDrawerWithRealTimer(drawer);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(listener).not.toHaveBeenCalled();

    drawer.open = true;
    await drawer.updateComplete;
    drawer.remove();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(listener).not.toHaveBeenCalled();
  });

  it('uses the canonical motion and drawer layout tokens', () => {
    const styles = IssDrawer.styles.toString();
    expect(styles).toContain('--iss-motion-slow');
    expect(styles).toContain('--iss-elevation-3');
    expect(styles).toContain('width: min(640px, 100vw)');
    expect(styles).toContain('grid-template-rows: auto minmax(0, 1fr) auto');
    expect(styles).not.toContain('<dialog');
  });

  async function closeDrawerWithRealTimer(drawer: IssDrawer): Promise<void> {
    drawer.open = false;
    await drawer.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await drawer.updateComplete;
  }
});
