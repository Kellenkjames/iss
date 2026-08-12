import { describe, expect, it } from 'vitest';
import {
  defineIssBadge,
  defineIssButton,
  defineIssCard,
  defineIssInput,
  defineIssState,
  IssBadge,
  IssButton,
  IssCard,
  IssInput,
  IssState,
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

  it('registers iss-card and remains duplicate-safe', () => {
    expect(() => defineIssCard()).not.toThrow();
    expect(() => defineIssCard()).not.toThrow();
    expect(customElements.get('iss-card')).toBe(IssCard);
  });

  it('registers iss-state and remains duplicate-safe', () => {
    expect(() => defineIssState()).not.toThrow();
    expect(() => defineIssState()).not.toThrow();
    expect(customElements.get('iss-state')).toBe(IssState);
  });

  it('registers all components via aggregate registration', () => {
    expect(() => registerIssComponents()).not.toThrow();
    expect(customElements.get('iss-button')).toBe(IssButton);
    expect(customElements.get('iss-input')).toBe(IssInput);
    expect(customElements.get('iss-badge')).toBe(IssBadge);
    expect(customElements.get('iss-card')).toBe(IssCard);
    expect(customElements.get('iss-state')).toBe(IssState);
  });
});
