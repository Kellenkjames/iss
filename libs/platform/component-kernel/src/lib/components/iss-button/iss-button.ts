import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const ISS_BUTTON_TAG = 'iss-button';

const VARIANTS = ['primary', 'secondary', 'tertiary', 'destructive'] as const;
const BUTTON_TYPES = ['button', 'submit', 'reset'] as const;

export type IssButtonVariant = (typeof VARIANTS)[number];
export type IssButtonType = (typeof BUTTON_TYPES)[number];

function normalizeVariant(value: string | null | undefined): IssButtonVariant {
  return VARIANTS.includes(value as IssButtonVariant)
    ? (value as IssButtonVariant)
    : 'primary';
}

function normalizeType(value: string | null | undefined): IssButtonType {
  return BUTTON_TYPES.includes(value as IssButtonType)
    ? (value as IssButtonType)
    : 'button';
}

export class IssButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--iss-space-2);
      min-height: 44px;
      min-width: 44px;
      padding: 0 var(--iss-space-3);
      border: 1px solid var(--_iss-button-border-color);
      border-radius: var(--iss-radius-2);
      background: var(--_iss-button-bg);
      color: var(--_iss-button-fg);
      cursor: pointer;
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
      font-weight: 500;
      letter-spacing: var(--iss-font-body-letter-spacing);
      transition:
        background-color var(--iss-motion-fast),
        border-color var(--iss-motion-fast),
        color var(--iss-motion-fast),
        opacity var(--iss-motion-fast),
        box-shadow var(--iss-motion-fast);
    }

    button:hover:not(:disabled) {
      background: var(--_iss-button-bg-hover);
      border-color: var(--_iss-button-border-color-hover);
    }

    button:active:not(:disabled) {
      background: var(--_iss-button-bg-active);
      border-color: var(--_iss-button-border-color-active);
    }

    button:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    button:disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    .content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--iss-space-2);
    }

    :host([loading]) .content {
      opacity: 0;
    }

    .icon-slot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      position: absolute;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: iss-button-spin 800ms linear infinite;
    }

    @keyframes iss-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    :host {
      --_iss-button-bg: var(--iss-color-accent);
      --_iss-button-bg-hover: color-mix(in oklch, var(--iss-color-accent) 96%, black);
      --_iss-button-bg-active: color-mix(in oklch, var(--iss-color-accent) 92%, black);
      --_iss-button-fg: var(--iss-color-surface-0);
      --_iss-button-border-color: var(--iss-color-accent);
      --_iss-button-border-color-hover: color-mix(in oklch, var(--iss-color-accent) 96%, black);
      --_iss-button-border-color-active: color-mix(in oklch, var(--iss-color-accent) 92%, black);
    }

    :host([variant='secondary']) {
      --_iss-button-bg: var(--iss-color-surface-0);
      --_iss-button-bg-hover: color-mix(in oklch, var(--iss-color-surface-0) 96%, black);
      --_iss-button-bg-active: color-mix(in oklch, var(--iss-color-surface-0) 92%, black);
      --_iss-button-fg: var(--iss-color-text-primary);
      --_iss-button-border-color: var(--iss-color-border);
      --_iss-button-border-color-hover: color-mix(in oklch, var(--iss-color-border) 96%, black);
      --_iss-button-border-color-active: color-mix(in oklch, var(--iss-color-border) 92%, black);
    }

    :host([variant='tertiary']) {
      --_iss-button-bg: transparent;
      --_iss-button-bg-hover: color-mix(in oklch, var(--iss-color-accent) 8%, transparent);
      --_iss-button-bg-active: color-mix(in oklch, var(--iss-color-accent) 14%, transparent);
      --_iss-button-fg: var(--iss-color-accent);
      --_iss-button-border-color: transparent;
      --_iss-button-border-color-hover: transparent;
      --_iss-button-border-color-active: transparent;
    }

    :host([variant='destructive']) {
      --_iss-button-bg: var(--iss-color-status-danger);
      --_iss-button-bg-hover: color-mix(in oklch, var(--iss-color-status-danger) 96%, black);
      --_iss-button-bg-active: color-mix(in oklch, var(--iss-color-status-danger) 92%, black);
      --_iss-button-fg: var(--iss-color-surface-0);
      --_iss-button-border-color: var(--iss-color-status-danger);
      --_iss-button-border-color-hover: color-mix(in oklch, var(--iss-color-status-danger) 96%, black);
      --_iss-button-border-color-active: color-mix(in oklch, var(--iss-color-status-danger) 92%, black);
    }
  `;

  @property({ reflect: true, converter: normalizeVariant })
  declare variant: IssButtonVariant;

  @property({ type: Boolean, reflect: true })
  declare disabled: boolean;

  @property({ type: Boolean, reflect: true })
  declare loading: boolean;

  @property({ reflect: true, converter: normalizeType })
  declare type: IssButtonType;

  constructor() {
    super();
    this.variant = 'primary';
    this.disabled = false;
    this.loading = false;
    this.type = 'button';
  }

  override render() {
    const disabledOrLoading = this.disabled || this.loading;

    return html`
      <button
        type=${this.type}
        ?disabled=${disabledOrLoading}
        aria-busy=${ifDefined(this.loading ? 'true' : undefined)}
      >
        <span class="content">
          <span class="icon-slot" part="leading-icon">
            <slot name="leading-icon"></slot>
          </span>
          <span class="label" part="label">
            <slot @slotchange=${this.handleDefaultSlotChange}></slot>
          </span>
          <span class="icon-slot" part="trailing-icon">
            <slot name="trailing-icon"></slot>
          </span>
        </span>
        ${this.loading
          ? html`<span aria-hidden="true" class="spinner"></span>`
          : nothing}
      </button>
    `;
  }

  private handleDefaultSlotChange = () => {
    this.validateIconOnlyAccessibleName();
  };

  protected override firstUpdated() {
    this.validateIconOnlyAccessibleName();
  }

  private validateIconOnlyAccessibleName() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as
      | HTMLSlotElement
      | null;

    if (!slot) {
      return;
    }

    const assignedText = slot
      .assignedNodes({ flatten: true })
      .map((node) => node.textContent ?? '')
      .join('')
      .trim();

    if (assignedText.length === 0 && !this.hasAttribute('aria-label')) {
      // Warn only for icon-only usage without a name; this keeps API framework-neutral.
      console.warn(
        '<iss-button> icon-only usage requires an aria-label for accessibility.'
      );
    }
  }
}
