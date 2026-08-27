import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@iss/ai-provider': fileURLToPath(new URL('../../libs/platform/ai-provider/src/index.ts', import.meta.url)),
      '@iss/telemetry': fileURLToPath(new URL('../../libs/platform/telemetry/src/index.ts', import.meta.url)),
    },
  },
});
