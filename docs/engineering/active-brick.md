# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Use this file for iterative planning updates. Create or archive numbered
engineering-brick documents only when a durable architectural boundary,
public contract, or explicit review decision needs a permanent historical
record.

---

## Current Brick

### Title

PRD-04 Brick 1 - AI Provider Live OpenAI Execution

### Status

Planning the first PRD-04 execution brick that closes the gap between a deterministic demo adapter and live provider execution.

### Outcome

Implement real OpenAI request execution inside the existing AI Provider adapter boundary, while preserving the current application-facing contract and telemetry behavior.

### Why This Brick Exists

PRD-04 is currently marked as architecture complete with a demo adapter. The next incomplete acceptance criterion is execution of real provider requests behind the stable provider interface.

This brick exists to prove that:

- applications continue to call only the shared AI Provider interface,
- provider-specific behavior remains isolated in the OpenAI adapter,
- telemetry evidence still flows through the existing provider-to-telemetry boundary,
- unsupported pricing behavior remains explicit (`costEstimateStatus: unavailable`).

### Architecture and Boundary

```text
Applications
        ↓
AI Provider
        ↓
Telemetry
        ↓
OpenAI Adapter (live execution)
        ↓
OpenAI Responses API / Chat Completions API
```

### Next Incomplete Criterion

From PRD-04 success criteria:

- incomplete: the provider implementation must execute real provider requests while keeping implementation details invisible to applications.

### Local Hypothesis

If the OpenAI adapter performs live API execution using runtime configuration already enforced by the provider factory, then current shell and service consumers can remain unchanged while receiving normalized, telemetry-backed real responses.

### Focused Validation Check

The first validation immediately after the first adapter edit:

- `CI=1 pnpm nx test ai-provider`

### In Scope

- replace deterministic payload generation in `openai-adapter.ts` with live OpenAI request execution
- keep `createAiProvider` contract unchanged for consumers
- normalize live provider responses to existing `AiProviderResponse` fields
- normalize provider failures to current error contract
- ensure telemetry receives token counts, latency, success/failure, and cost estimate status
- keep pricing policy ownership in AI Provider (`openai-pricing.ts`)
- expand adapter/provider tests for success and failure paths using mocked network/client behavior
- document runtime env requirements for live execution and any browser safety constraints

### Out of Scope

- PRD-03 telemetry contract changes
- multi-provider routing
- streaming responses
- function calling/tools
- structured output schemas
- retries/backoff policies beyond minimal failure normalization
- prompt libraries, memory, or agent orchestration
- shell UX redesign

### Dependencies

- [PRD-04](../product/mini-prds/prd-04.md)
- [PRD-03](../product/mini-prds/prd-03.md)
- [Architecture Standards](./architecture-standards.md)
- [Telemetry v1 Baseline](./telemetry-v1-baseline.md)
- [Engineering Review Gate](./engineering-review-gate.md)

### Files or Projects Likely Affected

- `libs/platform/ai-provider/src/lib/openai-adapter.ts`
- `libs/platform/ai-provider/src/lib/openai-adapter.spec.ts`
- `libs/platform/ai-provider/src/lib/ai-provider.spec.ts`
- `libs/platform/ai-provider/src/lib/types.ts` (only if required for provider response mapping)
- `libs/platform/ai-provider/src/lib/config.ts` (only if additional safe config resolution is required)
- `libs/platform/ai-provider/README.md`
- `docs/product/mini-prds/prd-04.md` (status wording only if milestone claim changes)

### Implementation Sequence

1. confirm the OpenAI endpoint strategy (Responses API versus Chat Completions API) without expanding public provider contract
2. implement live request execution in `openai-adapter.ts` using existing runtime config inputs
3. map provider response content/tokens/model into the current normalized response shape
4. preserve unsupported-model pricing behavior (`unavailable`)
5. add or adjust tests for success, API-key missing, provider error payloads, and network failure normalization
6. run narrow validation (`nx test ai-provider`) immediately after first edit
7. run expanded project validation (ai-provider lint/test/build, then shell test/build)
8. update documentation claims to remove demo-only language only if validated by passing tests and integration behavior

### Validation Commands

- `CI=1 pnpm nx test ai-provider`
- `CI=1 pnpm nx lint ai-provider`
- `CI=1 pnpm nx build ai-provider`
- `CI=1 pnpm nx test shell`
- `CI=1 pnpm nx build shell`

Optional full baseline after completion:

- `CI=1 pnpm nx run-many --target=lint --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`
- `CI=1 pnpm nx run-many --target=test --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`
- `CI=1 pnpm nx run-many --target=build --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`

### Acceptance Criteria

- adapter performs live provider execution when valid runtime config is present
- applications continue to use `@iss/ai-provider` only; no vendor imports appear in app code
- normalized response contract remains stable for existing consumers
- telemetry is recorded for successful and failed live invocations
- failures are normalized without leaking secrets
- ai-provider lint/test/build pass
- shell test/build pass without boundary regressions

### Risks and Unresolved Decisions

- whether to use OpenAI SDK or native `fetch` client inside the adapter
- browser runtime credential safety if execution is attempted from browser-only contexts
- API surface differences between OpenAI endpoints that could impact normalization
- handling provider-side transient failures without introducing out-of-scope retry policy

### Recommended Reviewing Role

- primary: Engineering Reviewer
- secondary: AI Integration Engineer

Use the engineering review gate due to shared boundary behavior change.
