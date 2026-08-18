# EB-023 Engineering Brick — Shared App Service Contract

---

## Status

Proceeding with the next adjacent platform milestone after the shell incident service and result-normalization patterns.

This brick formalizes the reusable contract that downstream app services should follow when they consume the shared AI Provider boundary.

---

## Objective

Define a shared app-service contract for AI-enabled workflows so domain services can remain small, consistent, and readable without leaking provider-specific implementation details into the UI or app shell.

This remains an adjacent platform step. It is not a product feature expansion.

---

## Architecture and Boundary

### Canonical flow

```text
UI / Controller
        ↓
App service contract
        ↓
Provider boundary
        ↓
Runtime validation and config
        ↓
Adapter execution
        ↓
Telemetry evidence
```

### Required ownership split

- UI owns presentation and interaction state.
- App services own domain intent and workflow orchestration.
- Provider boundary owns execution and evidence capture.
- Runtime config owns environment validation and provider setup rules.

---

## Scope

### In scope

- reusable app-service pattern for future AI workflow consumers
- typed workflow result contract
- consistent service wrapper semantics
- shell-level examples for domain-driven usage
- documentation for downstream app adoption

### Out of scope

- business feature sprawl
- persistent domain storage
- external tooling or dashboards
- broader product workflows beyond the current reference pattern
- infrastructure that is not directly tied to provider composition

---

## Baseline References

This brick is grounded in:

- [EB-022-SHELL-RESULT-NORMALIZATION.md](./EB-022-SHELL-RESULT-NORMALIZATION.md)
- [EB-021-INCIDENT-SERVICE-ADOPTION.md](./EB-021-INCIDENT-SERVICE-ADOPTION.md)
- [EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md](./EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md)
- [PRD-05: AI-Aware Application Shell](../../../product/mini-prds/prd-05.md)

---

## Public Pattern

```ts
export interface WorkflowResult<T> {
  success: boolean;
  provider: string;
  model: string;
  payload?: T;
  summary?: string;
  error?: string;
}

export async function runWorkflowService(
  request: WorkflowRequest,
): Promise<WorkflowResult<WorkflowPayload>> {
  // app-level orchestration only
  // provider execution remains delegated to the platform boundary
}
```

### Contract requirements

- app services return stable, workflow-friendly shapes
- provider execution stays behind the boundary
- the app remains aware of domain output, not vendor mechanics
- errors map to a consistent and readable app response

---

## Runtime Behavior

Service-level behavior should be deliberately simple:

- accept a workflow request
- delegate to the provider boundary
- normalize the response into a stable workflow result
- return readable output to the UI

The provider remains the owner of execution and telemetry. The app service remains the owner of domain shape.

---

## Validation Requirements

This brick is complete when:

- app-service contracts are consistent across shell workflows
- the provider boundary remains the execution owner
- UI logic does not directly orchestrate provider mechanics
- shell and provider validation remain green

The reference implementation lives in [incident-provider.service.ts](../../../apps/shell/src/app/incident-provider.service.ts), with focused contract coverage in [incident-provider.service.spec.ts](../../../apps/shell/src/app/incident-provider.service.spec.ts).

The contract test gate verifies:

- successful provider output is normalized into an app result
- mapped workflow payloads are preserved
- provider failures produce stable summary and error fields
- workflow requests reach the app executor without UI involvement

---

## Acceptance Checklist

- app services expose stable response contracts
- provider implementation details stay behind the boundary
- shell remains a thin consumer environment
- domain workflows can be reused without repeated provider plumbing
- repo validation remains green without broadening product scope

---

## Review Gate Trigger

This remains a lightweight architectural gate because it standardizes the consumer contract pattern and shapes downstream app adoption.

The review should check:

- whether the contract is domain-readable and reusable
- whether provider internals remain hidden from app code
- whether future app consumers can adopt the pattern without drift

---

## Definition of Done

This adjacent step is complete when there is a clear, sharable app-service contract pattern that future ISS apps can follow without duplicating provider bootstrapping, runtime validation, or execution logic. The shell reference implementation and its focused contract tests are now in place.
