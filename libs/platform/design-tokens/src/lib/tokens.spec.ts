/// <reference types="node" />

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const designTokensCss = readFileSync(resolve(__dirname, '../styles.css'), 'utf8');

describe('design tokens', () => {
  it('emits css custom properties under the iss namespace', () => {
    expect(designTokensCss).toContain('--iss-color-accent');
    expect(designTokensCss).toContain('--iss-space-12');
    expect(designTokensCss).toContain('--iss-radius-2: 4px;');
    expect(designTokensCss).toContain('--iss-motion-slow');
    expect(designTokensCss).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
