import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  defineIssFilterBar,
  defineIssInput,
  defineIssSelect,
  IssFilterBar,
  type IssFilterDefinition,
  type IssFilterState,
} from '../../../index';

const statusOptions = [
  { value: 'blocked', label: 'Blocked' },
  { value: 'open', label: 'Open' },
];

const filters: IssFilterDefinition[] = [
  { key: 'status', label: 'Status', options: statusOptions },
  { key: 'owner', label: 'Owner', options: [
    { value: 'alice', label: 'Alice' },
    { value: 'jordan', label: 'Jordan' },
  ], mode: 'multi' },
];

describe('iss-filter-bar', () => {
  beforeAll(() => {
    defineIssInput();
    defineIssSelect();
    defineIssFilterBar();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  async function createFilterBar(properties: Partial<IssFilterBar> = {}): Promise<IssFilterBar> {
    const element = document.createElement('iss-filter-bar') as IssFilterBar;
    Object.assign(element, properties);
    document.body.appendChild(element);
    await element.updateComplete;
    await Promise.all([...element.shadowRoot?.querySelectorAll('iss-input, iss-select') ?? []].map((child) => (child as IssInputOrSelect).updateComplete));
    return element;
  }

  it('registers duplicate-safely and applies public defaults', async () => {
    expect(() => defineIssFilterBar()).not.toThrow();
    expect(() => defineIssFilterBar()).not.toThrow();
    const element = await createFilterBar();

    expect(customElements.get('iss-filter-bar')).toBe(IssFilterBar);
    expect(element.filters).toEqual([]);
    expect(element.state).toEqual({ search: '', selections: {} });
    expect(element.searchLabel).toBe('');
    expect(element.shadowRoot?.querySelector('iss-input')).toBeNull();
  });

  it('renders optional search and ordered single and multi selects', async () => {
    const element = await createFilterBar({ filters, searchLabel: 'Search cases' });
    const input = element.shadowRoot?.querySelector('iss-input') as IssInputOrSelect;
    const selects = [...element.shadowRoot?.querySelectorAll('iss-select') ?? []] as IssInputOrSelect[];

    expect(input.label).toBe('Search cases');
    expect(selects).toHaveLength(2);
    expect(selects.map((select) => select.label)).toEqual(['Status', 'Owner']);
    expect(selects.map((select) => select.variant)).toEqual(['single', 'multi']);
    expect(selects[0].options).toEqual(statusOptions);
  });

  it('normalizes unsupported mode to single and preserves externally supplied unmatched state', async () => {
    const element = await createFilterBar({
      filters: [{ key: 'status', label: 'Status', options: statusOptions, mode: 'unsupported' as 'single' }],
      state: { search: '', selections: { status: ['missing'], removed: ['kept'] } },
    });
    const select = element.shadowRoot?.querySelector('iss-select') as IssInputOrSelect;

    expect(select.variant).toBe('single');
    expect(element.state).toEqual({ search: '', selections: { status: ['missing'], removed: ['kept'] } });
    expect(element.shadowRoot?.querySelector('.pill')?.textContent).toContain('Status: missing');
  });

  it('updates search once, preserves selections, and contains child change events', async () => {
    const element = await createFilterBar({ filters, searchLabel: 'Search cases', state: { search: '', selections: { status: ['blocked'] } } });
    const input = element.shadowRoot?.querySelector('iss-input') as IssInputOrSelect;
    const aggregateChange = vi.fn();
    const ancestorChange = vi.fn();
    element.addEventListener('change', aggregateChange);
    document.body.addEventListener('change', ancestorChange);
    input.value = 'risk';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.state).toEqual({ search: 'risk', selections: { status: ['blocked'] } });
    expect(aggregateChange).toHaveBeenCalledTimes(1);
    expect(ancestorChange).toHaveBeenCalledTimes(1);
    expect((aggregateChange.mock.calls[0][0] as Event).target).toBe(element);
  });

  it('normalizes single and multi select changes and emits one aggregate event', async () => {
    const element = await createFilterBar({ filters, searchLabel: 'Search cases' });
    const selects = [...element.shadowRoot?.querySelectorAll('iss-select') ?? []] as IssInputOrSelect[];
    const aggregateChange = vi.fn();
    element.addEventListener('change', aggregateChange);

    selects[0].value = 'blocked';
    selects[0].dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;
    selects[1].values = ['alice', 'jordan'];
    selects[1].dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.state).toEqual({ search: '', selections: { status: ['blocked'], owner: ['alice', 'jordan'] } });
    expect(aggregateChange).toHaveBeenCalledTimes(2);
    expect((aggregateChange.mock.calls[0][0] as Event).composed).toBe(true);
  });

  it('renders and removes one pill while synchronizing its child select', async () => {
    const state: IssFilterState = { search: 'risk', selections: { status: ['blocked'], owner: ['alice', 'jordan'] } };
    const element = await createFilterBar({ filters, searchLabel: 'Search cases', state });
    const aggregateChange = vi.fn();
    element.addEventListener('change', aggregateChange);
    const pills = element.shadowRoot?.querySelectorAll('.pill');
    const removeButtons = element.shadowRoot?.querySelectorAll('.remove');

    expect(pills).toHaveLength(3);
    expect(pills?.[0].textContent).toContain('Status: Blocked');
    expect((removeButtons?.[1] as HTMLButtonElement).getAttribute('aria-label')).toBe('Remove filter: Owner = Alice');
    (removeButtons?.[1] as HTMLButtonElement).click();
    await element.updateComplete;

    expect(element.state).toEqual({ search: 'risk', selections: { status: ['blocked'], owner: ['jordan'] } });
    const ownerSelect = [...element.shadowRoot?.querySelectorAll('iss-select') ?? []][1] as IssInputOrSelect;
    expect(ownerSelect.values).toEqual(['jordan']);
    expect(aggregateChange).toHaveBeenCalledTimes(1);
  });

  it('keeps empty selection keys omitted, synchronizes external state, and clears all', async () => {
    const element = await createFilterBar({ filters, searchLabel: 'Search cases' });
    const aggregateChange = vi.fn();
    element.addEventListener('change', aggregateChange);
    element.state = { search: 'external', selections: { status: ['open'], owner: ['alice'] } };
    await element.updateComplete;
    const input = element.shadowRoot?.querySelector('iss-input') as IssInputOrSelect;
    const selects = [...element.shadowRoot?.querySelectorAll('iss-select') ?? []] as IssInputOrSelect[];

    expect(input.value).toBe('external');
    expect(selects[0].value).toBe('open');
    expect(selects[1].values).toEqual(['alice']);
    selects[0].value = '';
    selects[0].dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;
    expect(element.state.selections).not.toHaveProperty('status');

    const clear = element.shadowRoot?.querySelector('iss-button') as HTMLElement;
    clear.dispatchEvent(new Event('click', { bubbles: true, composed: true }));
    await element.updateComplete;
    expect(element.state).toEqual({ search: '', selections: {} });
    expect(input.value).toBe('');
    expect(selects[0].value).toBe('');
    expect(selects[1].values).toEqual([]);
    expect(element.shadowRoot?.querySelector('.pills')).toBeNull();
    expect(element.shadowRoot?.querySelector('iss-button')).toBeNull();
    expect(aggregateChange).toHaveBeenCalledTimes(2);
  });

  it('normalizes externally supplied empty keys in public state', async () => {
    const element = await createFilterBar({ filters });
    element.state = { search: '', selections: { status: [], removed: ['kept'] } };
    await element.updateComplete;

    expect(element.state).toEqual({ search: '', selections: { removed: ['kept'] } });
  });

  it('uses externally replaced state for the next user interaction', async () => {
    const element = await createFilterBar({ filters, searchLabel: 'Search cases' });
    element.state = { search: 'external', selections: { status: ['open'], owner: ['alice'] } };
    await element.updateComplete;

    const ownerSelect = [...element.shadowRoot?.querySelectorAll('iss-select') ?? []][1] as IssInputOrSelect;
    ownerSelect.values = ['alice', 'jordan'];
    ownerSelect.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.state).toEqual({ search: 'external', selections: { status: ['open'], owner: ['alice', 'jordan'] } });
  });
});

type IssInputOrSelect = HTMLElement & {
  updateComplete: Promise<unknown>;
  label: string;
  value: string;
  values: string[];
  variant: string;
  options: unknown[];
};
