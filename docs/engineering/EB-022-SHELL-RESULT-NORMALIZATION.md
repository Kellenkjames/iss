# EB-022 Engineering Brick — Shell Result Normalization

---

## Status

Continuing the adjacent app adoption sequence after the incident service boundary integration.

This brick focuses on a reusable result-normalization layer so app-level service calls expose stable domain-oriented contracts while the provider boundary remains responsible for execution and telemetry.

---

## Objective

Introduce a small normalization helper for the shell so app services can convert raw provider responses into consistent, intentional domain results before they reach UI or controller code.

This keeps the app layer readable and stable without broadening the repo beyond the platform adoption pattern.

---

## Architecture and Boundary

### Canonical flow

```text
Application view
        ↓
Domain service
        ↓
Result normalization
        ↓
Provider boundary
        ↓
Adapter execution
        ↓
Telemetry evidence
```

### Required ownership split

- UI layer owns display state and user interaction.
- Domain service owns workflow intent.
- Result normalization owns translation into a stable app contract.
- Provider boundary owns execution and telemetry.

---

## Scope

### In scope

- result translation helper for provider responses
- stable domain result shape for shell consumer workflows
- application-level contract consistency
- clearer dependency boundaries between service and provider

### Out of scope

- data persistence
- backend orchestration
- complex business logic flows
- analytics or monitoring infrastructure
- broader product features beyond the shell proof pattern

---

## Baseline References

This brick is grounded in:

- [EB-021-INCIDENT-SERVICE-ADOPTION.md](./EB-021-INCIDENT-SERVICE-ADOPTION.md)
- [EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md](./EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md)
- [EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md](./EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md)
- [PRD-05: AI-Aware Application Shell](../product/mini-prds/prd-05.md)

---

## Public Pattern

```ts
export const normalizeProviderSummary = (response: AiProviderResponse): IncidentSummaryResult => {
  if (!response.success) {
    return {
      success: false,
      provider: response.provider,
      model: response.model,
      summary: response.error?.message ?? 'Unknown provider error',
      error: response.error?.message ?? 'Unknown provider error',
    };
  }

  return {
    success: true,
    provider: response.provider,
    model: response.model,
    summary: response.content,
  };
};
```

### Required behavior

- convert raw provider output to a stable consumer contract
- preserve the underlying provider metadata needed for status messages
- keep app logic readable and domain-oriented
- never make the app aware of adapter implementation details

---

## Validation Requirements

This brick is complete when:

- result normalization is explicit and reusable
- app services can convert provider output consistently
- shell UI remains a thin consumer of the app service contract
- build and targeted tests remain green

---

## Acceptance Checklist

- application layer sees a stable contract instead of raw provider details
- provider layer remains the only execution boundary
- telemetry remains outside app workflow logic
- future app services can reuse the same normalization pattern
- repo validation remains green without broadening scope

---

## Review Gate Trigger

This remains a small platform-adoption milestone. It may use the lightweight engineering-review gate if the contract shape is being stabilized for downstream apps.

The review should confirm:

- the normalized result remains simple and domain-readable
- no provider internals leak into view logic
- the pattern is reusable without turning the shell into a production app

---

## Definition of Done

This adjacent step is complete when the app layer has a clear normalization contract between provider execution and consumer usage, while preserving the platform architecture and the shell’s role as a reference consumer environment.
