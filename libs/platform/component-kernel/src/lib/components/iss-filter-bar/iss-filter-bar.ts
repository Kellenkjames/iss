import { LitElement, css, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import type { IssSelectOption } from '../iss-select/iss-select';

export const ISS_FILTER_BAR_TAG = 'iss-filter-bar';

export type IssFilterMode = 'single' | 'multi';

export interface IssFilterDefinition {
  key: string;
  label: string;
  options: IssSelectOption[];
  mode?: IssFilterMode;
}

export interface IssFilterState {
  search: string;
  selections: Record<string, string[]>;
}

function normalizeMode(mode: string | undefined): IssFilterMode {
  return mode === 'multi' ? 'multi' : 'single';
}

function normalizeState(state: IssFilterState | null | undefined): IssFilterState {
  const selections: Record<string, string[]> = {};

  for (const [key, values] of Object.entries(state?.selections ?? {})) {
    const normalizedValues = Array.isArray(values)
      ? values.filter((value): value is string => typeof value === 'string' && value.length > 0)
      : [];
    if (normalizedValues.length > 0) {
      selections[key] = [...normalizedValues];
    }
  }

  return {
    search: typeof state?.search === 'string' ? state.search : '',
    selections,
  };
}

function statesEqual(left: IssFilterState, right: IssFilterState): boolean {
  const leftKeys = Object.keys(left.selections);
  const rightKeys = Object.keys(right.selections);
  if (left.search !== right.search || leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => {
    const leftValues = left.selections[key];
    const rightValues = right.selections[key];
    return rightValues !== undefined &&
      leftValues.length === rightValues.length &&
      leftValues.every((value, index) => value === rightValues[index]);
  });
}

export class IssFilterBar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      color: var(--iss-color-text-primary);
      font-family: var(--iss-font-body-family);
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: var(--iss-space-3);
    }

    .control {
      flex: 1 1 180px;
      min-width: 160px;
    }

    .clear {
      flex: 0 0 auto;
    }

    .pills {
      display: flex;
      flex-wrap: wrap;
      gap: var(--iss-space-2);
      margin-top: var(--iss-space-3);
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: var(--iss-space-2);
      min-height: 32px;
      padding: 0 var(--iss-space-2) 0 var(--iss-space-3);
      border: 1px solid var(--iss-color-border);
      border-radius: var(--iss-radius-2);
      background: var(--iss-color-surface-1);
      color: var(--iss-color-text-primary);
      font: var(--iss-font-small-weight) var(--iss-font-small-size)/var(--iss-font-small-line-height) var(--iss-font-small-family);
    }

    .remove {
      display: inline-grid;
      place-items: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: 0;
      border-radius: var(--iss-radius-2);
      background: transparent;
      color: var(--iss-color-text-muted);
      cursor: pointer;
      font: inherit;
    }

    .remove::before,
    .remove::after {
      content: '';
      grid-area: 1 / 1;
      width: 10px;
      height: 1.5px;
      border-radius: 999px;
      background: currentColor;
    }

    .remove::before { transform: rotate(45deg); }
    .remove::after { transform: rotate(-45deg); }

    .remove:hover,
    .remove:focus-visible {
      color: var(--iss-color-text-primary);
      background: color-mix(in oklch, var(--iss-color-border) 25%, transparent);
    }

    .remove:focus-visible {
      outline: 2px solid var(--iss-color-accent);
      outline-offset: 2px;
    }
  `;

  @property({ attribute: false })
  declare filters: IssFilterDefinition[];

  @property({ attribute: false })
  declare state: IssFilterState;

  @property()
  declare searchLabel: string;

  constructor() {
    super();
    this.filters = [];
    this.state = { search: '', selections: {} };
    this.searchLabel = '';
  }

  protected override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('state')) {
      const normalizedState = normalizeState(this.state);
      if (!statesEqual(this.state, normalizedState)) {
        this.state = normalizedState;
      }
    }
  }

  override render() {
    const normalizedState = normalizeState(this.state);
    const activePills = this.activePills(normalizedState);

    return html`
      <div class="controls">
        ${this.searchLabel !== ''
          ? html`<iss-input class="control" variant="search" label=${this.searchLabel} .value=${normalizedState.search} @input=${this.handleSearchChange} @change=${this.handleSearchChange}></iss-input>`
          : nothing}
        ${this.filters.map((filter) => {
          const mode = normalizeMode(filter.mode);
          const values = normalizedState.selections[filter.key] ?? [];
          return html`
            <iss-select
              class="control"
              label=${filter.label}
              variant=${mode}
              .options=${filter.options}
              .value=${mode === 'single' ? values[0] ?? '' : ''}
              .values=${mode === 'multi' ? values : []}
              @change=${(event: Event) => this.handleSelectChange(event, filter, mode)}
            ></iss-select>
          `;
        })}
        ${this.isActive(normalizedState)
          ? html`<iss-button class="clear" variant="tertiary" aria-label="Clear all filters" @click=${this.handleClearAll}>Clear all</iss-button>`
          : nothing}
      </div>
      ${activePills.length > 0
        ? html`
            <div class="pills">
              ${activePills.map((pill) => html`
                <span class="pill">
                  <span>${pill.label}: ${pill.optionLabel}</span>
                  <button class="remove" type="button" aria-label=${`Remove filter: ${pill.label} = ${pill.optionLabel}`} @click=${() => this.handlePillRemoval(pill.key, pill.value)}></button>
                </span>
              `)}
            </div>
          `
        : nothing}
    `;
  }

  private isActive(state: IssFilterState): boolean {
    return state.search.length > 0 || Object.values(state.selections).some((values) => values.length > 0);
  }

  private activePills(state: IssFilterState): Array<{ key: string; value: string; label: string; optionLabel: string }> {
    return this.filters.flatMap((filter) => {
      const optionLabels = new Map(filter.options.map((option) => [option.value, option.label]));
      return (state.selections[filter.key] ?? []).map((value) => ({
        key: filter.key,
        value,
        label: filter.label,
        optionLabel: optionLabels.get(value) ?? value,
      }));
    });
  }

  private handleSearchChange = (event: Event): void => {
    event.stopPropagation();
    const input = event.currentTarget as HTMLElement & { value?: string };
    this.updateState({ search: input.value ?? '', selections: this.state.selections });
  };

  private handleSelectChange = (event: Event, filter: IssFilterDefinition, mode: IssFilterMode): void => {
    event.stopPropagation();
    const select = event.currentTarget as HTMLElement & { value?: string; values?: string[] };
    const selections = { ...normalizeState(this.state).selections };
    const values = mode === 'single' ? (select.value ? [select.value] : []) : (select.values ?? []);
    if (values.length > 0) {
      selections[filter.key] = [...values];
    } else {
      delete selections[filter.key];
    }
    this.updateState({ search: normalizeState(this.state).search, selections });
  };

  private handlePillRemoval = (key: string, value: string): void => {
    const current = normalizeState(this.state);
    const values = (current.selections[key] ?? []).filter((selectedValue) => selectedValue !== value);
    const selections = { ...current.selections };
    if (values.length > 0) {
      selections[key] = values;
    } else {
      delete selections[key];
    }
    this.updateState({ search: current.search, selections });
  };

  private handleClearAll = (event: Event): void => {
    event.stopPropagation();
    this.updateState({ search: '', selections: {} });
  };

  private updateState(nextState: IssFilterState): void {
    const normalizedNextState = normalizeState(nextState);
    const currentState = normalizeState(this.state);
    if (statesEqual(currentState, normalizedNextState)) {
      return;
    }
    this.state = normalizedNextState;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}
