# EB-024 Engineering Brick - Interpretation Service Consumer

---

## Status

Implemented as the next adjacent application brick after the shared app-service contract in EB-023.

This brick begins the Interpretation Engine path described by PRD-06 while keeping the implementation narrow and platform-aligned.

---

## Objective

Create the first domain-shaped consumer of the shared app workflow contract for AI-assisted interpretation.

The service should accept structured source information, delegate execution through the AI Provider boundary, and return a stable interpretation result that a future Interpretation Engine UI can consume.

This brick establishes the application-service boundary. It does not build the Interpretation Engine product surface yet.

---

## Architectural Position

```text
Future Interpretation UI
          |
Interpretation service
          |
Shared app workflow contract
          |
AI Provider boundary
          |
Runtime config and adapter
          |
Telemetry evidence
```

### Ownership

- The future UI owns interaction state and presentation.
- The interpretation service owns domain intent and result shaping.
- The shared workflow contract owns common execution normalization.
- The AI Provider owns provider execution and telemetry capture.
- Telemetry owns operational evidence, invisible to the application service.

The service must not import an AI vendor adapter or write telemetry directly.

---

## Scope

### In scope

- typed interpretation request contract
- typed interpretation result payload
- service-level prompt composition from structured input
- delegation through the existing shared app workflow contract
- focused service tests for success, failure, and payload normalization
- documentation of the future UI handoff contract

The reference implementation is [interpretation-provider.service.ts](../../../apps/shell/src/app/interpretation-provider.service.ts), with focused coverage in [interpretation-provider.service.spec.ts](../../../apps/shell/src/app/interpretation-provider.service.spec.ts).

### Out of scope

- Interpretation Engine routes or screens
- new component-kernel components
- visualization libraries
- persistent source records or domain storage
- autonomous workflow execution
- provider selection, routing, or failover
- direct telemetry APIs from application code

---

## Domain Contract

The initial service contract should remain deliberately small:

```ts
export interface InterpretationRequest {
  subject: string;
  context: string;
  question?: string;
  source?: string;
}

export interface InterpretationPayload {
  subject: string;
  interpretation: string;
  question?: string;
}

export type InterpretationResult = AppWorkflowResult<InterpretationPayload>;
```

The service should return a stable payload even when the provider response is normalized. Provider, model, summary, and error metadata remain part of the shared workflow result rather than the domain payload.

---

## Runtime Behavior

The service should:

1. Validate the minimum request shape at the service boundary.
2. Compose a concise interpretation prompt from the subject, context, and optional question.
3. Delegate execution through `runAppWorkflow`.
4. Map successful provider content into `InterpretationPayload`.
5. Preserve the shared failure shape without inventing provider-specific errors.

The initial validation should be limited to required values being non-empty. It should not become a general schema or policy engine.

---

## Implementation Surface

Expected implementation surface:

- a new application service adjacent to `incident-provider.service.ts`
- focused service spec using a controlled provider executor
- no changes to the Component Kernel
- no changes to Telemetry
- no new dependencies

The service may reuse the existing shell bootstrap while the shell remains the reference application. A future Interpretation Engine app should be able to move the service without changing the provider boundary contract.

---

## Acceptance Criteria

- An interpretation request has a typed, domain-readable contract.
- Empty required subject or context values fail before provider execution.
- Valid requests delegate through the shared app workflow contract.
- The generated prompt includes the subject, context, and optional question.
- Successful provider output becomes an `InterpretationPayload`.
- Provider failures retain the shared `success`, `summary`, and `error` semantics.
- No UI component, adapter, or telemetry implementation is added for this brick.
- Focused tests cover validation, prompt delegation, success mapping, and failure mapping.
- Existing shell and AI Provider validation remain green.

---

## Review Gate

This brick should use the lightweight engineering review gate because it introduces the first reusable domain consumer beyond the incident reference workflow.

The review should verify:

- the domain service does not absorb provider responsibilities
- the contract is useful to a future Interpretation Engine UI
- prompt composition remains explicit and testable
- validation is narrow and does not become hidden infrastructure
- the implementation does not expand the shell into a product application

---

## Definition of Done

EB-024 is complete: a tested interpretation service exists behind the shared app workflow contract, with a stable domain payload and no new platform or UI infrastructure.

The next brick after this one may introduce a thin Interpretation Engine UI consumer, but only after the service contract is reviewed and validated.

---

## References

- [EB-023 Shared App Service Contract](./EB-023-SHARED-APP-SERVICE-CONTRACT.md)
- [EB-022 Shell Result Normalization](./EB-022-SHELL-RESULT-NORMALIZATION.md)
- [PRD-06 Interpretation Engine](../../../product/mini-prds/prd-06.md)
- [PRD-04 AI Provider](../../../product/mini-prds/prd-04.md)
