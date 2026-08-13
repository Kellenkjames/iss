import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';

export const ISS_CHECKBOX_TAG = 'iss-checkbox';

function createInstanceId(): string {
  const base =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return base.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export class IssCheckbox extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      color: var(--iss-color-text-primary);
      font: var(--iss-font-body-weight) var(--iss-font-body-size)/var(--iss-font-body-line-height) var(--iss-font-body-family);
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: var(--iss-space-2);
      cursor: pointer;
      user-select: none;
    }

    .control {
      position: relative;
      display: inline-flex;
      flex: 0 0 16px;
      width: 16px;
      height: 16px;
    }

    input {
      position: absolute;
      inset: 0;
      z-index: 1;
      width: 16px;
      height: 16px;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    .visual {
      position: absolute;
      inset: 0;
      box-sizing: border-box;
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      pointer-events: none;
      transition:
        border-color var(--iss-motion-fast),
        background-color var(--iss-motion-fast),
        box-shadow var(--iss-motion-fast);
    }

    input:checked + .visual,
    input:indeterminate + .visual {
      border-color: var(--iss-color-accent);
      background: var(--iss-color-accent);
    }

    input:checked + .visual::after {
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: solid var(--iss-color-surface-0);
      border-width: 0 2px 2px 0;
      content: '';
      transform: rotate(45deg);
    }

    input:indeterminate + .visual::after {
      position: absolute;
      left: 3px;
      top: 6px;
      width: 8px;
      height: 2px;
      border-radius: 1px;
      background: var(--iss-color-surface-0);
      content: '';
    }

    input:focus-visible + .visual {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    :host([disabled]) label {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host([disabled]) input {
      cursor: not-allowed;
    }
  `;

  @property({ type: Boolean, reflect: true })
  accessor checked = false;

  @property({ type: Boolean, reflect: true })
  accessor indeterminate = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  private readonly inputId = `iss-checkbox-${createInstanceId()}`;

  override render() {
    return html`
      <label for=${this.inputId}>
        <span class="control">
          <input
            id=${this.inputId}
            type="checkbox"
            .checked=${this.checked}
            .indeterminate=${this.indeterminate}
            ?disabled=${this.disabled}
            @change=${this.handleChange}
          />
          <span class="visual" aria-hidden="true"></span>
        </span>
        <span class="label"><slot></slot></span>
      </label>
    `;
  }

  private handleChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = input.indeterminate;

    if (!event.composed) {
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  };
}
