# @iss/telemetry

Local-first telemetry for AI execution within ISS.

This package is intentionally small and operationally focused. It provides a minimal interface for recording AI runtime evidence and generating reviewable local reports without introducing broader observability or analytics infrastructure.

The package has two runtime-safe entry points:

- `@iss/telemetry` provides filesystem-backed JSON and Markdown output for Node-based review workflows.
- `@iss/telemetry/browser` provides the same provider callback shape with JSON history and aggregate data stored in browser `localStorage` for browser consumers such as the shell.

## Responsibilities

- record AI invocation metadata
- generate local JSON summaries
- generate local Markdown summaries
- calculate token totals and estimated cost
- keep telemetry local-first and reviewable by engineers

## Explicit non-responsibilities

- dashboards
- cloud telemetry
- product analytics
- user analytics
- alerting
- real-time monitoring
- provider benchmarking
- prompt persistence
- secret storage

## Example

```ts
import { createTelemetry } from '@iss/telemetry';

const telemetry = createTelemetry({ outputDir: './tmp/telemetry' });

telemetry.recordInvocation({
  provider: 'openai',
  model: 'gpt-4o-mini',
  promptTokens: 120,
  completionTokens: 350,
  totalTokens: 470,
  estimatedCostUsd: 0.003,
  latencyMs: 840,
  invocationContext: { workflow: 'summarize', requestId: 'abc-123' },
  success: true,
});

console.log(telemetry.generateMarkdownReport());
```

Browser consumers should use the browser entry point at the application bootstrap boundary:

```ts
import { createBrowserTelemetry } from '@iss/telemetry/browser';

const telemetry = createBrowserTelemetry();
```

Applications still do not call `recordInvocation` directly. The AI Provider owns invocation capture; the runtime bootstrap only supplies the appropriate Telemetry implementation for its environment.
