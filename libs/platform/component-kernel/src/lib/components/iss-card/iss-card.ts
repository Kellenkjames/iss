import { LitElement, css, html } from 'lit';
import { property, state } from 'lit/decorators.js';

const DEFAULT_ARIA_LABEL = 'Card';

export const ISS_CARD_TAG = 'iss-card';

const VARIANTS = ['default', 'interactive'] as const;

export type IssCardVariant = (typeof VARIANTS)[number];

function normalizeVariant(value: string | null | undefined): IssCardVariant {
  return VARIANTS.includes(value as IssCardVariant) ? (value as IssCardVariant) : 'default';
}

export class IssCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      color: var(--iss-color-text-primary);
      font-family: var(--iss-font-body-family);
      font-size: var(--iss-font-body-size);
      line-height: var(--iss-font-body-line-height);
    }

    .card {
      position: relative;
      display: grid;
      gap: var(--iss-space-4);
      padding: var(--iss-space-4);
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-0);
      box-shadow: var(--iss-elevation-1);
      transition:
        box-shadow var(--iss-motion-fast),
        transform var(--iss-motion-fast),
        border-color var(--iss-motion-fast);
    }

    .interactive-surface {
      position: absolute;
      inset: 0;
      z-index: 2;
      border: none;
      border-radius: inherit;
      background: transparent;
      padding: 0;
      cursor: pointer;
    }

    .interactive-surface:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }

    .content {
      position: relative;
      z-index: 1;
      display: grid;
      gap: var(--iss-space-4);
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      gap: var(--iss-space-2);
      align-items: center;
      justify-content: space-between;
    }

    .body {
      display: grid;
      gap: var(--iss-space-2);
    }

    .footer {
      display: flex;
      flex-wrap: wrap;
      gap: var(--iss-space-2);
      justify-content: flex-start;
    }

    .header[hidden],
    .footer[hidden] {
      display: none;
    }

    :host([variant='interactive']) .card {
      text-align: left;
    }

    :host([variant='interactive']) .card:hover {
      box-shadow: var(--iss-elevation-2);
      transform: translateY(-1px);
    }
  `;

  @property({ reflect: true, converter: normalizeVariant })
  accessor variant: IssCardVariant = 'default';

  @state()
  accessor hasHeaderContent = false;

  @state()
  accessor hasFooterContent = false;

  private mutationObserver?: MutationObserver;

  override connectedCallback(): void {
    super.connectedCallback();
    this.observeContentChanges();
  }

  override disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected override firstUpdated(): void {
    this.syncSlotState();
    void this.updateComplete.then(() => this.syncAccessibleLabel());
  }

  protected override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('variant')) {
      this.syncSlotState();
      this.syncAccessibleLabel();
    }
  }

  override render() {
    const interactive = this.variant === 'interactive';
    const accessibleLabel = this.getAccessibleLabelText();

    return interactive
      ? html`
          <div class="card" part="card">
            <button class="interactive-surface" type="button" aria-label=${accessibleLabel}></button>
            <div class="content">
              ${this.renderHeader()}
              <div class="body" part="body">
                <slot @slotchange=${this.handleBodySlotChange}></slot>
              </div>
              ${this.renderFooter()}
            </div>
          </div>
        `
      : html`
          <div class="card" part="card">
            <div class="content">
              ${this.renderHeader()}
              <div class="body" part="body">
                <slot @slotchange=${this.handleBodySlotChange}></slot>
              </div>
              ${this.renderFooter()}
            </div>
          </div>
        `;
  }

  private renderHeader() {
    return html`
      <div class="header" part="header" ?hidden=${!this.hasHeaderContent}>
        <slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>
      </div>
    `;
  }

  private renderFooter() {
    return html`
      <div class="footer" part="footer" ?hidden=${!this.hasFooterContent}>
        <slot name="footer" @slotchange=${this.handleFooterSlotChange}></slot>
      </div>
    `;
  }

  private handleHeaderSlotChange = () => {
    this.syncSlotState();
    this.syncAccessibleLabel();
  };

  private handleBodySlotChange = () => {
    this.syncAccessibleLabel();
  };

  private handleFooterSlotChange = () => {
    this.syncSlotState();
    this.syncAccessibleLabel();
  };

  private syncSlotState(): void {
    const nextHasHeaderContent = this.hasAssignedContent('header');
    const nextHasFooterContent = this.hasAssignedContent('footer');

    if (this.hasHeaderContent !== nextHasHeaderContent || this.hasFooterContent !== nextHasFooterContent) {
      this.hasHeaderContent = nextHasHeaderContent;
      this.hasFooterContent = nextHasFooterContent;
    }
  }

  private syncAccessibleLabel(): void {
    this.requestUpdate();
  }

  private getAccessibleLabelText(): string {
    const contentText = Array.from(this.childNodes)
      .map((node) => this.getNodeTextContent(node))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return contentText || DEFAULT_ARIA_LABEL;
  }

  private getNodeTextContent(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent ?? '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    return (node as Element).textContent ?? '';
  }

  private hasAssignedContent(name: string): boolean {
    const slot = this.shadowRoot?.querySelector(`slot[name="${name}"]`) as
      | HTMLSlotElement
      | null;

    return (slot?.assignedNodes({ flatten: true }).length ?? 0) > 0;
  }

  private observeContentChanges(): void {
    this.mutationObserver?.disconnect();

    this.mutationObserver = new MutationObserver(() => {
      this.syncSlotState();
      this.syncAccessibleLabel();
    });

    this.mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}
