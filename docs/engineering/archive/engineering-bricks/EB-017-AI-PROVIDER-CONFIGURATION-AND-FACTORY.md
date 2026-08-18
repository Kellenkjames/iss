# EB-017 Engineering Brick — AI Provider Configuration and Adapter Factory

---

## Status

Drafting the next adjacent implementation brick after the provider abstraction and OpenAI adapter milestone.

This brick defines the configuration-driven factory layer that lets the repo create a provider instance without hard-coding vendor behavior into application code or consuming services.

---

## Objective

Implement the first provider factory and configuration contract for ISS so the shared AI Provider can be instantiated through a stable runtime configuration layer.

The goal is to centralize provider selection, environment-driven setup, and adapter bootstrapping while keeping the application boundary clean and the Telemetry flow intact.

This is not a product feature. It is a platform bootstrapping layer.

---

## Architecture and Boundary

### Canonical boundary

```text
Application / Runtime Consumer
        ↓
AI Provider Factory
        ↓
Provider Adapter Selection
        ↓
OpenAI Adapter
        ↓
Telemetry
```

### Required ownership split

- Applications own intent and domain behavior.
- AI Provider owns runtime access rules and adapter orchestration.
- Telemetry owns evidence capture.
- Provider adapters own vendor-specific SDK integration and execution details.
- Runtime configuration owns provider selection, secrets, and environment normalization.

### Architectural rule

Applications must not instantiate provider adapters directly.

The factory layer is the controlled point where provider choice is resolved and runtime configuration is normalized.

---

## Scope

### In scope

- provider factory under `libs/platform/ai-provider`
- configuration contract for provider selection
- environment-aware provider bootstrapping
- adapter selection logic for the active provider
- retry and error normalization hooks
- safe runtime configuration structure
- targeted unit tests for factory behavior
- minimal integration with the existing telemetry boundary

### Out of scope

- dashboards or analytics
- cloud telemetry or observability platform integration
- app-specific workflow orchestration
- multi-provider routing intelligence
- provider benchmarking
- model auto-selection optimization
- user analytics or product telemetry
- broad AI lifecycle infrastructure beyond the factory boundary

---

## Baseline References

This brick is grounded in:

- [PRD-03: Telemetry](../../../product/mini-prds/prd-03.md)
- [PRD-04: AI Provider](../../../product/mini-prds/prd-04.md)
- [EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md](./EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md)
- [telemetry-v1-baseline.md](../../telemetry-v1-baseline.md)
- [engineering-review-gate.md](../../engineering-review-gate.md)

---

## Required Package Structure

Extend the existing AI Provider package with a runtime factory and configuration layer:

```text
libs/platform/ai-provider/
  src/
    lib/
      types.ts
      ai-provider.ts
      factory.ts
      provider-config.ts
      openai-adapter.ts
      ai-provider.spec.ts
```

The factory layer stays minimal and stable. It should resolve a provider implementation based on configuration without exposing raw vendor internals to consumers.

---

## Public Contract

The v1 public contract should remain intentionally small.

```ts
export interface ProviderConfig {
  provider: 'openai';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}

export interface ProviderFactory {
  create(config: ProviderConfig): AiProvider;
}
```

### Contract requirements

- configuration is explicit and typed
- provider selection remains centralized
- application code never imports provider adapter class implementation details
- secrets remain runtime-only and never enter UI or app-domain code
- environment setup is normalized before provider creation

---

## Runtime Behavior

### Provider factory responsibilities

The factory is responsible for:

- reading the provider selection configuration
- validating required values
- selecting the correct adapter implementation
- composing the provider with telemetry hooks
- returning a normalized `AiProvider` instance

### Runtime requirements

- `openai` is the initial adapter target
- environment configuration should be easily extendable for future providers
- provider selection remains explicit and stable
- runtime errors are normalized before reaching the application boundary

---

## Telemetry Interaction

Every factory-created provider must preserve the telemetry contract established in the prior brick.

The factory should not duplicate telemetry logic. It should create an `AiProvider` instance that already includes the correct telemetry invocation shape and default metadata.

Required behavior:

- each provider call records provider, model, latency, token counts, and status
- failure paths are still recorded
- telemetry remains a side effect, not business logic
- sanitized context is preserved when the provider executes

---

## Validation Requirements

The brick is complete when:

- a runtime configuration object can instantiate the correct provider adapter
- the same application contract is used regardless of adapter implementation
- the factory handles an invalid or incomplete config without leaking raw runtime state
- provider instantiation remains independent from app code
- telemetry remains wired through the standard provider boundary
- build, lint, and targeted tests pass

---

## Acceptance Checklist

A future implementation should not be considered done until all of the following are true:

- the AI Provider package exposes a configuration-driven factory
- provider adapter selection is centralized in one location
- applications do not instantiate adapters directly
- the configuration contract is typed and explicit
- runtime secrets stay out of application domains and UI code
- telemetry continues to capture provider execution evidence centrally
- the implementation remains scoped to the provider boundary and v1 architecture
- the repo validation passes for the package and app integration

---

## Review Gate Trigger

This brick should trigger the lightweight engineering-review gate because it introduces a key runtime composition layer and governs how provider implementations are constructed.

The review should confirm:

- config is narrow and not app-global
- secrets are handled safely
- adapter selection does not blur boundaries
- factory logic remains easy to extend without broadening scope

Routine config refactors inside the provider boundary may rely on repo validation only.

---

## Recommended Implementation Sequence

1. add a typed provider configuration contract
2. implement the runtime factory that chooses the provider adapter
3. wire the factory to the existing AI Provider abstraction
4. preserve telemetry hooks through the provider instance
5. validate missing-config and invalid-config failure paths
6. confirm the app consumer can use the factory without direct adapter import
7. run build, lint, and targeted tests

---

## Definition of Done

This engineering brick is complete when a runtime consumer can create the correct AI Provider instance from configuration alone, without custom provider knowledge, without leaking vendor details into app logic, and without breaking the existing telemetry and execution boundary model.

That is the next operational milestone: a stable provider composition layer that makes the AI Provider reusable and configuration-driven without introducing unnecessary complexity.
