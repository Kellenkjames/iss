# EB-016 Engineering Brick — AI Provider Integration Boundary

---

## Status

Planning the next architecture-adjacent implementation brick after the Telemetry v1 package.

This brick defines the shared AI Provider boundary and the minimal contract required to move runtime intelligence behind a stable platform abstraction without leaking provider-specific logic into application code.

---

## Objective

Implement the first shared AI Provider package for ISS as the execution boundary for all runtime AI access.

The provider package must centralize model access, execution execution metadata, and telemetry handoff while keeping application code focused on business behavior and prompt intent rather than on vendor SDKs or runtime implementation details.

This is not an application feature. It is a platform boundary and execution contract.

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
Vendor Provider Implementation
        ↓
OpenAI / future providers
```

### Required ownership split

- Applications own product behavior and domain intent.
- AI Provider owns execution and provider abstraction.
- Telemetry owns operational evidence capture.
- Provider implementations own vendor-specific SDK integration.
- No application should call a vendor SDK directly.

### Architectural rule

The AI Provider may depend on Telemetry, but Telemetry must remain independent from AI Provider implementation details.

Applications must depend on the shared AI Provider abstraction, not on vendor-specific APIs.

---

## Scope

### In scope

- shared AI Provider package under `libs/platform/ai-provider`
- canonical provider interface for prompt execution
- provider configuration abstraction
- model selection contract
- request metadata handling
- normalized response shape
- telemetry handoff on every invocation
- error normalization
- package-level implementation tests
- local-first execution evidence flow

### Out of scope

- dashboards
- app-specific logging beyond the provider boundary
- user analytics
- product telemetry
- distributed tracing
- benchmarking loops
- multi-provider routing logic
- local model execution
- RAG infrastructure
- memory systems
- agent orchestration
- prompt library management
- broad observability platform expansion

---

## Baseline References

This brick is grounded in:

- [PRD-03: Telemetry](../../../product/mini-prds/prd-03.md)
- [PRD-04: AI Provider](../../../product/mini-prds/prd-04.md)
- [telemetry-v1-baseline.md](../../telemetry-v1-baseline.md)
- [engineering-review-gate.md](../../engineering-review-gate.md)
- [architecture-standards.md](../../architecture-standards.md)

---

## Required Package Structure

Create a new platform library at:

```text
libs/platform/ai-provider/
  README.md
  eslint.config.mjs
  project.json
  tsconfig.json
  src/
    index.ts
    lib/
      types.ts
      ai-provider.ts
      provider-config.ts
      provider-factory.ts
      telemetry-bridge.ts
      errors.ts
      ai-provider.spec.ts
```

This should match the repo’s shared package conventions while remaining intentionally small.

---

## Public Contract

The v1 public contract should remain intentionally narrow and stable.

```ts
export interface AiProviderRequest {
  prompt: string;
  model?: string;
  systemContext?: Record<string, unknown>;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface AiProviderResponse {
  content: string;
  model: string;
  provider: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  success: boolean;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface AiProvider {
  complete(request: AiProviderRequest): Promise<AiProviderResponse>;
}

export interface AiProviderFactory {
  create(config?: Record<string, unknown>): AiProvider;
}
```

### Public contract requirements

- the abstraction is the primary public API
- provider implementation details remain private
- telemetry remains a side effect, not a public requirement for app usage
- no vendor SDK contract leaks into application code
- breaking changes require explicit ADR review

---

## Execution Model

### Provider responsibilities

The AI Provider package is responsible for:

- receiving a normalized request
- selecting the configured model and provider
- invoking the provider implementation
- measuring latency
- calculating token totals
- normalizing success and failure status
- emitting telemetry evidence through the telemetry package
- returning a stable response object

### App responsibilities

Applications are only responsible for:

- defining prompt intent
- passing request metadata required by the domain
- interpreting the normalized response
- avoiding provider-specific logic

---

## Telemetry Integration Requirements

Every AI invocation must trigger telemetry capture as part of the provider boundary.

### Required telemetry data

- provider name
- model name
- timestamp
- latency
- prompt tokens
- completion tokens
- total tokens
- success/failure status
- system or request context
- error metadata when applicable
- originating system boundary

### Required guardrail

The AI Provider must never persist raw prompt payloads or secrets into local telemetry artifacts.

The telemetry package must be the place that sanitizes or strips sensitive metadata before writing output.

---

## Validation Requirements

The brick is complete when:

- the AI Provider creates a minimal and stable abstraction
- all application runtime AI calls pass through the provider boundary
- no application directly calls provider SDKs
- every invocation records telemetry evidence
- providers stay isolated behind a single interface
- failure and success states are normalized consistently
- local JSON and Markdown artifacts are generated by Telemetry
- secret stripping and data sanitization are enforced
- build, lint, and targeted tests pass

---

## Acceptance Checklist

A future implementation should not be considered done until all of the following are true:

- the repository contains a shared `libs/platform/ai-provider` package
- the AI Provider is the sole gateway into runtime AI execution
- applications do not import vendor SDKs or provider-specific code
- telemetry is triggered automatically for every provider invocation
- provider configuration remains externalized and minimal
- request/response normalization is consistent across calls
- error states are captured without leaking sensitive metadata
- prompt content stays out of persisted operational artifacts
- build, lint, and targeted tests pass with zero repo drift beyond the brick scope

---

## Review Gate Trigger

This brick should trigger the engineering-review gate at the milestone boundary because it changes a shared architectural boundary and introduces the next cross-cutting platform contract.

Use the review gate when:

- the AI Provider public contract is introduced or changed
- provider execution boundaries shift
- a new provider implementation is added
- telemetry contract assumptions are being updated
- any scope question emerges around app-to-provider dependency direction

Routine implementation refactors within the existing boundary can rely on repo validation only.

---

## Recommended Implementation Sequence

1. create the shared AI Provider package scaffold
2. define the canonical request/response contract
3. implement the provider abstraction and factory
4. add telemetry bridge integration
5. normalize provider errors and execution metadata
6. validate sanitization and output generation
7. run build, lint, and targeted tests
8. review against PRD-04, telemetry baseline, and architecture standards

---

## Definition of Done

This engineering brick is complete when a consuming application can request AI execution through the AI Provider boundary without knowing or caring which vendor implementation is behind it.

That is the core architectural signal: provider independence, execution clarity, and operational evidence capture without product-level observability drift.
