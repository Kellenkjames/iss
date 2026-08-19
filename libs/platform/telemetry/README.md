# @iss/telemetry

Local-first telemetry for AI execution within ISS.

This package is intentionally small and operationally focused. It provides a minimal interface for recording AI runtime evidence and generating reviewable local reports without introducing broader observability or analytics infrastructure.

The package has two runtime-safe entry points:

- `@iss/telemetry` provides filesystem-backed JSON and Markdown output for Node-based review workflows.
- `@iss/telemetry/browser` provides the same provider callback shape with JSON history and aggregate data stored in browser `localStorage` for browser consumers such as the shell.

## Responsibilities


## Explicit non-responsibilities


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

## Runtime Configuration

Node-based consumers can configure telemetry output through environment variables:

```bash
# Control the output directory
export ISS_TELEMETRY_OUTPUT_DIR="./logs/telemetry"

# Include timestamp in output filenames
export ISS_TELEMETRY_INCLUDE_TIMESTAMP="true"

# Customize filenames
export ISS_TELEMETRY_LOG_FILE="invocations.json"
export ISS_TELEMETRY_AGGREGATE_FILE="summary.json"
```

Then use the configuration resolver at bootstrap:

```ts
import { createTelemetry, resolveTelemetryConfig } from '@iss/telemetry';

const config = resolveTelemetryConfig();
const telemetry = createTelemetry(config);
```

Defaults are safe for local development. Browser consumers are unaffected by these variables.

## Boundary Guarantees

Both runtime adapters normalize records at the telemetry boundary:

- Missing, non-finite, or malformed numeric values become `0`.
- Missing or invalid timestamps fall back to the current ISO timestamp.
- Provider and model labels are trimmed and default to `unknown` when malformed.
- Invocation and error metadata are whitespace-normalized and sensitive keys are removed.
- Failed invocations remain recorded with `success: false` and sanitized `errorMetadata`.

## Cost Estimates

The AI Provider calculates estimates before passing records to Telemetry. The initial policy supports standard OpenAI API pricing for `gpt-4o-mini` only, using the rates verified on 2026-08-18 in the [OpenAI pricing reference](https://developers.openai.com/api/docs/pricing/): $0.15 per million input tokens and $0.60 per million output tokens.

Records use `costEstimateStatus: 'estimated'` when a supported model is priced. Unsupported models record `estimatedCostUsd: 0` with `costEstimateStatus: 'unavailable'`; zero in that state does not mean the invocation was free. Batch, cached-input, regional, tool, and other non-standard pricing modes are intentionally outside this v1 policy.
