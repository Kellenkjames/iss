# EB-020 Engineering Brick — AI Provider Bootstrap Refinement

---

## Status

Continuing the adjacent platform buildout after the runtime config and shell consumer boundary stabilization.

This brick refines the bootstrap contract into a cleaner, reusable configuration surface for app consumers without widening the architecture beyond the shared provider boundary.

---

## Objective

Formalize the runtime bootstrap experience and document the pattern that future app consumers should follow when creating AI providers from environment-aware configuration.

This remains intentionally platform-focused. It is not a feature implementation or a product app deliverable.

---

## Architecture and Boundary

### Canonical flow

```text
Application consumer
        ↓
Runtime config helper
        ↓
Provider config validation
        ↓
Provider factory
        ↓
Adapter execution
        ↓
Telemetry evidence
```

### Required ownership split

- Application code requests a provider and supplies user intent.
- Runtime config helpers resolve environment values and default settings.
- Provider config validation enforces runtime safety.
- Provider factory composes the adapter and boundary contract.
- Telemetry remains separate from app behavior.

---

## Scope

### In scope

- runtime config helper pattern for shell and future apps
- explicit environment-based provider bootstrap
- validation and normalization contract reuse
- minimal shell-level integration examples
- docs and package-level contract clarity

### Out of scope

- broad app workflows
- new product UI
- vendor-specific orchestration beyond the provider boundary
- dashboards or observability platform integration
- large-scale pipeline infrastructure

---

## Baseline References

This brick is grounded in:

- [EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md](./EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md)
- [EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md](./EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md)
- [EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md](./EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md)
- [telemetry-v1-baseline.md](./telemetry-v1-baseline.md)
- [PRD-05: AI-Aware Application Shell](../product/mini-prds/prd-05.md)

---

## Public Pattern

The bootstrap helper should stay minimal and explicit:

```ts
export const getRuntimeEnvironment = (): Record<string, string | undefined> => {
  const globalWithProcess = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };

  return globalWithProcess.process?.env ?? {};
};

export const resolveShellProviderConfig = (env = getRuntimeEnvironment()) => ({
  provider: 'openai',
  model: env['OPENAI_MODEL'] ?? 'gpt-4o-mini',
  apiKey: env['OPENAI_API_KEY'] ?? 'demo-key',
  defaultSystemMessage: env['OPENAI_DEFAULT_SYSTEM_MESSAGE'] ?? '...'
});
```

### Required behavior

- environment access stays delegated to a single helper
- default values are explicit and stable
- real runtime paths fail early when required secrets are absent
- shell remains a demo consumer and not a live production config authority

---

## Safety Rules

- access runtime env only through a single boundary helper
- never read provider secrets directly in UI or domain logic
- keep default keys local and isolated to demo contexts
- mask or avoid logging secret values
- keep config validation centralized in the provider package

---

## Validation Requirements

This brick is complete when:

- the runtime bootstrap helper is easy to reuse by future app consumers
- config validation remains centralized in the provider boundary
- the shell demonstrates a reusable pattern without embedding vendor setup in UI logic
- build and tests pass without broadening the scope beyond the provider boundary

---

## Acceptance Checklist

- provider bootstrap is explicit and reusable
- runtime environment access is browser-safe
- provider config validation remains centralized
- shell consumer remains thin and composable
- docs reflect the current boundary model and future usage
- project validation remains green

---

## Review Gate Trigger

This brick remains a platform safety milestone and should continue to use the lightweight engineering-review gate when there is a contract change or new bootstrap pattern.

The review should focus on:

- whether config resolution is isolated to the shared boundary
- whether default/demo secrets are still intentionally local
- whether future app consumers can adopt the pattern without drift

---

## Definition of Done

The next adjacent step is complete when the repo has a reusable, safe, and explicit runtime bootstrap pattern for provider initialization, while preserving the current architecture: thin apps, shared platform packages, and telemetry-backed execution evidence.
