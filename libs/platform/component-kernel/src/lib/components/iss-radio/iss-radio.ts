import { LitElement, css, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

export const ISS_RADIO_TAG = 'iss-radio';

const radios = new Set<IssRadio>();

function createInstanceId(): string {
  const base =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return base.replace(/[^a-zA-Z0-9_-]/g, '-');
}

export class IssRadio extends LitElement {
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
      border-radius: 50%;
      background: var(--iss-color-surface-0);
      pointer-events: none;
      transition:
        border-color var(--iss-motion-fast),
        background-color var(--iss-motion-fast),
        box-shadow var(--iss-motion-fast);
    }

    input:checked + .visual {
      border-color: var(--iss-color-accent);
      background: var(--iss-color-accent);
    }

    input:checked + .visual::after {
      position: absolute;
      inset: 4px;
      border-radius: 50%;
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
  accessor disabled = false;

  @property({ type: String, reflect: true })
  accessor name = '';

  @property({ type: String, reflect: true })
  accessor value = '';

  private readonly inputId = `iss-radio-${createInstanceId()}`;

  override connectedCallback(): void {
    super.connectedCallback();
    radios.add(this);
  }

  override disconnectedCallback(): void {
    radios.delete(this);
    super.disconnectedCallback();
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (
      (changedProperties.has('checked') || changedProperties.has('name')) &&
      this.checked
    ) {
      this.uncheckPeers();
    }
  }

  override render() {
    return html`
      <label for=${this.inputId}>
        <span class="control">
          <input
            id=${this.inputId}
            type="radio"
            .checked=${this.checked}
            ?disabled=${this.disabled}
            name=${this.name}
            value=${this.value}
            @change=${this.handleChange}
          />
          <span class="visual" aria-hidden="true"></span>
        </span>
        <span class="label"><slot></slot></span>
      </label>
    `;
  }

  private handleChange = (event: Event): void => {
    event.stopPropagation();
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.uncheckPeers();
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  };

  private uncheckPeers(): void {
    if (!this.name) {
      return;
    }

    for (const peer of radios) {
      if (peer !== this && peer.name === this.name && peer.checked) {
        peer.checked = false;
        const input = peer.shadowRoot?.querySelector('input');
        if (input) {
          input.checked = false;
        }
      }
    }
  }
}
