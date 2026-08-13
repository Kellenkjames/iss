import { describe, expect, it } from 'vitest';
import {
  defineIssBadge,
  defineIssButton,
  defineIssCard,
  defineIssCheckbox,
  defineIssInput,
  defineIssState,
  defineIssTable,
  IssBadge,
  IssButton,
  IssCard,
  IssCheckbox,
  IssInput,
  IssState,
  IssTable,
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

  it('registers iss-checkbox and remains duplicate-safe', () => {
    expect(() => defineIssCheckbox()).not.toThrow();
    expect(() => defineIssCheckbox()).not.toThrow();
    expect(customElements.get('iss-checkbox')).toBe(IssCheckbox);
  });

  it('registers iss-state and remains duplicate-safe', () => {
    expect(() => defineIssState()).not.toThrow();
    expect(() => defineIssState()).not.toThrow();
    expect(customElements.get('iss-state')).toBe(IssState);
  });

  it('registers iss-table and remains duplicate-safe', () => {
    expect(() => defineIssTable()).not.toThrow();
    expect(() => defineIssTable()).not.toThrow();
    expect(customElements.get('iss-table')).toBe(IssTable);
  });

  it('registers all components via aggregate registration', () => {
    expect(() => registerIssComponents()).not.toThrow();
    expect(customElements.get('iss-button')).toBe(IssButton);
    expect(customElements.get('iss-input')).toBe(IssInput);
    expect(customElements.get('iss-badge')).toBe(IssBadge);
    expect(customElements.get('iss-card')).toBe(IssCard);
    expect(customElements.get('iss-checkbox')).toBe(IssCheckbox);
    expect(customElements.get('iss-state')).toBe(IssState);
    expect(customElements.get('iss-table')).toBe(IssTable);
  });
});
