import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { calculateFloatingPosition } from '../../floating-position';

export const ISS_SELECT_TAG = 'iss-select';

const VARIANTS = ['single', 'multi'] as const;

export type IssSelectVariant = (typeof VARIANTS)[number];

export interface IssSelectOption {
  value: string;
  label: string;
}

function normalizeVariant(value: string | null | undefined): IssSelectVariant {
  return VARIANTS.includes(value as IssSelectVariant)
    ? (value as IssSelectVariant)
    : 'single';
}

function createInstanceId(): string {
  const base =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return base.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export class IssSelect extends LitElement {
  static override styles = css`
    :host {
      display: inline-grid;
      position: relative;
      gap: var(--iss-space-1);
      width: 100%;
      color: var(--iss-color-text-primary);
      font: var(--iss-font-body-weight) var(--iss-font-body-size)/var(--iss-font-body-line-height) var(--iss-font-body-family);
    }

    .label {
      font: var(--iss-font-subheading-weight) var(--iss-font-subheading-size)/var(--iss-font-subheading-line-height) var(--iss-font-subheading-family);
      letter-spacing: var(--iss-font-subheading-letter-spacing);
    }

    .trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 44px;
      width: 100%;
      padding: var(--iss-space-2) var(--iss-space-3);
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: left;
      transition: border-color var(--iss-motion-fast), box-shadow var(--iss-motion-fast);
    }

    .trigger:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    .trigger[aria-expanded='true'] {
      border-color: var(--iss-color-accent);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--iss-color-accent) 35%, transparent);
    }

    .placeholder {
      color: var(--iss-color-text-muted);
    }

    .chevron {
      width: 8px;
      height: 8px;
      border-right: 1.5px solid currentColor;
      border-bottom: 1.5px solid currentColor;
      transform: rotate(45deg) translateY(-2px);
      transition: transform var(--iss-motion-fast);
    }

    .trigger[aria-expanded='true'] .chevron {
      transform: rotate(225deg) translate(-2px, -2px);
    }

    .listbox {
      position: fixed;
      z-index: 1;
      box-sizing: border-box;
      max-height: 240px;
      overflow: auto;
      min-width: 160px;
      padding: var(--iss-space-1) 0;
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      box-shadow: var(--iss-elevation-2);
    }

    .option {
      display: block;
      width: 100%;
      padding: var(--iss-space-2) var(--iss-space-3);
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: left;
    }

    .option:hover,
    .option[data-active] {
      background: var(--iss-color-surface-1);
    }

    .option[aria-selected='true'] {
      color: var(--iss-color-accent);
      font-weight: var(--iss-font-subheading-weight);
    }

    .message {
      margin: 0;
      color: var(--iss-color-status-danger);
      font: var(--iss-font-small-weight) var(--iss-font-small-size)/var(--iss-font-small-line-height) var(--iss-font-small-family);
    }

    :host([disabled]) {
      opacity: 0.5;
    }

    :host([data-error]) .trigger {
      border-color: var(--iss-color-status-danger);
    }
  `;

  @property({ reflect: true, converter: normalizeVariant })
  declare variant: IssSelectVariant;

  @property()
  declare label: string;

  @property({ attribute: false })
  declare options: IssSelectOption[];

  @property()
  declare value: string;

  @property({ attribute: false })
  declare values: string[];

  @property()
  declare placeholder: string;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property()
  declare error: string;

  private readonly instanceId = `iss-select-${createInstanceId()}`;
  private readonly labelId = `${this.instanceId}-label`;
  private readonly messageId = `${this.instanceId}-message`;
  private readonly listboxId = `${this.instanceId}-listbox`;
  private open = false;
  private activeIndex = -1;
  private removeDocumentListeners?: () => void;

  constructor() {
    super();
    this.variant = 'single';
    this.label = 'Select';
    this.options = [];
    this.value = '';
    this.values = [];
    this.placeholder = 'Choose an option';
    this.disabled = false;
    this.error = '';
  }

  override disconnectedCallback(): void {
    this.close();
    super.disconnectedCallback();
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('disabled') && this.disabled && this.open) {
      this.open = false;
      this.activeIndex = -1;
      this.removeDocumentListeners?.();
      this.removeDocumentListeners = undefined;
    }
    this.toggleAttribute('data-error', this.hasError);
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('variant') && this.activeIndex >= this.options.length) {
      this.activeIndex = -1;
    }
    if (this.open && (changedProperties.has('options') || changedProperties.has('disabled'))) {
      queueMicrotask(() => this.updatePosition());
    }
  }

  override render() {
    const selectedText = this.selectedText;
    return html`
      <span id=${this.labelId} class="label">${this.label}</span>
      <button
        class="trigger"
        type="button"
        aria-labelledby=${this.labelId}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-haspopup="listbox"
        aria-controls=${this.listboxId}
        aria-activedescendant=${this.open && this.activeIndex >= 0 ? this.optionId(this.activeIndex) : nothing}
        aria-invalid=${this.hasError ? 'true' : nothing}
        aria-describedby=${this.hasError ? this.messageId : nothing}
        ?disabled=${this.disabled}
        @click=${this.handleTriggerClick}
        @keydown=${this.handleTriggerKeydown}
      >
        <span class=${selectedText ? '' : 'placeholder'}>${selectedText || this.placeholder}</span>
        <span class="chevron" aria-hidden="true"></span>
      </button>
      ${this.open
        ? html`
            <div
              id=${this.listboxId}
              class="listbox"
              role="listbox"
              aria-labelledby=${this.labelId}
              aria-multiselectable=${this.variant === 'multi' ? 'true' : nothing}
            >
              ${this.options.map(
                (option, index) => html`
                  <div
                    id=${this.optionId(index)}
                    class="option"
                    role="option"
                    aria-selected=${this.isSelected(option.value) ? 'true' : 'false'}
                    ?data-active=${this.activeIndex === index}
                    @click=${() => this.selectOption(option.value)}
                  >${option.label}</div>
                `
              )}
            </div>
          `
        : nothing}
      ${this.hasError ? html`<p id=${this.messageId} class="message">${this.error}</p>` : nothing}
    `;
  }

  private get hasError(): boolean {
    return this.error.trim().length > 0;
  }

  private get selectedText(): string {
    if (this.variant === 'single') {
      return this.options.find((option) => option.value === this.value)?.label ?? '';
    }

    const selectedOptions = this.options.filter((option) => this.values.includes(option.value));
    if (selectedOptions.length === 1) {
      return selectedOptions[0].label;
    }
    return selectedOptions.length > 1 ? `${selectedOptions.length} selected` : '';
  }

  private isSelected(value: string): boolean {
    return this.variant === 'single' ? this.value === value : this.values.includes(value);
  }

  private optionId(index: number): string {
    return `${this.instanceId}-option-${index}`;
  }

  private handleTriggerClick = (): void => {
    if (this.disabled) {
      return;
    }
    if (this.open) {
      this.close();
    } else {
      this.openList();
    }
  };

  private handleTriggerKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) {
      return;
    }
    if (!this.open && ['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      this.openList(event.key === 'ArrowDown');
      return;
    }
    if (!this.open) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'Tab') {
      this.close();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.activeIndex >= 0) {
        this.selectOption(this.options[this.activeIndex].value);
      }
    }
  };

  private openList = (fromArrowDown = false): void => {
    if (this.disabled || this.open) {
      return;
    }
    this.open = true;
    this.activeIndex = fromArrowDown ? this.nextIndex(-1, 1) : this.selectedIndex;
    if (this.activeIndex < 0 && this.options.length > 0) {
      this.activeIndex = 0;
    }
    this.addDocumentListeners();
    this.requestUpdate();
    queueMicrotask(() => this.updatePosition());
  };

  private close = (): void => {
    this.open = false;
    this.activeIndex = -1;
    this.removeDocumentListeners?.();
    this.removeDocumentListeners = undefined;
    this.requestUpdate();
  };

  private moveActive(direction: 1 | -1): void {
    if (this.options.length === 0) {
      return;
    }
    this.activeIndex = this.nextIndex(this.activeIndex, direction);
    this.requestUpdate();
    queueMicrotask(() => this.shadowRoot?.getElementById(this.optionId(this.activeIndex))?.scrollIntoView?.({ block: 'nearest' }));
  }

  private nextIndex(index: number, direction: 1 | -1): number {
    if (this.options.length === 0) {
      return -1;
    }
    return (index + direction + this.options.length) % this.options.length;
  }

  private get selectedIndex(): number {
    return this.variant === 'single'
      ? this.options.findIndex((option) => option.value === this.value)
      : this.options.findIndex((option) => this.values.includes(option.value));
  }

  private selectOption(value: string): void {
    if (this.disabled) {
      return;
    }
    if (this.variant === 'single') {
      this.value = value;
      this.close();
    } else {
      this.values = this.values.includes(value)
        ? this.values.filter((selectedValue) => selectedValue !== value)
        : [...this.values, value];
    }
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  private addDocumentListeners(): void {
    const handlePointerDown = (event: PointerEvent): void => {
      if (!event.composedPath().includes(this)) {
        this.close();
      }
    };
    const handleViewportChange = (): void => this.updatePosition();
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    this.removeDocumentListeners = () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }

  private updatePosition(): void {
    if (!this.open) {
      return;
    }
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement | null;
    const listbox = this.shadowRoot?.querySelector('.listbox') as HTMLElement | null;
    if (!trigger || !listbox) {
      return;
    }
    const triggerRect = trigger.getBoundingClientRect();
    const position = calculateFloatingPosition(triggerRect, listbox.getBoundingClientRect());
    listbox.style.top = `${position.top}px`;
    listbox.style.left = `${position.left}px`;
    listbox.style.minWidth = `${triggerRect.width}px`;
  }
}
