import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const ISS_STATE_TAG = 'iss-state';

const STATUSES = ['empty', 'loading', 'error'] as const;

export type IssStateStatus = (typeof STATUSES)[number];

function normalizeStatus(value: string | null | undefined): IssStateStatus {
  return STATUSES.includes(value as IssStateStatus) ? (value as IssStateStatus) : 'empty';
}

export class IssState extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--iss-color-text-muted);
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
    }

    .state {
      display: grid;
      gap: var(--iss-space-2);
      justify-items: start;
      padding: var(--iss-space-8);
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
    }

    .message {
      margin: 0;
    }

    .placeholder {
      width: 100%;
      display: grid;
      gap: var(--iss-space-2);
    }

    .placeholder-row {
      height: 0.875rem;
      border-radius: var(--iss-radius-2);
      background: color-mix(in oklch, var(--iss-color-border) 55%, transparent);
    }

    .placeholder-row:nth-child(1) {
      width: 100%;
    }

    .placeholder-row:nth-child(2) {
      width: 80%;
    }

    .placeholder-row:nth-child(3) {
      width: 60%;
    }

    iss-button {
      margin-top: var(--iss-space-2);
    }
  `;

  @property({ reflect: true, converter: normalizeStatus })
  accessor status: IssStateStatus = 'empty';

  @property()
  accessor message = '';

  @property({ attribute: 'action-label' })
  accessor actionLabel = '';

  override render() {
    const loading = this.status === 'loading';
    const error = this.status === 'error';
    const showAction = !loading && this.actionLabel.trim().length > 0;

    return html`
      <section
        class="state"
        aria-busy=${ifDefined(loading ? 'true' : undefined)}
      >
        ${loading ? this.renderLoadingPlaceholder() : nothing}
        <p
          class="message"
          role=${ifDefined(error ? 'status' : undefined)}
          aria-live=${ifDefined(error ? 'polite' : undefined)}
          aria-atomic=${ifDefined(error ? 'true' : undefined)}
        >
          ${this.message}
        </p>
        ${showAction
          ? html`
              <iss-button variant="secondary" @click=${this.handleAction}>
                ${this.actionLabel}
              </iss-button>
            `
          : nothing}
      </section>
    `;
  }

  private renderLoadingPlaceholder() {
    return html`
      <div class="placeholder" aria-hidden="true">
        <span class="placeholder-row"></span>
        <span class="placeholder-row"></span>
        <span class="placeholder-row"></span>
      </div>
    `;
  }

  private handleAction = () => {
    this.dispatchEvent(
      new CustomEvent('action', {
        bubbles: true,
        composed: true,
      })
    );
  };
}
