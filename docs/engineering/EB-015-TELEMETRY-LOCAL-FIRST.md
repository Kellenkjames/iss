# EB-015 Engineering Brick — Telemetry Local-First Baseline

---

## Status

Designing the first implementation brick for PRD-03: Telemetry.

This brick defines the initial implementation plan for the shared Telemetry package and acts as the first executable milestone after the kernel freeze and the EB-014 transition to observability-first work.

---

## Objective

Implement the first production-usable Telemetry package for ISS as a minimal local-first observability layer for AI execution.

The package must enable engineering review of AI usage without introducing a monitoring platform, dashboard architecture, or application-level instrumentation burden.

This is not an analytics feature. It is an operational evidence layer.

---

## Architecture and Boundary

### Canonical boundary

```text
Applications
        ↓
AI Provider
        ↓
Telemetry
        ↓
Local JSON / Markdown Outputs
Engineering Review
```

### Required ownership split

- AI Provider owns execution.
- Telemetry owns evidence capture and reporting.
- Applications do not instrument AI behavior directly.
- Telemetry must not depend on the AI Provider.

### Architectural rule

The AI Provider may depend on Telemetry, but Telemetry must remain independent from app/domain code and from AI Provider implementation specifics.

---

## Scope

### In scope

- shared Telemetry package creation under `libs/platform/telemetry`
- structured AI invocation recording
- local JSON persistence
- local JSON aggregate summaries
- local Markdown operational report generation
- browser-safe JSON history and aggregate capture for browser consumers
- token aggregation
- cost estimation
- read/history access
- mininal package-level tests

### Out of scope

- dashboards
- charts
- alerting
- billing systems
- usage quotas
- user analytics
- product analytics
- external telemetry vendors
- OpenTelemetry integration
- distributed tracing
- real-time monitoring
- provider benchmarking
- any hosted observability platform

Runtime note: the filesystem-backed implementation remains the Node/review path. Browser consumers use the platform-owned `@iss/telemetry/browser` entry point, which stores the same structured evidence as JSON in browser `localStorage` without importing Node filesystem APIs.

---

## Baseline References

This brick is grounded in:

- [PRD-03: Telemetry](../product/mini-prds/prd-03.md)
- [PRD-04: AI Provider](../product/mini-prds/prd-04.md)
- [EB-014 Carry-Over Prompt](./archive/engineering-bricks/EB-014-CARRY-OVER-PROMPT.md)
- [architecture-standards.md](./architecture-standards.md)
- [telemetry-v1-baseline.md](./telemetry-v1-baseline.md)

---

## Required Package Structure

Create a new platform library at:

```text
libs/platform/telemetry/
  README.md
  eslint.config.mjs
  project.json
  tsconfig.json
  src/
    index.ts
    lib/
      types.ts
      telemetry.ts
      storage.ts
      aggregator.ts
      markdown-reporter.ts
      utils/
        estimate-cost.ts
        normalize-context.ts
      telemetry.spec.ts
```

This should match the repo’s existing platform-library pattern, but remain intentionally minimal.

---

## Public Contract

The initial public surface should remain small and stable.

```ts
export interface TelemetryRecordInput {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  invocationContext: Record<string, unknown>;
  success?: boolean;
  errorMetadata?: Record<string, unknown>;
  timestamp?: string;
}

export interface TelemetryRecord extends TelemetryRecordInput {
  timestamp: string;
  success: boolean;
}

export interface TelemetryAggregateSummary {
  totalInvocations: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokens: number;
  totalEstimatedCostUsd: number;
  averageLatencyMs: number;
  providers: Record<string, number>;
  models: Record<string, number>;
  from: string;
  to: string;
}

export interface TelemetryApi {
  recordInvocation(input: TelemetryRecordInput): void | Promise<void>;
  readHistory(): TelemetryRecord[];
  generateJsonAggregate(): TelemetryAggregateSummary;
  generateMarkdownReport(): string;
  calculateTokenTotals(items: TelemetryRecord[]): { prompt: number; completion: number; total: number };
  calculateEstimatedCost(items: TelemetryRecord[]): number;
}
```

### Public contract requirements

- storage implementation remains private
- consumers only interact through the API
- the API should be stable for v1
- breaking changes require ADR review
- no user-facing analytics contract is introduced in v1

---

## Storage Model

This first Telemetry implementation should be local-first and filesystem-based.

### Recommended storage behavior

- append to a local JSON log file
- maintain a local aggregate summary file
- optionally maintain a recent history in memory for quick reads
- never write raw prompts or secrets to disk
- keep output in a repo-local and easily reviewable path such as:

```text
tmp/telemetry/
```

### Required constraints

- no database
- no cloud SDK
- no vendor agent connection
- no external observability sink
- no user analytics event stream
- no prompt body persistence

---

## Reporting Requirements

### JSON output

The package must generate a machine-readable aggregate summary with at least:

- totalInvocations
- totalPromptTokens
- totalCompletionTokens
- totalTokens
- totalEstimatedCostUsd
- averageLatencyMs
- providers breakdown
- models breakdown
- time range

### Markdown output

The package must generate a human-readable report with:

- summary totals
- provider breakdown
- token totals
- latency summary
- cost summary
- time window
- note that it is engineering operational telemetry

This output is for engineering review, not product dashboards.

---

## Core Behavior Requirements

### Record behavior

When `recordInvocation` is called, the package must:

- normalize timestamp
- normalize provider/model metadata
- calculate total tokens
- calculate estimated cost
- calculate latency if provided or measured at record time
- include invocation context without persisting secrets
- persist a structured record locally

### Aggregate behavior

- calculate totals by summing all recorded invocations
- calculate average latency
- preserve peer review friendliness
- remain deterministic and inspectable

### Error handling

- failed invocations should still produce a structured record if the runtime knows the failure metadata
- the package must not crash on invalid or partial telemetry input
- missing optional fields must not break generation
- sensitive values must be omitted or redacted

---

## Non-Goals

The following must be explicitly excluded from this brick:

- OpenTelemetry integration
- Grafana / Prometheus / Datadog equivalents
- cloud observability project wiring
- alerting workflows
- user analytics dashboards
- product telemetry
- remote ingestion
- operational billing integration
- quota enforcement logic
- production-scale tracing

These can be addressed in future bricks only if usage patterns warrant them.

---

## Acceptance Criteria

This brick is complete when all of the following are true:

1. A `libs/platform/telemetry` package exists and is wired into the Nx workspace.
2. The package exposes a small public API consistent with the contract above.
3. `recordInvocation` writes a valid local JSON record.
4. Aggregation totals are correct for prompt/completion/total tokens.
5. Estimated cost is calculated from recorded token data.
6. Markdown output is generated and reviewable by engineers.
7. Secrets and prompt bodies are not persisted.
8. Applications do not need custom telemetry code beyond the shared AI Provider boundary.
9. Browser consumers can use a runtime-safe Telemetry implementation without bundling Node filesystem APIs.
10. The package remains independent from AI Provider implementation details.
11. The package passes lint, build, and targeted test validation.

---

## Test Plan

### Unit tests

At minimum:

- records a valid invocation
- calculates total tokens from prompt + completion
- calculates estimated cost correctly
- writes JSON summary output to disk
- produces Markdown summary format
- ignores or redacts sensitive data
- handles failed invocation metadata
- reads history correctly
- aggregates across multiple invocations

### Integration tests

- validate filesystem write paths
- validate aggregate generation across multiple sample records
- ensure package can be imported by a consuming library without app coupling

### Regression protection

- ensure no prompt body or secret is persisted to telemetry output
- ensure the package remains free of cloud vendor dependencies
- ensure no reverse dependency from Telemetry to AI Provider emerges in the package graph

---

## Validation Commands

Use the repo-standard validation pattern for package implementation:

```bash
pnpm nx build telemetry
pnpm nx lint telemetry
pnpm nx test telemetry
```

If the project is not yet wired into Nx and the repo expects package-by-package config, the equivalent local validation command should still be used as a release gate.

The brick is not considered complete unless the package builds, lints, and passes targeted tests.

---

## Suggested File-by-File Implementation Plan

### 1. `libs/platform/telemetry/project.json`

Create a minimal Nx library definition with:

- `name: "telemetry"`
- `projectType: "library"`
- `sourceRoot: "libs/platform/telemetry/src"`
- build target using `@nx/js:tsc`
- test target using Vitest or repo-standard test runner

### 2. `libs/platform/telemetry/src/index.ts`

Export public API for:

- `recordInvocation`
- `readHistory`
- `generateJsonAggregate`
- `generateMarkdownReport`
- `calculateTokenTotals`
- `calculateEstimatedCost`

### 3. `types.ts`

Define the canonical record and aggregate types.

### 4. `storage.ts`

Handle local filesystem persistence only.

### 5. `aggregator.ts`

Implement totals and aggregate calculations.

### 6. `markdown-reporter.ts`

Generate a readable Markdown operational summary.

### 7. `telemetry.spec.ts`

Cover the acceptance tests above.

---

## Definition of Done for this Brick

The brick is complete when the Telemetry package is implemented as a local-first, small, stable, repo-native platform package and the team can begin using it as the baseline for AI-execution observability without drifting into broader monitoring or analytics scope.

This is the first implementation milestone for PRD-03 and should remain intentionally narrow, reviewable, and ready for extension only when real usage justifies it.

---

## Recommended Next Step

Proceed with implementation in the repo using this design brief as the working contract.

The next step is not to broaden the platform. The next step is to implement the smallest correct version of the telemetry package, validate it, and then improve only when evidence shows the additional scope is required.
