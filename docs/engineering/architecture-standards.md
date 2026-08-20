# Architecture Standards

## Intelligent Systems Suite

**Deliverable:** Phase 0 — Architecture Standards

**Version:** 1.0

**Revision:** 2026-08-19

**Status:** Draft for Review

**Applies To:** Entire ISS monorepo

---

# 1. Purpose

The ISS Architecture Standards define how software is structured, named, documented, integrated, and evolved across the Intelligent Systems Suite.

These standards exist to reduce decision friction during implementation.

They do not replace engineering judgment.

They create the default path.

If a future implementation requires breaking these standards, the decision must be documented through an ADR.

---

# 2. Architectural Principle

ISS follows a layered architecture.

Each layer owns one category of responsibility.

```
Design Tokens        → Visual language
Component Kernel     → Interaction language
Telemetry            → Operational language
AI Provider          → Intelligence language
Application Shell    → Architectural reference
Interpretation Engine → Cognitive language
Signal System        → Business capability
```

No layer should reach upward.

Applications may consume platform packages.

Platform packages must not depend on applications.

---

# 3. Repository Structure

ISS uses a public Nx monorepo with pnpm workspaces.

The current implemented workspace contains `apps/shell` and the four platform
libraries under `libs/platform`. The following is the target top-level structure;
planned applications are intentionally documented before implementation.

Target top-level structure:

```
iss-monorepo/
├── apps/
│   ├── shell/
│   ├── interpretation-engine/
│   └── signal-system/
├── libs/
│   └── platform/
│       ├── design-tokens/
│       ├── component-kernel/
│       ├── telemetry/
│       └── ai-provider/
├── docs/
│   ├── design/
│   ├── engineering/
│   └── product/
├── github/
│   ├── workflows/
│   ├── agents/
│   ├── instructions/
│   └── prompts/
├── package.json
├── pnpm-workspace.yaml
├── nx.json
├── tsconfig.base.json
├── README.md
└── LICENSE
```

The repository should remain **understandable within fifteen minutes**.

If a file does not help code, documentation, testing, operation, or review, it should not exist.

---

# 4. Dependency Direction

Dependency direction is strict.

Allowed dependency flow:

```
apps/* → libs/platform/*
libs/platform/ai-provider → libs/platform/telemetry
libs/platform/component-kernel → libs/platform/design-tokens
libs/platform/* → external libraries
```

Disallowed:

```
libs/platform/* → apps/*
libs/platform/design-tokens → any internal package
libs/platform/telemetry → libs/platform/ai-provider
libs/platform/telemetry → apps/*
libs/platform/component-kernel → apps/*
apps/* → apps/*
```

Applications should not depend on one another.

**Shared behavior** belongs in platform libraries.

---

# 5. Package Responsibility Standards

Each package must have one primary responsibility.

## `libs/platform/design-tokens`

Owns visual primitives.

Does not own components.

## `libs/platform/component-kernel`

Owns reusable interaction primitives.

Does not own application logic.

## `libs/platform/telemetry`

Owns AI operational evidence.

Does not execute prompts.

## `libs/platform/ai-provider`

Owns AI provider access.

Does not define business use cases.

If a package begins owning more than one category of responsibility, the architecture should be reviewed.

---

# 6. Application Responsibility Standards

Each application has a distinct architectural role.

## `apps/shell`

Reference implementation for ISS application structure.

## `apps/interpretation-engine`

Reference application for AI-assisted interpretation.

## `apps/signal-system`

Flagship application and primary business capability.

Applications may contain business-specific composition.

They should not create reusable infrastructure unless that infrastructure is later extracted into a package.

---

# 7. Naming Standards

Names should be boring, explicit, and stable.

Avoid clever abstractions.

## Files

Use kebab case.

```
ai-provider.ts
token-report.ts
signal-card.component.ts
modal-element.ts
```

## Classes

Use PascalCase.

```tsx
AiProvider
TelemetryLogger
SignalService
IssButton
```

## Functions

Use camelCase and verb-first naming.

```tsx
recordInvocation()
generateMonthlyReport()
normalizeResponse()
renderSignalCard()
```

## Constants

Use upper snake case only for true constants.

```tsx
DEFAULT_MODEL
TELEMETRY_LOG_PATH
```

## Components

Web Components use the `iss-` prefix.

```
iss-button
iss-input
iss-modal
iss-table
```

Angular components use descriptive feature names.

```
signal-list
signal-detail
interpretation-panel
```

---

# 8. Public Interface Standards

Public APIs must be small, stable, and documented.

A public interface includes:

- exported functions
- exported classes
- exported types
- component properties
- custom events
- slots
- package entry points

Public interfaces should not expose implementation details.

Breaking public interfaces requires an ADR.

---

# 9. TypeScript Standards

TypeScript is the default language across ISS.

Required standards:

- strict mode enabled
- no implicit `any`
- explicit return types for public functions
- exported types documented
- no unused exports
- no circular dependencies
- prefer interfaces for public contracts
- prefer types for internal composition when appropriate

Avoid clever type gymnastics.

Types should improve maintainability, not demonstrate complexity.

---

# 10. Component Standards

The Intelligent Component Kernel uses Lit and native Web Components.

Every Kernel component must include:

- documented properties
- documented events
- accessibility behavior
- keyboard interaction where applicable
- Design Token usage
- minimal internal state
- clear slots where composition is required
- tests for expected behavior

Components should be primitives.

Applications compose primitives into experiences.

---

# 11. Styling Standards

All foundational styling comes from `libs/platform/design-tokens`.

Applications and components should not define raw foundational visual values.

Allowed:

```css
var(--iss-color-surface)
var(--iss-spacing-md)
var(--iss-radius-sm)
```

Disallowed:

```css
#111111
16px
0.5rem
8px
```

Exceptions require a clear reason and should be rare.

---

# 12. AI Integration Standards

Applications must not call vendor SDKs directly.

All runtime AI calls go through `libs/platform/ai-provider`.

Required flow:

```
Application
    ↓
AI Provider
    ↓
Telemetry
    ↓
Provider implementation
```

Every AI call must produce telemetry.

No AI call is allowed without:

- invocation context
- provider
- model
- latency
- token counts
- estimated cost

The AI Provider owns execution.

Applications own intent.

---

# 13. Telemetry Standards

Telemetry is **mandatory for every AI invocation**.

Version 1 telemetry is local-first.

Required fields:

- timestamp
- provider
- model
- prompt tokens
- completion tokens
- total tokens
- estimated cost
- latency
- invocation context

Telemetry data should be readable by both humans and machines.

Reports must be generated as:

```
JSON aggregate
Markdown summary
```

Telemetry should explain AI behavior without becoming a dashboard platform.

---

# 14. Backend Standards

Backend implementation should remain minimal during Version 1.

Backend code exists only when required by the Signal System.

Default standards:

- small service boundaries
- explicit request/response types
- no premature microservices
- no unnecessary queues
- no distributed systems
- no background workers unless justified
- no database unless a file-backed or lightweight storage model becomes insufficient

Backend complexity requires an ADR.

---

# 15. Testing Standards

Testing should validate architecture, not chase vanity coverage.

Minimum test expectations:

## Packages

- unit tests for public functions
- component tests for Kernel components
- contract tests for AI Provider interfaces
- report generation tests for Telemetry

## Applications

- smoke tests for boot
- integration tests for shared package usage
- AI invocation path tests with mocks
- critical workflow tests for Signal System

Tests should protect architectural boundaries.

---

# 16. Documentation Standards

Every package and application must include a README.

Each README must explain:

1. Purpose
2. Architectural role
3. Dependencies
4. Public interface
5. Usage
6. Testing
7. Known limitations
8. Related ADRs

Documentation should explain why the project exists, not only how to run it.

No marketing copy.

No unfinished future-plan sections.

---

# 17. ADR Standards

An ADR is required when a decision affects:

- architecture boundaries
- public APIs
- dependencies
- package responsibilities
- provider strategy
- telemetry model
- backend persistence
- CI/CD
- testing strategy
- security-sensitive behavior
- major scope reduction

Small implementation choices do not require ADRs.

ADR format:

```
Status
Context
Decision
Consequences
Alternatives Considered
Related Artifacts
```

ADRs should be written for a technical reviewer reading the repository cold.

---

# 18. Commit Standards

Commits should communicate architectural progress.

Recommended format:

```
type(scope): summary
```

Examples:

```
docs(prd): add design tokens mini PRD
feat(kernel): add iss-button primitive
test(telemetry): cover monthly report generation
adr(repo): record monorepo decision
```

Allowed types:

```
feat
fix
docs
test
refactor
chore
ci
adr
```

Commits should be small enough to review.

---

# 19. Pull Request Standards

Even as a solo engineer, PRs should model professional review.

Every PR should include:

- Summary
- Architectural impact
- Tests run
- Related ADRs
- Screenshots when UI changes
- Telemetry impact when AI behavior changes
- Known limitations

PRs should be reviewable within fifteen minutes.

---

# 20. CI Standards

CI must run on every pull request and push to main.

Minimum required checks:

- install
- lint
- type-check
- test
- build
- telemetry report generation

CI should validate the repository's architectural health.

A failing CI pipeline blocks merge.

---

# 21. Scope Control Standards

ISS prioritizes architectural coherence over implementation volume.

When scope pressure appears, reduce feature breadth before weakening architecture.

Default reduction order:

1. Remove optional feature.
2. Simplify implementation.
3. Defer integration.
4. Document tradeoff.
5. Preserve public interface if reasonable.

Do not reduce:

- telemetry visibility
- public interface clarity
- dependency boundaries
- documentation quality
- build reliability

---

# 22. Security Standards

Version 1 remains intentionally lightweight, but security-sensitive practices still apply.

Required:

- no secrets committed
- environment variables for credentials
- `.env.example` files where needed
- dependency review before adding packages
- no direct vendor SDK calls from apps
- no telemetry logs containing sensitive user content
- clear handling of AI invocation context

Security-sensitive decisions require an ADR.

---

# 23. Accessibility Standards

Kernel components should be accessibility-first.

Required:

- semantic HTML where possible
- keyboard interaction for interactive components
- visible focus states
- ARIA only when necessary
- label support for inputs
- escape handling for modals
- focus management for overlays

Accessibility is not a later enhancement.

It is part of component correctness.

---

# 24. Performance Standards

ISS should remain lightweight by default.

Required:

- avoid unnecessary dependencies
- avoid large runtime frameworks beyond approved stack
- avoid duplicate package logic
- avoid unbounded AI calls
- avoid unnecessary client-side state
- prefer static or local-first behavior when sufficient

Performance concerns should be addressed through simplicity before optimization.

---

# 25. Human Judgment Standard

AI tools may assist implementation, review, documentation, and testing.

AI tools may not independently decide:

- architecture boundaries
- public APIs
- package ownership
- provider strategy
- security-sensitive design
- final ADR language
- scope changes

The human engineer remains the architectural authority.

---

# 26. Standard Review Questions

Before merging work, ask:

1. Does this respect dependency direction?
2. Does this belong in this package or application?
3. Is the public interface stable and minimal?
4. Is telemetry preserved for AI behavior?
5. Is documentation updated?
6. Are tests protecting the right boundary?
7. Would a technical reviewer understand this in fifteen minutes?
8. Is this the smallest coherent implementation?
9. Does this strengthen the Signal System?
10. Does this require an ADR?

---

# 27. Definition of Done

These Architecture Standards are complete when they can guide implementation without requiring repeated foundational decisions.

A new engineer should be able to read this document and understand:

- where code belongs
- how dependencies flow
- when to write an ADR
- how packages are named
- how AI is integrated
- how telemetry is enforced
- how scope is controlled
- how quality is evaluated

The standards succeed when they reduce future friction without over-constraining implementation.
