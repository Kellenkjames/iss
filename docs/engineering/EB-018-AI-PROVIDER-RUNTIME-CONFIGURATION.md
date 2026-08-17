# EB-018 Engineering Brick — AI Provider Runtime Configuration

---

## Status

Implementing the next adjacent platform brick after the provider abstraction, adapter, and factory milestone.

This brick introduces the runtime configuration and validation layer that turns the AI Provider into a safe, environment-aware factory boundary without leaking secrets or vendor details into application code.

---

## Objective

Define and implement the repository’s runtime configuration contract for AI provider creation.

The goal is to centralize provider selection, validation, and default model behavior so that every application consumes AI through one controlled boundary instead of hardcoded runtime assumptions.

This is a narrow platform layer, not a product feature.

---

## Architecture and Boundary

### Canonical boundary

```text
Application / Runtime Consumer
        ↓
Provider Factory
        ↓
Runtime Configuration Validation
        ↓
Provider Adapter Selection
        ↓
Telemetry + Execution
```

### Required ownership split

- Applications own prompt intent and domain behavior.
- AI Provider owns execution orchestration and configuration validation.
- Telemetry owns operational evidence capture.
- Configuration owns environment and runtime setup data.
- Secret data never belongs in the app layer or the UI layer.

---

## Scope

### In scope

- runtime configuration schema for the provider layer
- provider selection validation
- required field checks
- default model fallback
- secret-aware configuration handling
- factory integration with validated config
- targeted tests for config normalization and validation

### Out of scope

- app-specific business logic
- dashboards or analytics
- external observability vendors
- broad multi-provider routing
- benchmarking or performance optimization
- new UI patterns or product screens

---

## Baseline References

This brick is grounded in:

- [PRD-03: Telemetry](../product/mini-prds/prd-03.md)
- [PRD-04: AI Provider](../product/mini-prds/prd-04.md)
- [EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md](./EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md)
- [EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md](./EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md)
- [telemetry-v1-baseline.md](./telemetry-v1-baseline.md)

---

## Required Package Structure

Extend the existing AI Provider package with configuration support:

```text
libs/platform/ai-provider/
  src/
    lib/
      config.ts
      factory.ts
      ai-provider.ts
      openai-adapter.ts
      ai-provider.spec.ts
```

The configuration layer remains intentionally small and stable.

---

## Public Contract

```ts
export interface ProviderRuntimeConfig {
  provider: 'openai';
  model: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}

export interface ProviderConfigInput {
  provider?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}
```

### Contract requirements

- config is explicit and typed
- unsupported providers fail fast with a clear error
- missing required config fails fast before execution
- environment values are normalized at the boundary
- secrets are not exposed to app code or UI

---

## Validation Behavior

### Required validation rules

- unsupported provider names throw an error
- provider type defaults to `openai`
- default model falls back to `gpt-4o-mini`
- API key is required before provider factory creation succeeds
- additional provider settings are optional and normalized only when present

### Error handling rule

Errors raised by the config layer must be clear, actionable, and boundary-specific. They should describe what is missing or invalid without coupling to app behavior.

---

## Telemetry Interaction

The configuration layer must work with the existing telemetry contract without introducing a second telemetry system.

The provider factory should validate configuration before constructing a provider and the configured provider should continue to emit telemetry through the same execution boundary already established in the earlier bricks.

This keeps instrumentation simple and architecture-safe.

---

## Validation Requirements

The brick is complete when:

- configuration can be normalized for the active provider without app code coupling
- invalid or missing runtime config fails clearly and early
- factory creation uses validated config rather than ad hoc assumptions
- telemetry remains unchanged in behavior and responsibility
- build, lint, and targeted tests pass

---

## Acceptance Checklist

A future implementation should not be considered done until all of the following are true:

- the package exposes a runtime config normalization layer
- the config layer is used by the provider factory
- provider factory creation fails fast on invalid configuration
- default runtime values remain stable and explicit
- API keys or secrets are not surfaced into app code or UI
- provider execution remains behind the same abstraction boundary
- the implementation stays limited to configuration and provider bootstrapping
- repo validation passes without broader architectural drift

---

## Review Gate Trigger

This brick should trigger the lightweight engineering-review gate because it defines key runtime composition rules and handles environment-sensitive values.

The review should focus on:

- whether secret handling is safe and minimal
- whether config is narrow and boundary-safe
- whether errors are clear and runtime-specific
- whether the package remains consistent with the repo’s v1 AI architecture

---

## Recommended Implementation Sequence

1. define the runtime config schema and defaults
2. implement normalization and validation helpers
3. refactor the provider factory to apply config validation before adapter creation
4. add tests for valid, missing-key, and unsupported-provider paths
5. verify package-level build, lint, and tests

---

## Definition of Done

This engineering brick is complete when the AI Provider can be instantiated from validated runtime configuration without raw provider assumptions in the app layer, with clear failure behavior and without broadening the repo into a larger operational platform.

That is the correct next milestone: safe runtime composition before further application-level AI integration work.
