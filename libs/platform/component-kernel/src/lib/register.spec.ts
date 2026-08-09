import { describe, expect, it } from 'vitest';
import {
    defineIssButton,
    defineIssInput,
    IssButton,
    IssInput,
    registerIssComponents,
} from '../index';

describe('component registration', () => {
  it('keeps iss-button registration intact', () => {
    defineIssButton();
    expect(customElements.get('iss-button')).toBe(IssButton);
  });

  it('registers iss-input and remains duplicate-safe', () => {
    expect(() => defineIssInput()).not.toThrow();
    expect(() => defineIssInput()).not.toThrow();
    expect(customElements.get('iss-input')).toBe(IssInput);
  });

  it('registers both button and input via aggregate registration', () => {
    expect(() => registerIssComponents()).not.toThrow();
    expect(customElements.get('iss-button')).toBe(IssButton);
    expect(customElements.get('iss-input')).toBe(IssInput);
  });
});
