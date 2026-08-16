import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
    defineIssBadge,
    defineIssButton,
    defineIssCard,
    defineIssCheckbox,
    defineIssDrawer,
    defineIssFilterBar,
    defineIssInput,
    defineIssRadio,
    defineIssSelect,
    defineIssState,
    defineIssTable,
    type IssFilterDefinition,
    type IssFilterState,
    type IssTableRow,
} from '../../index';

describe('kernel composition proofs', () => {
  beforeAll(() => {
    defineIssBadge();
    defineIssButton();
    defineIssCard();
    defineIssCheckbox();
    defineIssDrawer();
    defineIssFilterBar();
    defineIssInput();
    defineIssRadio();
    defineIssSelect();
    defineIssState();
    defineIssTable();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('composes Filter Bar, Table, and State with consumer-owned filtering', async () => {
    const filterBar = document.createElement('iss-filter-bar') as HTMLElement & {
      filters: IssFilterDefinition[];
      state: IssFilterState;
      updateComplete: Promise<unknown>;
    };
    filterBar.filters = [{
      key: 'status',
      label: 'Status',
      options: [{ value: 'open', label: 'Open' }, { value: 'blocked', label: 'Blocked' }],
    }];
    filterBar.state = { search: '', selections: {} };

    const table = document.createElement('iss-table') as HTMLElement & {
      columns: Array<{ key: string; label: string }>;
      rows: IssTableRow[];
      updateComplete: Promise<unknown>;
    };
    table.columns = [{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }];
    const allRows: IssTableRow[] = [
      { id: '1', name: 'Case 1', status: 'Open' },
      { id: '2', name: 'Case 2', status: 'Blocked' },
    ];
    table.rows = allRows;

    const state = document.createElement('iss-state') as HTMLElement & {
      status: string;
      message: string;
      updateComplete: Promise<unknown>;
    };
    state.status = 'empty';
    state.message = 'No records match the current filters.';

    const consumerState: IssFilterState[] = [];
    filterBar.addEventListener('change', (event) => {
      const nextState = (event.target as typeof filterBar).state;
      consumerState.push(nextState);
      const selectedStatus = nextState.selections.status?.[0];
      table.rows = selectedStatus
        ? allRows.filter((row) => row.status?.toString().toLowerCase() === selectedStatus)
        : allRows;
      state.status = table.rows.length === 0 ? 'empty' : 'loading';
    });

    document.body.append(filterBar, table, state);
    await Promise.all([filterBar.updateComplete, table.updateComplete, state.updateComplete]);

    const select = filterBar.shadowRoot?.querySelector('iss-select') as HTMLElement & { value: string };
    select.value = 'missing';
    select.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await Promise.all([filterBar.updateComplete, table.updateComplete, state.updateComplete]);

    expect(consumerState).toEqual([{ search: '', selections: { status: ['missing'] } }]);
    expect(table.rows).toEqual([]);
    expect(table.shadowRoot?.querySelector('iss-state')).toBeTruthy();
    expect(state.status).toBe('empty');
  });

  it('composes Drawer controls with controlled close and focus restoration', async () => {
    vi.useFakeTimers();
    const trigger = document.createElement('button');
    trigger.textContent = 'Open editor';
    document.body.appendChild(trigger);
    trigger.focus();

    const drawer = document.createElement('iss-drawer') as HTMLElement & { open: boolean; updateComplete: Promise<unknown> };
    drawer.open = true;
    const input = document.createElement('iss-input') as HTMLElement & {
      value: string;
      updateComplete: Promise<unknown>;
      shadowRoot: ShadowRoot;
    };
    input.setAttribute('label', 'Case name');
    const select = document.createElement('iss-select') as HTMLElement & {
      updateComplete: Promise<unknown>;
      shadowRoot: ShadowRoot;
    };
    select.setAttribute('label', 'Status');
    const checkbox = document.createElement('iss-checkbox') as HTMLElement & {
      checked: boolean;
      shadowRoot: ShadowRoot;
    };
    checkbox.textContent = 'Reviewed';
    const radio = document.createElement('iss-radio') as HTMLElement & {
      checked: boolean;
      shadowRoot: ShadowRoot;
    };
    radio.setAttribute('name', 'priority');
    radio.setAttribute('value', 'high');
    radio.textContent = 'High';
    const action = document.createElement('iss-button');
    action.textContent = 'Save';
    drawer.append(input, select, checkbox, radio, action);
    document.body.appendChild(drawer);
    await drawer.updateComplete;
    await Promise.resolve();
    await drawer.updateComplete;

    expect(drawer.shadowRoot?.activeElement?.classList.contains('drawer')).toBe(true);

    const inputNative = input.shadowRoot?.querySelector('input') as HTMLInputElement;
    inputNative.value = 'Updated';
    inputNative.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    const selectNative = select.shadowRoot?.querySelector('.trigger') as HTMLButtonElement;
    selectNative.click();
    await select.updateComplete;
    const checkboxNative = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement;
    checkboxNative.click();
    const radioNative = radio.shadowRoot?.querySelector('input') as HTMLInputElement;
    radioNative.click();
    const actionHandler = vi.fn();
    action.addEventListener('click', actionHandler);
    (action.shadowRoot?.querySelector('button') as HTMLButtonElement).click();

    expect(input.value).toBe('Updated');
    expect(select.shadowRoot?.querySelector('.listbox')).toBeTruthy();
    expect(checkbox.checked).toBe(true);
    expect(radio.checked).toBe(true);
    expect(actionHandler).toHaveBeenCalledTimes(1);

    const closeHandler = vi.fn();
    drawer.addEventListener('closed', closeHandler);
    (drawer.shadowRoot?.querySelector('button.close') as HTMLButtonElement).click();
    expect(closeHandler).toHaveBeenCalledTimes(1);
    drawer.open = false;
    await drawer.updateComplete;
    vi.advanceTimersByTime(240);
    await drawer.updateComplete;
    expect(document.activeElement).toBe(trigger);
  });

  it('composes a default Card with independently operable Badge and Button', async () => {
    const card = document.createElement('iss-card');
    const badge = document.createElement('iss-badge');
    badge.textContent = 'Needs review';
    const button = document.createElement('iss-button');
    button.textContent = 'Review';
    card.append(badge, button);
    document.body.appendChild(card);
    await Promise.all([
      (card as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete,
      (button as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete,
    ]);

    const clickHandler = vi.fn();
    button.addEventListener('click', clickHandler);
    (button.shadowRoot?.querySelector('button') as HTMLButtonElement).click();

    expect(card.getAttribute('variant')).toBe('default');
    expect(card.textContent).toContain('Needs review');
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
