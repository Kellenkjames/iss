import { describe, expect, it } from 'vitest';
import designTokensCss from '../styles.css';

describe('design tokens', () => {
  it('emits css custom properties under the iss namespace', () => {
    expect(designTokensCss).toContain('--iss-color-accent');
    expect(designTokensCss).toContain('--iss-space-12');
    expect(designTokensCss).toContain('--iss-motion-slow');
    expect(designTokensCss).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
