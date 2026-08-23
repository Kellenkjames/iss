---
agent: ask
description: Carry the ISS repository into PRD-07 planning, design, implementation, validation, and release with strict scope and review gates.
---

# Start PRD-07: Full-Stack Signal System

You are continuing work in the ISS repository. Treat this prompt as the authoritative carry-over context for starting PRD-07 after the completion of PRD-06 v1.

## Mission

Build the Full-Stack Signal System as the ISS flagship application. It must transform raw information into actionable signals while preserving human judgment. It is not a generalized AI application, enterprise SaaS platform, autonomous agent system, or collection of disconnected demos.

The first release should prove one polished, coherent, end-to-end vertical slice rather than many incomplete capabilities.

## Current Repository State

The platform foundation is established and validated:

- `libs/platform/design-tokens`: validated v1.0 foundation
- `libs/platform/component-kernel`: frozen v1.0, human approved
- `libs/platform/telemetry`: frozen v1.0, engineering approved
- `libs/platform/ai-provider`: completed v1.0 with browser demo offline behavior
- `apps/shell`: validated v1.0 canonical reference integration
- `apps/interpretation-engine`: completed PRD-06 v1 reference application

PRD-05 is closed as a validated v1.0 reference integration.
PRD-06 is closed as a completed v1.0 reference implementation.
PRD-07 is the next planned application boundary and `apps/signal-system` does not yet exist unless current repository evidence says otherwise.

Do not treat this prompt as evidence that any target path, feature, dependency, or backend exists. Inspect the repository before acting.

## Governing Documents

Read and cite these before planning:

- `docs/product/mini-prds/prd-07.md`
- `docs/product/mini-prds/README.md`
- `docs/engineering/active-brick.md`
- `docs/engineering/architecture-standards.md`
- `docs/engineering/engineering-constitution.md`
- `docs/engineering/repository-blueprint.md`
- `docs/engineering/product-development-lifecycle.md`
- `docs/engineering/engineering-review-gate.md`
- `docs/engineering/telemetry-v1-baseline.md`
- `docs/design/README.md`
- `docs/design/design-partner-charter.md`
- `github/agents/engineering-reviewer.agent.md`
- `github/copilot-instructions.md`

Use completed PRD-05 and PRD-06 records as implementation evidence, not as permission to broaden scope.

## Platform Architecture

Preserve this dependency direction:

```text
Design Tokens
        ↓
Component Kernel
        ↓
AI Provider
        ↓
Telemetry
        ↓
Signal System
```

Responsibilities remain separate:

- Design Tokens own semantic visual primitives.
- Component Kernel owns reusable interaction components.
- AI Provider owns provider-neutral execution, adapter details, response normalization, and provider telemetry capture.
- Telemetry owns operational evidence and storage adapters.
- Signal System owns application-specific signal concepts, workflows, composition, and presentation.

The Signal System must not import vendor SDKs, write telemetry records directly, duplicate provider execution, or create reusable infrastructure that belongs in a platform package.

## Existing Patterns To Reuse

Use the repository’s validated patterns as references:

- `apps/shell/README.md` for canonical application documentation
- `apps/shell/src/main.ts` for Component Kernel registration
- `apps/shell/src/styles.css` for Design Tokens consumption
- `apps/interpretation-engine/` for a thin application-local AI workflow
- `apps/interpretation-engine/src/app/source-dataset.ts` for deterministic reference data and derived presentation values
- `apps/interpretation-engine/src/app/interpretation.service.ts` for application service ownership and provider delegation
- `apps/interpretation-engine/src/app/app.html` for explicit empty, loading, success, failure, responsive, and accessible UI patterns
- `apps/*/project.json` and `nx.json` for Nx project and lint registration conventions

Reuse existing tokens and Kernel components. Search before creating a component, token, service abstraction, or dependency.

## Mandatory First Brick: Planning And Design

Begin with a PRD-07 planning and design brick before implementation.

The first brick must establish:

- primary user and decision context
- signal domain and source information
- definition of a signal
- signal lifecycle and states
- discovery surface
- signal detail surface
- AI interpretation entry point
- telemetry expectations
- human decision authority
- minimum successful vertical slice
- application versus platform ownership
- frontend/backend boundary
- data and persistence assumptions
- runtime and browser safety constraints
- design direction and accessibility expectations
- explicit out-of-scope items

Do not create `apps/signal-system` or add dependencies until the planning/design checkpoint is approved, unless the repository’s existing governance explicitly authorizes scaffolding as part of the planning brick.

## Recommended Vertical Slice

Treat this as a candidate to evaluate, not an assumed requirement:

```text
Signal discovery
        ↓
Signal selection
        ↓
Signal detail
        ↓
AI-assisted interpretation
        ↓
Telemetry evidence
```

The slice should use deterministic reference data initially unless approved requirements establish a real backend or external source. It should demonstrate a meaningful signal-centered workflow without requiring authentication, collaboration, notifications, workflow automation, or enterprise infrastructure.

## Scope Constraints

PRD-07 v1 includes:

- signal discovery
- signal presentation
- structured detail views
- AI-assisted interpretation
- context-aware interaction flows
- shared Component Kernel usage
- shared Design Tokens usage
- AI Provider integration
- automatic Telemetry
- one complete end-to-end application workflow

PRD-07 v1 excludes:

- multi-user collaboration
- enterprise authentication
- notification systems
- workflow automation
- background processing
- billing
- multi-tenancy
- plugin architecture
- mobile-native applications
- administrative tooling
- enterprise SaaS capabilities
- role-based access control
- event streaming
- autonomous agent systems
- generalized AI agents
- duplicated infrastructure

Any scope change requires an explicit decision and appropriate engineering review. Do not smuggle roadmap features into the first vertical slice.

## Engineering-Brick Workflow

For every brick, provide:

1. Brick objective
2. Concrete TODO list
3. Current checkpoint status
4. In-scope and out-of-scope boundaries
5. A falsifiable local hypothesis
6. A focused validation check
7. Files and projects likely affected
8. Acceptance criteria
9. Review trigger and reviewer role
10. Risks and unresolved decisions

Use the following checkpoints:

### Checkpoint A: Planning And Design Readiness

Confirm the user, signal concept, vertical slice, ownership boundaries, data assumptions, design direction, and validation strategy. Engineering review is required if the brick changes architecture, introduces a public contract, adds a dependency, or creates a reusable platform capability.

### Checkpoint B: Implementation Milestone

Confirm the working behavior matches the approved brick and that the Signal System remains application-owned. Review before proceeding if the implementation exposes a new contract or crosses frontend/backend/platform boundaries.

### Checkpoint C: Validation Gate

Run focused tests first, then applicable lint, tests, builds, and browser checks. Do not close a brick on unvalidated work.

### Checkpoint D: Scope Gate

Confirm that no collaboration, authentication, automation, persistence, enterprise, or unrelated product scope entered the brick.

### Checkpoint E: Engineering Review

Use `github/agents/engineering-reviewer.agent.md`. The reviewer must choose exactly one of Pass, Pass with Conditions, or Fail, and exactly one of Approve, Approve with Changes, or Request Rework. The reviewer must cite repository evidence and must not modify files.

### Checkpoint F: Closure

Only after review conditions are closed should the active brief mark the brick complete. Update PRD status only when the PRD’s actual release criteria are satisfied.

## Validation Standard

Prefer this sequence:

1. focused test for the touched project
2. focused lint
3. focused production build
4. browser validation in VS Code’s integrated browser for user-visible work
5. applicable platform and application matrix
6. final diagnostics
7. Engineering Reviewer pass

Use `CI=1` for Nx test and validation commands. Record exact commands and outcomes in `docs/engineering/active-brick.md`.

For browser-visible work, check:

- initial rendering
- empty, loading, success, and failure states
- keyboard and accessible labels
- responsive desktop and mobile layout
- no horizontal overflow
- no undefined design tokens
- no real credentials in browser bundles
- telemetry behavior without raw prompt or sensitive-data leakage
- visual assets or data representations render as intended

## Design Direction

The Signal System should feel intentional, calm, structured, and operationally useful. It should prioritize scanning, comparison, and human understanding over marketing presentation or decorative complexity.

Use the current `ISS / PRD-06` eyebrow as a reference for contextual application labeling. Treat the shared eyebrow pattern as design guidance to evaluate, not as a reason to alter platform contracts during the first PRD-07 brick.

Dark mode is a future cross-cutting Design Tokens and Component Kernel initiative. Do not implement it inside Signal System unless a separately approved platform brick establishes the capability first.

Do not use undefined tokens. Verify every token against `libs/platform/design-tokens/src/styles.css`.

## Backend And Persistence Discipline

PRD-07 describes minimal backend services, lightweight storage, and HTTP APIs as expected dependencies, but do not infer an implementation contract from that description. Decide the minimum backend boundary during planning.

Prefer deterministic in-memory data for the first application contract unless persistence is necessary to prove the approved vertical slice. If backend or storage work is required:

- define ownership and API shape before implementation
- keep credentials and secrets server-side
- avoid enterprise infrastructure
- add focused contract tests
- trigger engineering review before crossing the boundary

## AI And Telemetry Safety

- All AI requests go through `@iss/ai-provider`.
- Browser demos use the explicit offline `demo-key` path unless an approved server boundary is used.
- Applications do not call telemetry storage APIs directly.
- Do not persist raw prompts, sensitive source content, credentials, or full provider responses unless an approved requirement explicitly requires it.
- Preserve provider/model, latency, token, success/failure, and cost-status evidence through the established telemetry boundary.
- Keep human review explicit in the UI; AI output is interpretation or signal context, not autonomous authority.

## Review And Escalation

Escalate for human approval if the work introduces:

- product requirement or scope changes
- architecture changes
- repository restructuring
- new external dependencies
- Design System changes
- breaking APIs
- backend contracts
- persistence models
- governance changes
- authentication or authorization

Do not independently approve these changes as an implementation agent.

## Carry-Over State

At the beginning of each session:

- read the current `active-brick.md`; user edits take precedence
- inspect git status and preserve unrelated changes
- verify PRD-06 remains closed and PRD-07 remains the active roadmap target
- identify the current brick and checkpoint
- state one local hypothesis and one discriminating check before the first edit
- make the smallest reversible edit that can test the hypothesis
- validate immediately after the first substantive edit
- never commit or push unless explicitly requested

## First Response Required

Before implementing anything, produce a concise PRD-07 Brick 1 planning artifact with:

- proposed vertical slice
- user and decision context
- signal domain
- data and persistence choice
- application/platform ownership
- design direction
- implementation sequence
- validation matrix
- review checkpoints
- open human decisions

Do not proceed to implementation until Checkpoint A is explicitly approved.

## Definition Of Done For PRD-07 v1

PRD-07 v1 is complete only when:

- one polished vertical slice works end to end
- discovery, presentation, detail, interpretation, and telemetry are coherent
- every shared platform package is exercised meaningfully
- architectural boundaries remain clean
- user interactions are understandable and predictable
- validation evidence is complete
- engineering review approves the final boundary
- documentation explains why the application exists and how it fits the platform
- no feature exists solely to increase application size

The final story should be visible in the code, documentation, tests, and architecture:

> Well-designed software helps people recognize meaningful signals without replacing their judgment.
