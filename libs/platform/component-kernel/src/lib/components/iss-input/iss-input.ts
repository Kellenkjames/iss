import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const ISS_INPUT_TAG = 'iss-input';

const VARIANTS = ['default', 'search', 'inline'] as const;
const INPUT_TYPES = ['text', 'search', 'email', 'url', 'tel', 'password'] as const;

export type IssInputVariant = (typeof VARIANTS)[number];
export type IssInputType = (typeof INPUT_TYPES)[number];

function normalizeVariant(value: string | null | undefined): IssInputVariant {
  return VARIANTS.includes(value as IssInputVariant)
    ? (value as IssInputVariant)
    : 'default';
}

function normalizeType(value: string | null | undefined): IssInputType {
  return INPUT_TYPES.includes(value as IssInputType)
    ? (value as IssInputType)
    : 'text';
}

function createInstanceId(): string {
  const base =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return base.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export class IssInput extends LitElement {
  static override styles = css`
    :host {
      display: inline-grid;
      gap: var(--iss-space-1);
      width: 100%;
      color: var(--iss-color-text-primary);
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
      --_iss-input-border-color: var(--iss-color-border);
      --_iss-input-bg: var(--iss-color-surface-0);
      --_iss-input-fg: var(--iss-color-text-primary);
      --_iss-input-message-color: var(--iss-color-text-muted);
    }

    .label {
      font: var(--iss-font-subheading-weight) var(--iss-font-subheading-size)/var(--iss-font-subheading-line-height) var(--iss-font-subheading-family);
      letter-spacing: var(--iss-font-subheading-letter-spacing);
    }

    .field {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      align-items: center;
      gap: var(--iss-space-2);
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
      min-height: 44px;
      padding: 0 var(--iss-space-3);
      border: 1px solid var(--_iss-input-border-color);
      border-radius: var(--iss-radius-2);
      background: var(--_iss-input-bg);
      transition:
        border-color var(--iss-motion-fast),
        box-shadow var(--iss-motion-fast),
        background-color var(--iss-motion-fast);
    }

    :host([variant='search']) .field {
      grid-template-columns: auto minmax(0, 1fr) auto;
    }

    .field:focus-within {
      border-color: var(--iss-color-accent);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--iss-color-accent) 35%, transparent);
    }

    :host([multiline]) .field {
      align-items: stretch;
      min-height: 96px;
      padding-top: var(--iss-space-2);
      padding-bottom: var(--iss-space-2);
    }

    :host([disabled]) .field {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host([readonly]) .field {
      background: var(--iss-color-surface-1);
    }

    :host([variant='inline']) .field {
      min-height: auto;
      padding-left: var(--iss-space-1);
      padding-right: var(--iss-space-1);
      border-color: transparent;
      background: transparent;
      border-radius: 0;
    }

    :host([variant='inline']) .field:focus-within {
      border-color: transparent;
      box-shadow: 0 1px 0 0 var(--iss-color-accent);
    }

    :host([variant='inline']) input {
      padding-left: var(--iss-space-1);
      padding-right: var(--iss-space-1);
      transition: padding var(--iss-motion-fast);
    }

    :host([variant='inline']) .field:focus-within input {
      padding-left: var(--iss-space-2);
      padding-right: var(--iss-space-2);
    }

    :host([data-error]) {
      --_iss-input-border-color: var(--iss-color-status-danger);
      --_iss-input-message-color: var(--iss-color-status-danger);
    }

    :host([success]) {
      --_iss-input-border-color: var(--iss-color-status-success);
      --_iss-input-message-color: var(--iss-color-status-success);
    }

    :host([data-filled]) .field {
      border-color: color-mix(in oklch, var(--_iss-input-border-color) 85%, black);
    }

    input {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      border: none;
      background: transparent;
      color: var(--_iss-input-fg);
      font: inherit;
      line-height: inherit;
      padding: var(--iss-space-2) 0;
      min-width: 0;
      outline: none;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--iss-color-text-muted);
      opacity: 1;
      transition: opacity var(--iss-motion-fast);
    }

    input:focus::placeholder,
    textarea:focus::placeholder {
      opacity: 0;
    }

    textarea {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      min-height: 80px;
      resize: vertical;
      border: none;
      background: transparent;
      color: var(--_iss-input-fg);
      font: inherit;
      line-height: inherit;
      padding: var(--iss-space-1) 0;
      min-width: 0;
      outline: none;
    }

    .search-indicator {
      position: relative;
      display: inline-block;
      width: 14px;
      height: 14px;
      color: var(--iss-color-text-muted);
      user-select: none;
    }

    .search-indicator::before {
      position: absolute;
      left: 1px;
      top: 1px;
      content: '';
      width: 8px;
      height: 8px;
      border: 1.5px solid currentColor;
      border-radius: 999px;
      box-sizing: border-box;
    }

    .search-indicator::after {
      position: absolute;
      right: 0;
      bottom: 1px;
      content: '';
      width: 5px;
      height: 1.5px;
      background: currentColor;
      border-radius: 999px;
      transform: rotate(45deg);
      transform-origin: center;
    }

    .clear {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: var(--iss-radius-2);
      background: transparent;
      color: var(--iss-color-text-muted);
      cursor: pointer;
      font: inherit;
      line-height: 1;
      min-height: 28px;
      min-width: 28px;
      padding: 0;
      transition:
        color var(--iss-motion-fast),
        background-color var(--iss-motion-fast);
    }

    .clear::before,
    .clear::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 1.5px;
      border-radius: 999px;
      background: currentColor;
    }

    .clear::before {
      transform: rotate(45deg);
    }

    .clear::after {
      transform: rotate(-45deg);
    }

    .clear:hover {
      color: var(--iss-color-text-primary);
      background: color-mix(in oklch, var(--iss-color-border) 25%, transparent);
    }

    .clear:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    .message {
      margin: 0;
      color: var(--_iss-input-message-color);
      font: var(--iss-font-small-weight) var(--iss-font-small-size)/var(--iss-font-small-line-height) var(--iss-font-small-family);
      letter-spacing: var(--iss-font-small-letter-spacing);
    }
  `;

  @property({ reflect: true, converter: normalizeVariant })
  declare variant: IssInputVariant;

  @property()
  declare label: string;

  @property()
  declare value: string;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: Boolean, reflect: true, attribute: 'readonly' })
  declare readOnly: boolean;

  @property()
  declare error: string;

  @property({ type: Boolean, reflect: true })
  declare success: boolean;

  @property()
  declare helper: string;

  @property()
  declare name: string;

  @property()
  declare placeholder: string;

  @property({ reflect: true, converter: normalizeType })
  declare type: IssInputType;

  @property({ type: Boolean, reflect: true })
  declare required: boolean;

  @property({ type: Boolean, reflect: true })
  declare multiline: boolean;

  private readonly inputId = `iss-input-${createInstanceId()}`;

  private readonly messageId = `${this.inputId}-message`;

  constructor() {
    super();
    this.variant = 'default';
    this.label = 'Input';
    this.value = '';
    this.disabled = false;
    this.readOnly = false;
    this.error = '';
    this.success = false;
    this.helper = '';
    this.name = '';
    this.placeholder = '';
    this.type = 'text';
    this.required = false;
    this.multiline = false;
  }

  protected override willUpdate(): void {
    this.toggleAttribute('data-error', this.hasError);
    this.toggleAttribute('data-filled', this.hasValue);
  }

  override render() {
    return html`
      <label class="label" for=${this.inputId}>${this.label}</label>
      <div class="field" part="field">
        ${this.variant === 'search'
          ? html`<span class="search-indicator" aria-hidden="true"></span>`
          : nothing}
        ${this.multiline
          ? html`
              <textarea
                id=${this.inputId}
                .value=${this.value}
                name=${ifDefined(this.name || undefined)}
                placeholder=${ifDefined(this.placeholder || undefined)}
                aria-invalid=${ifDefined(this.hasError ? 'true' : undefined)}
                aria-describedby=${ifDefined(this.messageText ? this.messageId : undefined)}
                ?required=${this.required}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                @input=${this.handleInput}
                @change=${this.handleChange}
              ></textarea>
            `
          : html`
              <input
                id=${this.inputId}
                .value=${this.value}
                type=${this.type}
                name=${ifDefined(this.name || undefined)}
                placeholder=${ifDefined(this.placeholder || undefined)}
                aria-invalid=${ifDefined(this.hasError ? 'true' : undefined)}
                aria-describedby=${ifDefined(this.messageText ? this.messageId : undefined)}
                ?required=${this.required}
                ?disabled=${this.disabled}
                ?readonly=${this.readOnly}
                @input=${this.handleInput}
                @change=${this.handleChange}
              />
            `}
        ${this.shouldRenderClearControl
          ? html`
              <button
                class="clear"
                type="button"
                aria-label="Clear search input"
                @click=${this.handleClear}
              ></button>
            `
          : nothing}
      </div>
      ${this.messageText
        ? html`<p id=${this.messageId} class="message" part="message">${this.messageText}</p>`
        : nothing}
    `;
  }

  private get hasValue(): boolean {
    return this.value.length > 0;
  }

  private get hasError(): boolean {
    return this.error.trim().length > 0;
  }

  private get messageText(): string {
    return this.hasError ? this.error : this.helper;
  }

  private get shouldRenderClearControl(): boolean {
    return this.variant === 'search' && this.hasValue && !this.disabled && !this.readOnly;
  }

  private handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;

    if (!event.composed) {
      this.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          composed: true,
          data: (event as InputEvent).data ?? null,
          inputType: (event as InputEvent).inputType,
          isComposing: (event as InputEvent).isComposing,
        })
      );
    }
  };

  private handleChange = (event: Event) => {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;

    if (!event.composed) {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  };

  private handleClear = () => {
    if (!this.shouldRenderClearControl) {
      return;
    }

    this.value = '';
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      input.value = '';
      input.focus();
    }

    this.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };
}
