# EB-021 Engineering Brick — Incident Service Adoption

---

## Status

Proceeding with the next adjacent application integration step after the provider bootstrap and runtime config refinement milestones.

This brick formalizes the first app-level adoption pattern: a domain-specific service that wraps the shared provider boundary and exposes a more meaningful contract to the app.

---

## Objective

Define and implement the first example of an application-level service that consumes the shared AI Provider without leaking provider details into the app’s view or presentation layer.

The result should feel like a real app adoption pattern: the app asks for a domain outcome, while the platform boundary handles runtime execution and telemetry.

---

## Architecture and Boundary

### Canonical flow

```text
Application view / controller
        ↓
Domain service
        ↓
Provider boundary
        ↓
Runtime config and validation
        ↓
Adapter execution
        ↓
Telemetry evidence
```

### Required ownership split

- View logic owns presentation and UI state.
- Domain service owns user intent and app-specific orchestration.
- Platform provider owns execution and telemetry boundary.
- Runtime config remains isolated to provider bootstrapping.

---

## Scope

### In scope

- domain-oriented service contract for a shell incident workflow
- app-level service wrapping the provider boundary
- translation from raw provider response into a domain-friendly summary result
- minimal shell integration via the app component
- documentation of the adoption pattern

### Out of scope

- full operational workflow product logic
- persistent incident storage
- business rules beyond the local shell context
- external observability or advanced orchestration
- broad multi-feature app integration

---

## Baseline References

This brick is grounded in:

- [EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md](./EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md)
- [EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md](./EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md)
- [EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md](./EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md)
- [PRD-05: AI-Aware Application Shell](../product/mini-prds/prd-05.md)

---

## Public Contract

Example service contract:

```ts
export interface IncidentSummaryResult {
  success: boolean;
  provider: string;
  model: string;
  summary: string;
  error?: string;
}

export async function summarizeIncidentQueue(
  request: IncidentPromptRequest,
): Promise<IncidentSummaryResult>
```

### Contract requirements

- app code consumes a domain-friendly result, not raw adapter internals
- provider details remain available when useful for status reporting
- failure states are converted into explicit error text
- the service remains a light wrapper over the provider boundary

---

## Runtime Pattern

The service should call the provider boundary and convert the normalized result into a more meaningful application-level object.

This is valuable because:

- the app stops caring about low-level provider response details
- future domain services can follow the same pattern
- the provider boundary remains reusable and stable

---

## Validation Requirements

This brick is complete when:

- a domain-specific app service is created on top of the AI provider boundary
- the app component consumes the service instead of the raw provider contract
- the provider remains the execution and telemetry owner
- shell build and targeted provider checks remain green

---

## Acceptance Checklist

A future implementation should not be considered done until all of the following are true:

- app-level services wrap the provider AI boundary cleanly
- raw provider internals are not visible in the view layer
- provider execution remains centralized behind the platform boundary
- telemetry evidence remains attached to the provider call
- the shell continues to act as a thin demonstration consumer
- repo validation stays green

---

## Review Gate Trigger

This is a small architectural adoption milestone and should continue to use the lightweight engineering-review gate when there is a contract change or provider boundary expansion.

The review should confirm:

- the service contract is domain-oriented and readable
- app code does not bypass provider validation
- telemetry remains unchanged and still belongs to the provider layer

---

## Definition of Done

This adjacent step is complete when the repo demonstrates a clear app-service adoption pattern that uses the shared AI Provider boundary while keeping the app layer focused on workflow intent rather than provider mechanics.
