# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Use this file for iterative planning updates. Create or archive numbered
engineering-brick documents only when a durable architectural boundary,
public contract, or explicit review decision needs a permanent historical
record.

---

## Active PRD-05 Record

### Title

PRD-05 Brick 1 - Shell Reference Integration Validation

### Status

Completed - Engineering review passed; documentation condition closed.

### Review Checkpoint Status

- Checkpoint A: implementation readiness - passed.
- Checkpoint B: integration milestone - passed.
- Checkpoint C: validation gate - passed.
- Checkpoint D: documentation condition - closed by adding `apps/shell/README.md`.
- Final closure decision: approved.

### Outcome

Validate that `apps/shell` is the canonical ISS reference integration app and that the repository’s current platform composition is demonstrably healthy before downstream PRD work expands scope.

### Why This Brick Exists


PRD-04 established the AI Provider baseline and closed the provider-boundary implementation work. The remaining gap is not product feature development; it is proving that the shell correctly consumes the shared platform packages through the intended public boundaries and that the browser-safe demo model remains explicit and safe.



This brick exists to confirm that:



- the shell is the canonical example of ISS application composition,

- platform boundaries remain stable for downstream consumers,

- the AI demo path remains offline-safe in browser contexts,

- telemetry and provider behavior remain aligned with the repo’s architectural contracts,

- documentation and review signals reflect the current proof-object role of the shell.



### Architecture and Boundary


        ↓

Component Kernel


AI Provider

        ↓


The shell is intentionally a lightweight, evidence-oriented application whose value is architectural clarity and contract validation. The app should remain readable, minimal, and representative rather than product-rich. The platform packages already perform their jobs; the remaining work is to confirm the shell demonstrates them correctly and that no documentation or contract gaps would cause future app teams to copy the wrong pattern.





- verify the browser demo uses the explicit `demo-key` path without leaking real credentials


- PRD-06 product features or interpretation-engine domain work

- PRD-07 full flagship application scope
- broader platform redesign or new shared infrastructure
- UI redesigns for the sake of visual polish
- application-specific business workflows or domain logic beyond the validation example
- changing the provider contract or shared package ownership boundaries

### Dependencies

- [PRD-05](../product/mini-prds/prd-05.md)

- [PRD-04](../product/mini-prds/prd-04.md)

- [Architecture Standards](./architecture-standards.md)
- [Telemetry v1 Baseline](./telemetry-v1-baseline.md)
- [Engineering Review Gate](./engineering-review-gate.md)

### Files or Projects Likely Affected

- `apps/shell/src/app/app.ts`
- `apps/shell/src/app/app.html`

- `apps/shell/src/app/app.css`




1. validate the shell’s current public-boundary consumption against the PRD-05 role and current repo architecture

2. confirm the browser-safe demo path and the live-vs-demo distinction remain explicit and documented


6. run the full current-project validation matrix before closing the brief
7. review the shell’s status against PRD-05 and prepare the next brick only if the repo evidence remains consistent

### Concrete Implementation Plan

#### Phase 1 — Confirm shell boundary usage

- inspect the current shell composition in `apps/shell/src/app/app.ts`, `app.html`, and the provider demo entry points to confirm that UI code does not reach into vendor SDKs or provider implementation details
- verify the shell depends only on the stable public APIs exposed by Design Tokens, Component Kernel, AI Provider, and Telemetry
- check that the shell remains an application host and not a reusable platform library or business-service implementation

#### Phase 2 — Validate offline-safe browser behavior

- confirm `resolveShellProviderConfig` keeps demo behavior explicit and deterministic for browser execution
- verify the app demonstrates the `demo-key` path clearly in provider-runtime configuration and any user-visible documentation or comments
- confirm live credentials and non-demo execution remain server-only or otherwise intentionally excluded from browser-safe workflows

#### Phase 3 — Prove telemetry and AI contract integrity

- inspect AI invocation and telemetry flow in the shell demo path to ensure tool outputs remain visible, structured, and attributable to the provider boundary
- validate that provider failures and success responses continue to normalize cleanly through the existing app-service boundary without leaking internal details
- verify the shell demo uses the same model, telemetry, and error behavior expected by the platform baseline

#### Phase 4 — Close any documentation or contract gaps

- update the PRD-05 wording or shell docs if the current reference-app framing is not explicit enough for future app teams
- ensure the repo’s README and engineering docs continue to describe the shell as a proof object rather than a feature product
- document any remaining assumptions about default demo behavior and runtime environment handling
- completed: added `apps/shell/README.md` with the shell purpose, architectural role, dependencies, reference-only interface, usage, testing, limitations, and related documentation

#### Phase 5 — Minimal validation and regression checks

- completed: `CI=1 pnpm nx test shell` passed with 4 test files and 11 tests
- completed: the full scoped lint, test, and build matrix passed after the documentation condition was implemented

- run `CI=1 pnpm nx test shell` immediately after the first shell-oriented fix to confirm the boundary checks remain stable
- run the repo validation matrix before closing the active brick:
  - `CI=1 pnpm nx run-many --target=lint --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`
  - `CI=1 pnpm nx run-many --target=test --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`
  - `CI=1 pnpm nx run-many --target=build --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1`

#### Phase 6 — Scope gate for the next brick

- if shell validation remains green and documentation is aligned, convert this brief into a completed PRD-05 record and proceed to the next upstream brick only after confirming the scope remains architectural and not product-led
- if the shell fails the reference-app standard, do not broaden scope; fix the boundary gap or documentation mismatch before moving forward

### Acceptance Criteria

- the shell remains the canonical ISS reference app and not a product UI
- the public platform boundaries are consumed in the intended architecture order
- browser demo behavior remains explicit, deterministic, and safe
- AI and telemetry behavior continue to align with the repo’s contract expectations
- shell lint/test/build pass as part of the repo validation matrix
- PRD-05 scope and wording remain consistent with the architecture and repo reality

### Risks and Unresolved Decisions

- the shell is visually richer than a minimal reference app, which can confuse user expectations if not clearly framed as proof-oriented
- future app work may drift into product-feature scope if the shell is treated as a deliverable instead of a reference object
- documentation must stay aligned with the repo’s architectural intent so future engineers do not misread the project stage

### Recommended Reviewing Role

- primary: Engineering Reviewer
- secondary: AI Integration Engineer

Use the engineering review gate because this brick is about validating architecture and platform boundaries rather than feature delivery.

### Review Outcome

- Result: Pass.
- Recommendation: Approve.
- Engineering brick status: Approved.
- Review date: 2026-08-22.
- Reviewed against: PRD-05, Architecture Standards, Engineering Review Gate, Repository Blueprint, Engineering Constitution, Product Development Lifecycle, Telemetry v1 Baseline, and the relevant design documentation.
- Closure condition: `apps/shell/README.md` was added and documents the shell’s purpose, architectural role, dependencies, reference-only interface, usage, testing, limitations, and related documentation.
- Validation evidence: shell tests passed with 4 test files and 11 tests; the scoped lint, test, and build matrix passed for all 5 projects.

---

## Completed PRD-04 Record

### Title

PRD-04 Brick 1 - AI Provider Live OpenAI Execution

### Status

Completed - Engineering review passed with conditions closed.

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

### Completed Criterion

From PRD-04 success criteria:

- the provider implementation executes real provider requests while keeping implementation details invisible to applications.

### Local Hypothesis

The adapter can perform live API execution using runtime configuration already
enforced by the provider factory, while current shell and service consumers
remain unchanged. The explicit `demo-key` sentinel remains offline so browser
demonstrations do not send prompts or credentials to an external provider.

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

1. confirm the OpenAI Chat Completions endpoint strategy without expanding public provider contract
2. implement live request execution in `openai-adapter.ts` using existing runtime config inputs
3. preserve the explicit offline `demo-key` path for browser demonstrations
4. enforce server-only live execution for non-demo credentials
5. map provider response content/tokens/model into the current normalized response shape
6. preserve unsupported-model pricing behavior (`unavailable`)
7. add or adjust tests for success, demo mode, API-key missing, browser safety, provider error payloads, and latency normalization
8. run narrow validation (`nx test ai-provider`) immediately after first edit
9. run expanded project validation (ai-provider lint/test/build, then shell test/build)
10. complete documentation and engineering review before closing the brick

### Review Outcome

- Result: Pass with Conditions
- Recommendation: Approve with Changes
- Engineering brick status: Approved with Conditions
- Conditions closed: live smoke verification passed, server-only credential policy was verified, and this brief now records the final validation evidence.

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

### Validation Evidence

- AI Provider automated suite: 17 tests passed.
- AI Provider lint and build: passed.
- Shell suite: 10 tests passed.
- Shell build: passed with the existing 530-byte CSS budget warning.
- Live OpenAI smoke test: passed with a real API request through the provider factory.
- Live verification confirmed normalized response content, concrete model identity, token usage, non-zero latency, and telemetry capture.
- No credentials, prompt bodies, or response-sensitive content are persisted by the smoke test.

### Acceptance Criteria

- adapter performs live provider execution when valid runtime config is present
- applications continue to use `@iss/ai-provider` only; no vendor imports appear in app code
- normalized response contract remains stable for existing consumers
- telemetry is recorded for successful and failed live invocations
- failures are normalized without leaking secrets
- ai-provider lint/test/build pass
- shell test/build pass without boundary regressions

### Risks and Unresolved Decisions

- native `fetch` is the Version 1 OpenAI adapter strategy
- live credentials are server-only; browser consumers must use `demo-key` or a future server proxy
- API surface differences between OpenAI endpoints that could impact normalization
- handling provider-side transient failures without introducing out-of-scope retry policy

### Recommended Reviewing Role

- primary: Engineering Reviewer
- secondary: AI Integration Engineer

Use the engineering review gate due to shared boundary behavior change.

---

## Completed PRD-04 Record

### Title

PRD-04 Brick 2 - Provider Response and Model Metadata Normalization

### Status

Completed - PRD-04 v1 engineering review approved with conditions closed.

### Outcome

Ensure successful OpenAI responses remain internally consistent when the API
returns a concrete model ID for a configured alias, and ensure supported model
pricing remains available for recognized dated model IDs.

### Why This Brick Exists

The live smoke verification succeeded with the configured alias `gpt-4o-mini`,
but OpenAI returned the concrete model ID `gpt-4o-mini-2024-07-18`. The current
response normalization preserves that concrete ID while the pricing table only
recognizes the alias. This can produce a successful invocation with an
`unavailable` cost estimate even though the model family is supported.

PRD-04 also contains one stale engineering-signal sentence that still says live
OpenAI execution is not demonstrated. The next brick should reconcile that
documentation with the completed Brick 1 evidence.

### Implementation Progress

- OpenAI model pricing now recognizes `gpt-4o-mini` and explicitly shaped dated
        IDs such as `gpt-4o-mini-2024-07-18`.
- The concrete provider-returned model ID remains unchanged in the normalized
        response and telemetry record.
- PRD-04 engineering-signal wording now reflects completed live execution.
- AI Provider focused tests pass: 18 tests.
- AI Provider lint and build pass.

### Local Hypothesis

If model identity is normalized through a provider-owned alias/family mapping,
then response model identity, pricing status, and telemetry cost evidence will
remain consistent for both configured aliases and provider-returned dated model
IDs without changing the application-facing provider contract.

### Focused Validation Check

After the first implementation edit:

- `CI=1 pnpm nx test ai-provider`

The first regression should use a mocked OpenAI response with
`model: 'gpt-4o-mini-2024-07-18'` and verify estimated pricing remains available.

### In Scope

- normalize supported OpenAI model aliases and dated concrete IDs for pricing
- preserve the concrete provider-returned model ID in the normalized response
- verify telemetry receives the same concrete model ID as the response
- add focused tests for alias, dated ID, and unsupported model pricing behavior
- correct the stale PRD-04 engineering-signal wording
- document the model identity/pricing normalization rule

### Out of Scope

- changing the public `AiProviderResponse` contract
- automatic model selection
- provider routing or failover
- pricing optimization or billing behavior
- additional provider implementations
- streaming, tools, structured outputs, or retries
- changing the frozen PRD-03 telemetry contract

### Likely Files

- `libs/platform/ai-provider/src/lib/openai-pricing.ts`
- `libs/platform/ai-provider/src/lib/openai-pricing.spec.ts` (if present or created)
- `libs/platform/ai-provider/src/lib/openai-adapter.spec.ts`
- `libs/platform/ai-provider/src/lib/ai-provider.spec.ts`
- `docs/product/mini-prds/prd-04.md`
- `docs/engineering/active-brick.md`

### Implementation Sequence

1. inspect the current OpenAI pricing table and existing cost-estimate tests
2. define the smallest provider-owned model-family matching rule
3. update pricing normalization without changing Telemetry ownership
4. add alias, dated model ID, unsupported model, and telemetry consistency tests
5. correct the stale PRD-04 engineering-signal statement
6. run `CI=1 pnpm nx test ai-provider` immediately after the first edit
7. run AI Provider lint/build and the full current-project validation matrix
8. request engineering review before marking the proposal complete

### Acceptance Criteria

- `gpt-4o-mini` pricing remains estimated
- `gpt-4o-mini-2024-07-18` pricing is estimated using the same supported family policy
- unsupported model IDs remain explicitly unavailable rather than silently free
- normalized response and telemetry retain the same concrete provider model ID
- no application-facing API changes are introduced
- AI Provider lint, test, and build pass
- PRD-04 no longer contradicts the completed live-execution evidence

### Risks and Decisions

- model-family matching must not accidentally classify unrelated future models as supported
- pricing policy remains AI Provider-owned and provider-specific
- a new model family should require an explicit pricing update rather than prefix-only inference

### Review Outcome

- Result: Pass with Conditions
- Recommendation: Approve with Changes
- Engineering brick status: Approved with Conditions
- Condition closed: the active brief now records completion after the full
        validation matrix and review approval.

### Validation Evidence

- AI Provider focused suite: 18 tests passed.
- AI Provider lint and build: passed.
- Full current-project lint/test/build matrix: passed.
- Concrete dated model ID pricing verified for `gpt-4o-mini-2024-07-18`.
- Unsupported model pricing remains explicitly unavailable.
- Response and telemetry model identity remain consistent through the provider
        boundary.

### Recommended Review

- primary: Engineering Reviewer
- secondary: AI Integration Engineer

Use the engineering review gate because this brick changes provider-owned cost
normalization behavior, even though the public provider contract remains stable.

---

## Completed PRD-04 Record

### Title

PRD-04 Brick 3 - OpenAI Transport and Response Validation

### Status

Completed - Engineering review approved with conditions closed.

### Outcome

Make OpenAI adapter failures deterministic when the provider returns non-JSON
errors, non-success HTTP statuses, or structurally incomplete success payloads,
while preserving the existing `AiProviderResponse` and Telemetry contracts.

### Why This Brick Exists

The current adapter assumes every HTTP response can be parsed as JSON and treats
any successful HTTP response without a provider error as a successful normalized
response. A malformed or empty provider payload can therefore appear successful
with empty content and zero token usage, while a non-JSON error is reduced to a
generic runtime parse failure.

The adapter now classifies unreadable response bodies and invalid success payloads
with stable error codes while preserving structured provider error codes.

### Implementation Progress

- Non-JSON successful responses now produce `openai_response_parse_error` without
        persisting the response body; non-JSON HTTP failures produce
        `openai_http_error`.
- Structurally incomplete successful responses now produce
        `openai_invalid_response` instead of false success.
- Structured provider error codes remain preserved.
- Provider-level failure telemetry retains normalized error metadata and latency.
- Adapter transport failures now flow through provider normalization and failure
        telemetry with zero token evidence and measured latency.
- AI Provider focused tests pass: 26 tests.
- JSON root-shape and empty structured-content regression cases now produce
        `openai_invalid_response` deterministically.

This is the next provider-boundary quality gap after model and pricing
normalization. It affects failure evidence and response trustworthiness without
requiring a new provider or application feature.

### Local Hypothesis

If the adapter validates HTTP status, safely parses response bodies, and rejects
success payloads without usable response content, then `createAiProvider` will
produce stable failure responses and Telemetry will receive actionable,
secret-free error codes for transport and payload failures.

### Focused Validation Check

After the first implementation edit:

- `CI=1 pnpm nx test ai-provider`

The first regression should cover a non-JSON `429` response and verify the
provider returns `success: false` with a stable error code and telemetry failure
evidence.

### In Scope

- safely handle response-body parsing failures
- classify non-success HTTP responses with stable provider error codes
- validate required success payload structure before returning success
- preserve provider error codes when supplied
- verify failed invocations retain zero token evidence and measured latency
- add focused adapter/provider tests for non-JSON errors, malformed success
        payloads, and structured provider errors
- document the normalized transport/payload failure behavior

### Out of Scope

- retries, backoff, or circuit breakers
- request timeouts or cancellation policy
- streaming responses
- function calling/tools or structured outputs
- provider routing or failover
- new providers or SDK dependencies
- changes to the public `AiProviderResponse` shape
- changes to the frozen PRD-03 Telemetry contract

### Likely Files

- `libs/platform/ai-provider/src/lib/openai-adapter.ts`
- `libs/platform/ai-provider/src/lib/ai-provider.ts` (only if normalization requires it)
- `libs/platform/ai-provider/src/lib/openai-adapter.spec.ts`
- `libs/platform/ai-provider/src/lib/ai-provider.spec.ts`
- `docs/product/mini-prds/prd-04.md`
- `docs/engineering/active-brick.md`

### Implementation Sequence

1. define stable error-code behavior for HTTP, parse, and malformed-payload failures
2. add safe response parsing and HTTP-status handling in the OpenAI adapter
3. validate the minimum usable success payload without expanding response capabilities
4. preserve existing provider error code/type mapping
5. add focused tests for non-JSON errors, structured errors, malformed success,
         and failure telemetry
6. run `CI=1 pnpm nx test ai-provider` immediately after the first edit
7. run AI Provider lint/build and the full current-project validation matrix
8. request engineering review before marking the proposal complete

### Acceptance Criteria

- non-JSON HTTP failures produce a stable normalized provider error
- structured OpenAI errors preserve their provider code or type
- malformed success payloads do not return `success: true`
- failed invocations retain zero token evidence and measured latency
- error messages do not include API keys or raw sensitive request data
- existing demo and live-success behavior remains unchanged
- AI Provider lint, test, and build pass
- no public provider or Telemetry contract changes are introduced

### Risks and Decisions

- the minimum valid success payload must remain compatible with the current
        Chat Completions response shape
- stable error codes should distinguish transport, HTTP, parse, and payload
        failures without leaking provider response bodies
- HTTP status takes precedence for non-JSON failures; readable structured HTTP
        errors preserve their provider code or type
- timeout/cancellation behavior remains a separate future decision

### Recommended Review

- primary: Engineering Reviewer
- secondary: AI Integration Engineer

Use the engineering review gate because this brick changes failure semantics at
the shared AI Provider boundary while preserving its public contract.

### Review Outcome

- Result: Pass with Conditions
- Recommendation: Approve with Changes
- Engineering brick status: Approved with Conditions
- Conditions closed: provider-level failure telemetry coverage was added and the
        HTTP-first versus parse-error classification policy was documented.

### Validation Evidence

- AI Provider focused suite: 26 tests passed.
- AI Provider lint and build: passed.
- Full current-project lint/test/build matrix: passed.
- Null, primitive, array-root, and empty structured-content payloads produce
        `openai_invalid_response` deterministically.
- Non-JSON HTTP failures produce `openai_http_error` without persisting the
        response body.
- Provider transport failures retain zero token evidence, measured latency, and
        normalized failure telemetry.

---

## Next Proposed Brick

### Title

PRD-05 Brick 1 - Application Shell Reference Integration Validation

### Planning Status

Proposed for human approval.

### Outcome

Confirm that `apps/shell` is a complete, understandable reference integration
for the current platform baseline without adding product features or new
infrastructure.

### Why This Brick Exists

PRD-05 defines the shell as the canonical example of how an ISS application
consumes Design Tokens, Component Kernel, AI Provider, and Telemetry. The shell
already demonstrates these integrations, but its reference status should be
closed through an explicit acceptance pass before PRD-06 or PRD-07 work begins.

### Local Hypothesis

If the shell's platform imports, component composition, AI workflows, browser
demo behavior, and validation targets are checked together, then PRD-05 v1 can
be confirmed without changing shared platform contracts or introducing shell
infrastructure.

### Focused Validation Check

After the first implementation or documentation edit:

- `CI=1 pnpm nx test shell`

### In Scope

- map PRD-05 success criteria to current shell code and tests
- verify platform packages are consumed through their public entry points
- verify the shell's browser AI demo remains offline with `demo-key`
- verify component composition and telemetry evidence remain reviewable
- close documentation gaps in the shell PRD and active brief
- add only focused shell tests required to prove the reference integration

### Out of Scope

- new business workflows
- authentication or user management
- backend services or persistent storage
- shell redesign or broad UX expansion
- changes to Design Tokens, Component Kernel, Telemetry, or AI Provider contracts
- PRD-06 Interpretation Engine implementation
- PRD-07 Signal System implementation

### Likely Files

- `apps/shell/src/app/app.ts`
- `apps/shell/src/app/app.html`
- `apps/shell/src/app/ai-provider-demo.ts`
- `apps/shell/src/app/ai-provider-demo.spec.ts`
- `apps/shell/project.json`
- `docs/product/mini-prds/prd-05.md`
- `docs/engineering/active-brick.md`

### Acceptance Criteria

- shell consumes current platform packages through approved public boundaries
- kernel components and shared styles render through the existing shell composition
- AI calls route through `@iss/ai-provider`
- browser demonstrations use offline `demo-key` behavior
- telemetry evidence remains persisted through the browser adapter
- shell lint, test, and production build pass
- no new reusable infrastructure or product scope is introduced

### Recommended Review

- primary: Engineering Reviewer
- secondary: Frontend Engineer

Use the engineering review gate if the acceptance pass changes a shared boundary
or introduces a new public shell contract.
