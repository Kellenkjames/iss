import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineIssRadio, IssRadio } from '../../../index';

describe('iss-radio', () => {
  beforeAll(() => {
    defineIssRadio();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  async function createRadio(
    attributes: Partial<Pick<IssRadio, 'checked' | 'disabled' | 'name' | 'value'>> = {},
    label = 'Choice',
  ): Promise<IssRadio> {
    const element = document.createElement('iss-radio') as IssRadio;
    Object.assign(element, attributes);
    element.textContent = label;
    document.body.appendChild(element);
    await element.updateComplete;
    return element;
  }

  it('registers without duplicate-definition errors', () => {
    expect(() => defineIssRadio()).not.toThrow();
    expect(() => defineIssRadio()).not.toThrow();
    expect(customElements.get('iss-radio')).toBe(IssRadio);
  });

  it('renders a native radio, visible label, and unique associated ids', async () => {
    const first = await createRadio({}, 'Low');
    const second = await createRadio({}, 'Medium');
    const firstInput = first.shadowRoot?.querySelector('input') as HTMLInputElement;
    const secondInput = second.shadowRoot?.querySelector('input') as HTMLInputElement;
    const firstLabel = first.shadowRoot?.querySelector('label') as HTMLLabelElement;

    expect(firstInput.type).toBe('radio');
    expect(first.textContent).toContain('Low');
    expect(firstLabel.htmlFor).toBe(firstInput.id);
    expect(firstInput.id).not.toBe(secondInput.id);
  });

  it('uses the documented defaults and synchronizes external state', async () => {
    const element = await createRadio();
    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(element.checked).toBe(false);
    expect(element.disabled).toBe(false);
    expect(element.name).toBe('');
    expect(element.value).toBe('');
    expect(input.checked).toBe(false);

    element.checked = true;
    await element.updateComplete;
    expect(input.checked).toBe(true);

    element.checked = false;
    await element.updateComplete;
    expect(input.checked).toBe(false);
  });

  it('keeps same-name native inputs and hosts mutually exclusive', async () => {
    const first = await createRadio({ name: 'priority', value: 'low' }, 'Low');
    const second = await createRadio({ name: 'priority', value: 'medium' }, 'Medium');
    const third = await createRadio({ name: 'priority', value: 'high' }, 'High');
    const firstInput = first.shadowRoot?.querySelector('input') as HTMLInputElement;
    const secondInput = second.shadowRoot?.querySelector('input') as HTMLInputElement;
    const thirdInput = third.shadowRoot?.querySelector('input') as HTMLInputElement;

    firstInput.click();
    await first.updateComplete;
    expect(first.checked).toBe(true);
    expect(firstInput.checked).toBe(true);

    secondInput.click();
    await Promise.all([first.updateComplete, second.updateComplete]);
    expect(first.checked).toBe(false);
    expect(firstInput.checked).toBe(false);
    expect(second.checked).toBe(true);
    expect(secondInput.checked).toBe(true);

    thirdInput.click();
    await Promise.all([second.updateComplete, third.updateComplete]);
    expect(second.checked).toBe(false);
    expect(secondInput.checked).toBe(false);
    expect(third.checked).toBe(true);
    expect(thirdInput.checked).toBe(true);
  });

  it('emits one composed change with current host state and value', async () => {
    const element = await createRadio({ name: 'priority', value: 'high' });
    const input = element.shadowRoot?.querySelector('input') as HTMLInputElement;
    const changeHandler = vi.fn((event: Event) => {
      expect(event.target).toBe(element);
      expect(element.checked).toBe(true);
      expect(element.value).toBe('high');
    });
    element.addEventListener('change', changeHandler);

    input.click();

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler.mock.calls[0]?.[0].bubbles).toBe(true);
    expect(changeHandler.mock.calls[0]?.[0].composed).toBe(true);
  });

  it('does not emit or select when disabled and supports label activation', async () => {
    const enabled = await createRadio({ name: 'mode' }, 'Enabled');
    const disabled = await createRadio({ name: 'mode', disabled: true }, 'Disabled');
    const enabledLabel = enabled.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const disabledInput = disabled.shadowRoot?.querySelector('input') as HTMLInputElement;
    const disabledChange = vi.fn();
    disabled.addEventListener('change', disabledChange);

    enabledLabel.click();
    await enabled.updateComplete;
    expect(enabled.checked).toBe(true);

    disabledInput.click();
    expect(disabled.checked).toBe(false);
    expect(disabledInput.disabled).toBe(true);
    expect(disabledChange).not.toHaveBeenCalled();
  });

  it('contains visible focus-visible styling', () => {
    expect(IssRadio.styles.toString()).toContain(':focus-visible');
    expect(IssRadio.styles.toString()).toContain('outline: 2px');
  });
});
