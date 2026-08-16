import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';

export const ISS_DRAWER_TAG = 'iss-drawer';

const VARIANTS = ['view', 'edit'] as const;
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');
let titleIdSequence = 0;

export type IssDrawerVariant = (typeof VARIANTS)[number];

function normalizeVariant(value: string | null | undefined): IssDrawerVariant {
  return VARIANTS.includes(value as IssDrawerVariant) ? (value as IssDrawerVariant) : 'view';
}

export class IssDrawer extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--iss-color-text-primary);
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
    }

    :host([data-closed]) {
      display: none;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      visibility: hidden;
      pointer-events: none;
    }

    .overlay.active,
    .overlay.closing {
      visibility: visible;
      pointer-events: auto;
    }

    .scrim {
      position: absolute;
      inset: 0;
      border: 0;
      padding: 0;
      background: oklch(0.12 0.01 250 / 0.42);
      opacity: 0;
      transition: opacity var(--iss-motion-slow);
    }

    .drawer {
      position: absolute;
      top: 0;
      right: 0;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      width: min(640px, 100vw);
      height: 100%;
      background: var(--iss-color-surface-0);
      box-shadow: var(--iss-elevation-3);
      transform: translateX(100%);
      transition: transform var(--iss-motion-slow);
      outline: none;
    }

    .overlay.active .scrim {
      opacity: 1;
    }

    .overlay.active .drawer {
      transform: translateX(0);
    }

    .header,
    .footer {
      display: flex;
      align-items: center;
      gap: var(--iss-space-3);
      padding: var(--iss-space-6);
      background: var(--iss-color-surface-0);
    }

    .header {
      justify-content: space-between;
      border-bottom: 1px solid var(--iss-color-border);
    }

    .footer {
      justify-content: flex-end;
      border-top: 1px solid var(--iss-color-border);
    }

    .body {
      min-height: 0;
      overflow: auto;
      padding: var(--iss-space-6);
    }

    .close {
      flex: 0 0 auto;
      width: 32px;
      height: 32px;
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      color: var(--iss-color-text-primary);
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
    }

    .close:focus-visible,
    .drawer:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    .overlay.closing {
      visibility: visible;
    }

    .overlay.closing .scrim {
      opacity: 0;
    }

    .overlay.closing .drawer {
      transform: translateX(100%);
    }
  `;

  @property({ type: Boolean, reflect: true })
  accessor open = false;

  @property({ reflect: true, converter: normalizeVariant })
  accessor variant: IssDrawerVariant = 'view';

  @state()
  accessor closing = false;

  private readonly titleId = `iss-drawer-title-${++titleIdSequence}`;
  private previouslyFocused: HTMLElement | null = null;
  private closeRequested = false;
  private closeTimer?: ReturnType<typeof setTimeout>;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeydown);
    this.clearCloseTimer();
    super.disconnectedCallback();
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('open')) {
      if (this.open) {
        this.clearCloseTimer();
        this.closeRequested = false;
        this.previouslyFocused = this.getRestorableActiveElement();
        this.closing = false;
        document.addEventListener('keydown', this.handleKeydown);
      } else if (changedProperties.get('open') === true) {
        this.startClosing();
      }
    }

    this.syncHostAccessibility();
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('open') && this.open) {
      void this.updateComplete.then(() => this.focusDrawer());
    }
  }

  override render() {
    const active = this.open && !this.closing;
    return html`
      <div class="overlay ${active ? 'active' : this.closing ? 'closing' : ''}" ?hidden=${!this.open && !this.closing} aria-hidden=${!active}>
        <button class="scrim" type="button" aria-label="Close" @click=${this.requestClose}></button>
        <section
          class="drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this.titleId}
          tabindex="-1"
          ?inert=${!active}
        >
          <header class="header">
            <div id=${this.titleId}><slot name="header"></slot></div>
            <button class="close" type="button" aria-label="Close" @click=${this.requestClose}>×</button>
          </header>
          <div class="body"><slot></slot></div>
          <footer class="footer"><slot name="footer"></slot></footer>
        </section>
      </div>
    `;
  }

  private handleKeydown = (event: KeyboardEvent): void => {
    if (!this.open || this.closing) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.requestClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.focusDrawer();
      return;
    }

    const activeElement = this.shadowRoot?.activeElement ?? document.activeElement;
    const currentIndex = focusable.indexOf(activeElement as HTMLElement);
    if (event.shiftKey && (currentIndex === 0 || currentIndex === -1)) {
      event.preventDefault();
      focusable[focusable.length - 1]?.focus();
    } else if (!event.shiftKey && (currentIndex === focusable.length - 1 || currentIndex === -1)) {
      event.preventDefault();
      focusable[0]?.focus();
    }
  };

  private requestClose = (): void => {
    if (!this.open || this.closeRequested) {
      return;
    }

    this.closeRequested = true;
    this.dispatchEvent(new Event('closed', { bubbles: true, composed: true }));
  };

  private focusDrawer(): void {
    if (!this.open || this.closing) {
      return;
    }

    (this.shadowRoot?.querySelector('.drawer') as HTMLElement | null)?.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const panel = this.shadowRoot?.querySelector('.drawer');
    if (!panel) {
      return [];
    }

    const elements = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    const slots = Array.from(panel.querySelectorAll<HTMLSlotElement>('slot'));
    for (const slot of slots) {
      elements.push(
        ...slot
          .assignedElements({ flatten: true })
          .filter((element): element is HTMLElement => element instanceof HTMLElement)
          .flatMap((element) => [element, ...Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))]),
      );
    }

    return elements.filter((element, index) => elements.indexOf(element) === index && !element.hidden);
  }

  private getRestorableActiveElement(): HTMLElement | null {
    let activeElement: Element | null = document.activeElement;

    while (activeElement instanceof HTMLElement && activeElement.shadowRoot?.activeElement) {
      activeElement = activeElement.shadowRoot.activeElement;
    }

    return activeElement instanceof HTMLElement && activeElement !== this ? activeElement : null;
  }

  private startClosing(): void {
    this.clearCloseTimer();
    document.removeEventListener('keydown', this.handleKeydown);
    this.closing = true;

    const duration = this.getCloseDurationMs();
    if (duration === 0) {
      queueMicrotask(() => this.finishClosing());
      return;
    }

    this.closeTimer = setTimeout(() => this.finishClosing(), duration);
  }

  private finishClosing(): void {
    this.clearCloseTimer();
    this.closing = false;
    this.restoreFocus();
    this.previouslyFocused = null;
  }

  private getCloseDurationMs(): number {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return 0;
    }

    const panel = this.shadowRoot?.querySelector('.drawer');
    const duration = panel ? getComputedStyle(panel).transitionDuration.split(',')[0].trim() : '';
    if (duration.endsWith('ms')) {
      return Number.parseFloat(duration);
    }
    if (duration.endsWith('s')) {
      return Number.parseFloat(duration) * 1000;
    }

    return 240;
  }

  private syncHostAccessibility(): void {
    const inactive = !this.open || this.closing;
    this.toggleAttribute('aria-hidden', inactive);
    this.toggleAttribute('inert', inactive);
    this.toggleAttribute('data-closed', !this.open && !this.closing);
  }

  private restoreFocus(): void {
    const target = this.previouslyFocused;
    if (target?.isConnected && typeof target.focus === 'function') {
      target.focus();
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
