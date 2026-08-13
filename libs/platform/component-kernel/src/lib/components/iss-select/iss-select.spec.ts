import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssSelect, IssSelect, type IssSelectOption } from '../../../index';
import { calculateFloatingPosition } from '../../floating-position';

const options: IssSelectOption[] = [
  { value: 'alpha', label: 'Alpha' },
  { value: 'beta', label: 'Beta' },
  { value: 'gamma', label: 'Gamma' },
];

describe('iss-select', () => {
  beforeAll(() => defineIssSelect());

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  async function createSelect(properties: Partial<IssSelect> = {}): Promise<IssSelect> {
    const element = document.createElement('iss-select') as IssSelect;
    Object.assign(element, { options }, properties);
    document.body.appendChild(element);
    await element.updateComplete;
    return element;
  }

  it('registers duplicate-safely and renders a native trigger with a label', async () => {
    expect(() => defineIssSelect()).not.toThrow();
    const element = await createSelect({ label: 'Priority' });
    const trigger = element.shadowRoot?.querySelector('button');
    const label = element.shadowRoot?.querySelector('.label');

    expect(customElements.get('iss-select')).toBe(IssSelect);
    expect(trigger?.type).toBe('button');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox');
    expect(label?.textContent).toBe('Priority');
  });

  it('normalizes invalid variants and preserves selection across variant changes', async () => {
    const element = await createSelect({ value: 'alpha', values: ['beta'] });
    element.setAttribute('variant', 'invalid');
    await element.updateComplete;
    expect(element.variant).toBe('single');

    element.variant = 'multi';
    await element.updateComplete;
    expect(element.value).toBe('alpha');
    expect(element.values).toEqual(['beta']);
  });

  it('opens, selects one option, updates value before one composed change, and closes', async () => {
    const element = await createSelect();
    const trigger = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const changeHandler = vi.fn((event: Event) => {
      expect((event.target as IssSelect).value).toBe('beta');
    });
    element.addEventListener('change', changeHandler);

    trigger.click();
    await element.updateComplete;
    (element.shadowRoot?.querySelectorAll('[role="option"]')[1] as HTMLElement).click();
    await element.updateComplete;

    expect(element.value).toBe('beta');
    expect(element.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();
    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler.mock.calls[0][0].bubbles).toBe(true);
    expect(changeHandler.mock.calls[0][0].composed).toBe(true);
  });

  it('supports multi selection, count text, toggling, and remains open', async () => {
    const element = await createSelect({ variant: 'multi' });
    const trigger = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const changeHandler = vi.fn();
    element.addEventListener('change', changeHandler);

    trigger.click();
    await element.updateComplete;
    let renderedOptions = element.shadowRoot?.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;
    renderedOptions[0].click();
    await element.updateComplete;
    renderedOptions = element.shadowRoot?.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;
    renderedOptions[1].click();
    await element.updateComplete;

    expect(element.values).toEqual(['alpha', 'beta']);
    expect(trigger.textContent).toContain('2 selected');
    expect(element.shadowRoot?.querySelector('[role="listbox"]')).toBeTruthy();
    expect(changeHandler).toHaveBeenCalledTimes(2);

    (element.shadowRoot?.querySelectorAll('[role="option"]')[0] as HTMLElement).click();
    await element.updateComplete;
    expect(element.values).toEqual(['beta']);
  });

  it('preserves missing selections and consumer option order', async () => {
    const element = await createSelect({ value: 'missing', values: ['missing', 'beta'] });
    expect(element.value).toBe('missing');
    expect(element.shadowRoot?.querySelector('.placeholder')?.textContent).toBe('Choose an option');

    element.variant = 'multi';
    await element.updateComplete;
    expect(element.values).toEqual(['missing', 'beta']);
    (element.shadowRoot?.querySelector('button') as HTMLButtonElement).click();
    await element.updateComplete;
    expect([...element.shadowRoot?.querySelectorAll('[role="option"]') ?? []].map((option) => option.textContent)).toEqual([
      'Alpha',
      'Beta',
      'Gamma',
    ]);
  });

  it('implements listbox semantics and keyboard navigation', async () => {
    const element = await createSelect({ variant: 'multi' });
    const trigger = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await element.updateComplete;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(element.shadowRoot?.querySelector('[role="listbox"]')?.getAttribute('aria-multiselectable')).toBe('true');
    expect(element.shadowRoot?.querySelectorAll('[role="option"]')).toHaveLength(3);
    expect(trigger.getAttribute('aria-activedescendant')).toContain('-option-0');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await element.updateComplete;
    expect(element.values).toEqual(['beta']);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await element.updateComplete;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders error semantics and prevents disabled interaction', async () => {
    const element = await createSelect({ error: 'Choose a priority', disabled: true });
    const trigger = element.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute('aria-invalid')).toBe('true');
    expect(element.shadowRoot?.querySelector('.message')?.textContent).toContain('Choose a priority');

    trigger.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();
  });

  it('closes and cleans up when disabled while open', async () => {
    const element = await createSelect();
    const trigger = element.shadowRoot?.querySelector('button') as HTMLButtonElement;

    trigger.click();
    await element.updateComplete;
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(element.shadowRoot?.querySelector('[role="listbox"]')).toBeTruthy();

    element.disabled = true;
    await element.updateComplete;

    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-activedescendant')).toBe(false);
    expect(element.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();
  });

  it('closes on outside pointer interaction and Tab while keeping instance IDs unique', async () => {
    const first = await createSelect();
    const second = await createSelect();
    const firstTrigger = first.shadowRoot?.querySelector('button') as HTMLButtonElement;
    const secondTrigger = second.shadowRoot?.querySelector('button') as HTMLButtonElement;

    expect(firstTrigger.getAttribute('aria-labelledby')).not.toBe(secondTrigger.getAttribute('aria-labelledby'));
    firstTrigger.click();
    await first.updateComplete;
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    await first.updateComplete;
    expect(first.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();

    secondTrigger.click();
    await second.updateComplete;
    secondTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    await second.updateComplete;
    expect(second.shadowRoot?.querySelector('[role="listbox"]')).toBeNull();
  });

  it('positions below when possible, flips above, and clamps horizontally', () => {
    expect(calculateFloatingPosition(
      { top: 40, bottom: 80, left: 20 } as DOMRect,
      { width: 160, height: 100 } as DOMRect,
      400,
      600
    )).toEqual({ top: 84, left: 20 });
    expect(calculateFloatingPosition(
      { top: 500, bottom: 540, left: 380 } as DOMRect,
      { width: 160, height: 100 } as DOMRect,
      400,
      600
    )).toEqual({ top: 396, left: 240 });
  });
});
