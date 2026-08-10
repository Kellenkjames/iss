import { LitElement, css, html } from 'lit';
import { property } from 'lit/decorators.js';

export const ISS_BADGE_TAG = 'iss-badge';

const TONES = ['neutral', 'success', 'warning', 'danger', 'info'] as const;

export type IssBadgeTone = (typeof TONES)[number];

function normalizeTone(value: string | null | undefined): IssBadgeTone {
  return TONES.includes(value as IssBadgeTone) ? (value as IssBadgeTone) : 'neutral';
}

export class IssBadge extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      padding: var(--iss-space-1) var(--iss-space-2);
      border-radius: var(--iss-radius-2);
      background: var(--_iss-badge-bg);
      color: var(--_iss-badge-fg);
      font-family: var(--iss-font-micro-family);
      font-size: var(--iss-font-micro-size);
      font-weight: var(--iss-font-micro-weight);
      line-height: var(--iss-font-micro-line-height);
      letter-spacing: var(--iss-font-micro-letter-spacing);
      text-transform: var(--iss-font-micro-text-transform);
      white-space: nowrap;

      /* neutral defaults */
      --_iss-badge-bg: var(--iss-color-surface-2);
      --_iss-badge-fg: var(--iss-color-text-muted);
    }

    :host([tone='success']) {
      /* 15% status color mixed into surface creates the low-opacity tint specified in anatomy */
      --_iss-badge-bg: color-mix(in oklch, var(--iss-color-status-success) 15%, var(--iss-color-surface-0));
      --_iss-badge-fg: var(--iss-color-status-success);
    }

    :host([tone='warning']) {
      --_iss-badge-bg: color-mix(in oklch, var(--iss-color-status-warning) 15%, var(--iss-color-surface-0));
      --_iss-badge-fg: var(--iss-color-status-warning);
    }

    :host([tone='danger']) {
      --_iss-badge-bg: color-mix(in oklch, var(--iss-color-status-danger) 15%, var(--iss-color-surface-0));
      --_iss-badge-fg: var(--iss-color-status-danger);
    }

    :host([tone='info']) {
      --_iss-badge-bg: color-mix(in oklch, var(--iss-color-status-info) 15%, var(--iss-color-surface-0));
      --_iss-badge-fg: var(--iss-color-status-info);
    }
  `;

  @property({ reflect: true, converter: normalizeTone })
  declare tone: IssBadgeTone;

  constructor() {
    super();
    this.tone = 'neutral';
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
