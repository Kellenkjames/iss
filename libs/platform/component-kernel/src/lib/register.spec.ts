import { describe, expect, it } from 'vitest';
import {
    defineIssBadge,
    defineIssButton,
    defineIssInput,
    IssBadge,
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

  it('registers iss-badge and remains duplicate-safe', () => {
    expect(() => defineIssBadge()).not.toThrow();
    expect(() => defineIssBadge()).not.toThrow();
    expect(customElements.get('iss-badge')).toBe(IssBadge);
  });

  it('registers all three components via aggregate registration', () => {
    expect(() => registerIssComponents()).not.toThrow();
    expect(customElements.get('iss-button')).toBe(IssButton);
    expect(customElements.get('iss-input')).toBe(IssInput);
    expect(customElements.get('iss-badge')).toBe(IssBadge);
  });
});
