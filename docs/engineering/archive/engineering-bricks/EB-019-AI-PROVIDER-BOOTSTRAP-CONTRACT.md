# EB-019 Engineering Brick — AI Provider Bootstrap Contract

---

## Status

Proceeding with the next adjacent platform milestone after the runtime config and environment-aware validation layer.

This brick formalizes the bootstrap contract for application-level provider consumers so they can create a provider through a stable, safe, and environment-aware boundary without depending on raw vendor assumptions.

---

## Objective

Define the canonical bootstrap contract that future applications should use when instantiating the AI Provider boundary.

The purpose is not to add product features. The purpose is to make provider bootstrapping consistent, explicit, and safe across ISS applications.

---

## Architecture and Boundary

### Canonical flow

```text
Application consumer
        ↓
Provider bootstrap contract
        ↓
Runtime config resolution
        ↓
Provider validation
        ↓
Factory creation
        ↓
Adapter execution
        ↓
Telemetry evidence
```

### Required ownership split

- Applications own user intent and domain interactions.
- Provider bootstrap owns environment resolution and configuration validation.
- Factory owns provider composition and adapter selection.
- Telemetry remains the evidence capture system.
- Secrets stay at the runtime boundary and are never surfaced into UI or domain code.

---

## Scope

### In scope

- bootstrap contract for provider creation
- runtime environment resolution
- default model and setting normalization
- safe secret handling patterns
- consumer-facing usage examples for the shell and future apps
- validation of the contract in repo tests

### Out of scope

- product workflows
- cloud logging vendors
- business feature implementation
- analytics dashboards
- service orchestration beyond the local boundary
- multi-provider orchestration intelligence

---

## Baseline References

This brick is grounded in:

- [EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md](./EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md)
- [EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md](./EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md)
- [EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md](./EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md)
- [telemetry-v1-baseline.md](../../telemetry-v1-baseline.md)
- [PRD-05: AI-Aware Application Shell](../../../product/mini-prds/prd-05.md)

---

## Public Contract

The bootstrap contract is intentionally small and stable.

```ts
export interface ProviderRuntimeConfig {
  provider: 'openai';
  model: string;
  apiKey?: string;
  baseUrl?: string;
  organization?: string;
  defaultSystemMessage?: string;
}

export const resolveProviderConfigFromEnvironment = (env) => ({ ... });
export const validateProviderConfig = (config) => ({ ... });
export const createProviderFactory = (options) => ({ create(config) });
```

### Required rules

- app code must not instantiate adapters directly
- app code must not embed vendor configuration in UI logic
- runtime environment values are resolved at the boundary
- failing config is rejected before execution begins
- secret values may be masked in logs, but the real value remains only in the runtime boundary

---

## Runtime Safety Requirements

### Safe initialization pattern

```ts
const runtimeEnv = typeof process !== 'undefined' ? process.env : {};
const config = validateProviderConfig({
  ...resolveProviderConfigFromEnvironment(runtimeEnv),
  provider: 'openai',
  model: 'gpt-4o-mini',
  apiKey: runtimeEnv.OPENAI_API_KEY,
});

const provider = createProviderFactory({ telemetry }).create(config);
```

### Safety guardrails

- check for `process` before using `process.env`
- keep env access inside the platform boundary
- default to a local demo key only in isolated shell validation scenarios
- treat missing `OPENAI_API_KEY` as a hard failure in real runtime paths
- never log raw secret values

---

## Shell Behavior

The shell remains the reference consumer, not the permanent home of provider rules.

It should use the provider factory and runtime configuration validation so that the shell demonstrates the canonical application pattern:

- kernel UI components remain the rendering source of truth
- app behavior remains minimal and testable
- provider composition remains a shared platform concern

---

## Validation Requirements

This brick is complete when:

- the application consumer resolves config through the centralized bootstrap contract
- missing or invalid config fails early and clearly
- secrets are handled with masking and never exposed in app code
- the provider factory remains the only runtime creation point
- package tests and shell validation remain green

---

## Acceptance Checklist

A future implementation should not be considered done until all of the following are true:

- provider startup is centralized through the config + factory boundary
- env access is browser-safe and runtime-aware
- missing secrets fail clearly before dispatching a model call
- raw secret values do not leak into logs or UI
- the shell pattern is reusable for downstream app implementations
- repo validation passes without broadening into product concerns

---

## Review Gate Trigger

This brick is a platform safety milestone and should trigger the lightweight engineering-review gate because it governs runtime trust and environment-sensitive configuration.

The review should confirm:

- env access is safe and isolated
- validation happens before execution
- the shell remains a thin consumer
- no new infrastructure is introduced outside the provider boundary

---

## Definition of Done

The next adjacent step is complete when the repo has a clear, re-usable provider bootstrap contract that future applications can inherit without vendor or secret leakage, while preserving the narrow platform architecture already established in the shell and provider stack.
