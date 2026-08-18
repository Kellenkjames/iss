# Telemetry v1 Baseline

---

## Status

Baseline for the next ISS platform implementation phase.

This document defines the canonical v1 implementation baseline for the Telemetry package and is intended to be referenced by future engineering bricks as the authoritative starting point for execution.

For review gating, apply the default pattern described in [engineering-review-gate.md](./engineering-review-gate.md): use repo validation for routine implementation work, and trigger the engineering-review agent for milestone-level, boundary-sensitive, or scope-expanding decisions.

---

## Scope

This document governs the first implementation of the Telemetry package for ISS.

The package provides an operational observability layer for AI execution. It is intentionally local-first and intentionally narrow. It exists to make AI runtime behavior measurable, understandable, and reviewable by engineers without introducing a broader monitoring platform.

This baseline is aligned with:

- [PRD-03: Telemetry](../product/mini-prds/prd-03.md)
- [PRD-04: AI Provider](../product/mini-prds/prd-04.md)
- [docs/engineering/EB-014-CARRY-OVER-PROMPT.md](./archive/engineering-bricks/EB-014-CARRY-OVER-PROMPT.md)
- [docs/engineering/architecture-standards.md](./architecture-standards.md)

---

## Mission

The Telemetry package exists to ensure every AI interaction in ISS produces operational evidence.

It is not a product analytics system.
It is not a user analytics system.
It is not a hosted observability platform.
It is a disciplined operational infrastructure layer for AI engineering.

The package's purpose is to answer engineering questions such as:

- Which model was used?
- Which provider handled the request?
- When did execution happen?
- How long did the call take?
- How many tokens were consumed?
- What was the estimated operational cost?
- Which runtime path initiated the request?
- Did the call fail or complete successfully?

---

## Architectural Boundary

The package must preserve the following boundary model:

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

### Ownership

- AI Provider owns execution.
- Telemetry owns evidence capture and aggregation.
- Applications do not instrument AI behavior directly.
- Telemetry does not depend on the AI Provider implementation.

This preserves clean separation of concerns:

- execution belongs to the provider layer
- evidence belongs to the telemetry layer
- application logic should remain unaware of telemetry mechanics

---

## Responsibilities

Version 1 must support the following responsibilities:

- Record each AI invocation initiated through the shared provider boundary
- Measure prompt tokens
- Measure completion tokens
- Measure total tokens
- Estimate operational cost
- Measure latency
- Record provider metadata
- Record model metadata
- Record invocation context
- Generate local JSON summaries
- Generate local Markdown summaries
- Expose a small stable package API
- Support engineering review without relying on external platforms

Telemetry exists to explain system behavior, not to influence it.

---

## Explicit Non-Responsibilities

The package must not:

- select AI providers
- execute prompts
- modify prompt content
- store sensitive prompt bodies or secrets
- perform user analytics or product analytics
- perform front-end or application logging
- stream telemetry to external services
- build dashboards or charts
- handle authentication or secrets
- replace traditional application monitoring
- depend on AI Provider implementation details

This is AI operational telemetry only.

---

## Public Interface

Version 1 should expose a minimal contract.

### Recommended API

```ts
recordInvocation(input: TelemetryRecordInput): void | Promise<void>;
readHistory(): TelemetryRecord[];
generateJsonAggregate(): TelemetryAggregateSummary;
generateMarkdownReport(): string;
calculateTokenTotals(items: TelemetryRecord[]): { prompt: number; completion: number; total: number };
calculateEstimatedCost(items: TelemetryRecord[]): number;
```

### Required data fields

Each record should include:

- timestamp
- provider
- model
- promptTokens
- completionTokens
- totalTokens
- estimatedCostUsd
- latencyMs
- invocationContext
- success
- errorMetadata (optional)

### Storage contract

- storage details remain private
- consumers interact through the API only
- storage format should be local-first and repo-safe
- breaking public interface changes require an ADR

---

## Dependencies

### Internal dependencies

- Telemetry must not depend on application logic or domain model code.
- Telemetry must not depend on the AI Provider.
- The AI Provider may depend on Telemetry.

### External dependencies

Supported for v1:

- TypeScript
- Node.js filesystem APIs

Explicitly avoided:

- databases
- hosted observability platforms
- cloud telemetry vendors
- analytics services
- dashboard systems
- vendor-specific metrics infrastructure

This is a deliberate local-first design decision.

---

## v1 Scope

Version 1 intentionally focuses on operational fundamentals.

### Included

- local JSON log
- local JSON aggregate summary
- local Markdown report
- invocation metadata capture
- token totals and estimated cost
- invocation context and error metadata
- minimal reviewable output formats

### Excluded

- dashboards
- charts
- SQL storage
- distributed tracing
- real-time monitoring
- alerting
- external observability platforms
- user analytics
- product analytics
- billing systems
- quota enforcement

The objective is operational clarity, not enterprise observability.

---

## Success Criteria

Version 1 is complete when:

- every AI invocation in the shared provider flow is automatically recorded
- engineers can determine token consumption for any session or invocation path
- local JSON and Markdown summaries are generated without manual intervention
- the data is understandable through repository inspection alone
- applications require no custom instrumentation beyond the shared AI Provider boundary
- operational cost can be estimated directly from recorded metadata
- telemetry remains safe for engineering review without exposing secrets or sensitive content

Success is measured by engineering visibility and operational accountability, not by reporting sophistication.

---

## Implementation Constraints

The first implementation must stay intentionally small.

Required constraints:

- local filesystem persistence only
- no cloud or vendor service dependency
- no dashboard layer
- no analytics layer
- no prompt body persistence
- no secret storage
- no user measurement
- no broad metrics platform

Implementation preference:

- simple JSON files
- deterministic report generation
- straightforward unit tests
- minimal public surface

---

## Future Evolution

Future versions may introduce:

- additional telemetry adapters
- dashboard integrations
- performance trend analysis
- provider comparison reports
- historical cost forecasting
- visualization tooling
- export formats
- CI integration metrics
- more structured metadata as usage demands it

Any expansion must be justified by operational complexity and must not compromise the v1 boundary.

---

## Out of Scope

The following remain deferred beyond v1:

- OpenTelemetry integration
- Grafana
- Prometheus
- Datadog
- Azure Monitor
- Cloud logging
- Distributed tracing
- Real-time dashboards
- Notification systems
- Usage quotas
- Billing systems
- User analytics or product measurement
- Provider benchmarking loops

The project demonstrates engineering discipline through simplicity rather than infrastructure volume.

---

## Engineering Signals

This baseline demonstrates:

### Architectural Thinking

- cross-cutting platform architecture
- separation of operational concerns
- infrastructure-first design
- shared engineering services
- clear boundary ownership between execution and observability

### AI Engineering

- token economics
- cost awareness
- latency measurement
- model observability
- operational instrumentation
- local-first evidence capture for AI systems

### Software Engineering

- logging architecture
- data modeling
- platform abstraction
- local-first design
- minimal public API design

---

## Acceptance Checklist for Engineering Bricks

All future engineering bricks that rely on Telemetry should confirm:

- the implementation stays within the AI Provider / Telemetry boundary
- telemetry remains local-first
- no application-specific instrumentation is required
- no sensitive prompt content is persisted
- token and latency calculations are accurate
- JSON and Markdown outputs are generated locally
- the package remains independent from app logic
- the work remains within v1 scope unless explicitly expanded by ADR

---

## Definition of Done

The package is complete when every AI interaction across ISS produces operational evidence without requiring app-specific implementation.

An engineer reviewing the repository should be able to answer:

- Which model was used?
- Which provider handled the request?
- When did it occur?
- What was the invocation context?
- How long did it take?
- How many tokens were consumed?
- What did it cost?
- Which system initiated the request?
- Did the call fail or complete successfully?

If those questions can be answered consistently for every AI invocation, the package has fulfilled its architectural responsibility.

---

## Baseline Reference for Future Bricks

This document is the baseline reference for all future Telemetry-related engineering bricks.

All subsequent implementation decisions should be judged against this document before broader scope is introduced.

If a future brick expands beyond this baseline, it must explicitly state:

- why the additional scope is required
- which architectural boundary it affects
- whether it changes the v1 contract
- whether an ADR is required

This ensures the project continues to stay disciplined and implementation-ready as additional bricks are built.
