# Repository Blueprint

**Project:** Intelligent Systems Suite

**Canonical Path:** `docs/02-architecture/repository-blueprint.md`

**Status:** Phase 1 Repository Architecture Standard

**Owner:** Human Technical Lead

**Repository Model:** Nx monorepo with pnpm

**Visibility:** Public from the first commit

---

# Purpose

This blueprint defines the physical and logical structure of the Intelligent Systems Suite repository.

It establishes:

- Where applications and platform capabilities live
- Which package owns each responsibility
- Which dependency directions are permitted
- How shared capabilities are exposed
- Where tests, prompts, configuration, and documentation belong
- How the repository can expand without losing architectural clarity

The blueprint should answer one recurring question:

> **Where does this work belong?**
> 

It does not define implementation details for every package. Those remain the responsibility of the applicable Mini PRD, ADR, path-specific instruction, and engineering brick.

---

# Repository Model

ISS will use:

- **One public GitHub repository**
- **One Nx workspace**
- **pnpm** for package management
- **Angular** for application composition and workflows
- **Lit and Web Components** for reusable interface primitives
- **TypeScript** across the repository
- **A minimal backend boundary** for server-only behavior
- **Shared AI Provider and Telemetry platform libraries**
- **GitHub Copilot** as the sole AI coding environment

The original suite model defined four concrete software projects and one cross-cutting AI-system principle:

1. Intelligent Component Kernel
2. AI-Aware Application Shell
3. Interpretation Engine
4. Signal System
5. AI as a System Primitive

The fifth project is not a deployable application or independent workspace. It is expressed through the AI Provider, Telemetry, Copilot operating model, documentation, and intelligence embedded across Projects 1–4.

---

# Architectural Shape

```
Applications
    ↓
Feature and Domain Libraries
    ↓
Shared Platform Libraries
    ↓
External Providers and Runtime Infrastructure
```

The repository contains three categories of software:

## Applications

Deployable or runnable system entry points.

Applications compose workflows, routes, features, and shared platform capabilities.

## Feature and Domain Libraries

Application-oriented capabilities that contain meaningful domain behavior but are separated from the application entry point.

These libraries may be reused by more than one application only when the domain meaning is genuinely shared.

## Platform Libraries

Framework-independent or broadly reusable infrastructure used across the suite.

These libraries must not depend on applications or application-specific features.

---

# Canonical Repository Structure

```
iss/
├── .github/
│   ├── copilot-instructions.md
│   │
│   ├── agents/
│   │   ├── architecture-lead.agent.md
│   │   ├── engineering-reviewer.agent.md
│   │   ├── design-systems-engineer.agent.md
│   │   ├── ai-integration-engineer.agent.md
│   │   ├── telemetry-engineer.agent.md
│   │   ├── frontend-engineer.agent.md
│   │   ├── backend-engineer.agent.md
│   │   ├── testing-engineer.agent.md
│   │   ├── documentation-engineer.agent.md
│   │   └── devops-engineer.agent.md
│   │
│   ├── instructions/
│   │   ├── angular.instructions.md
│   │   ├── lit-components.instructions.md
│   │   ├── ai-provider.instructions.md
│   │   ├── telemetry.instructions.md
│   │   ├── testing.instructions.md
│   │   ├── documentation.instructions.md
│   │   └── github-actions.instructions.md
│   │
│   ├── prompts/
│   │   ├── start-brick.prompt.md
│   │   ├── architecture-review.prompt.md
│   │   ├── validate-brick.prompt.md
│   │   ├── engineering-review.prompt.md
│   │   ├── generate-tests.prompt.md
│   │   ├── update-documentation.prompt.md
│   │   └── prepare-handoff.prompt.md
│   │
│   └── workflows/
│       └── ci.yml
│
├── apps/
│   ├── shell/
│   │   ├── src/
│   │   ├── public/
│   │   └── project.json
│   │
│   ├── interpretation-engine/
│   │   ├── src/
│   │   ├── public/
│   │   └── project.json
│   │
│   ├── signal-system/
│   │   ├── src/
│   │   ├── public/
│   │   └── project.json
│   │
│   └── signal-api/
│       ├── src/
│       └── project.json
│
├── libs/
│   ├── platform/
│   │   ├── design-tokens/
│   │   ├── component-kernel/
│   │   ├── ai-provider/
│   │   ├── telemetry/
│   │   ├── configuration/
│   │   └── shared-types/
│   │
│   ├── shell/
│   │   ├── feature-navigation/
│   │   ├── feature-ai-workspace/
│   │   └── data-access/
│   │
│   ├── interpretation/
│   │   ├── feature-interface/
│   │   ├── data-visualization/
│   │   ├── domain/
│   │   └── data-access/
│   │
│   └── signals/
│       ├── feature-dashboard/
│       ├── feature-ingestion/
│       ├── feature-analysis/
│       ├── feature-publishing/
│       ├── domain/
│       └── data-access/
│
├── tools/
│   ├── generators/
│   ├── scripts/
│   └── executors/
│
├── docs/
│   ├── 00-foundation/
│   │   ├── engineering-constitution.md
│   │   ├── architecture-standards.md
│   │   └── universal-agent-contract.md
│   │
│   ├── 01-operations/
│   │   ├── engineering-operating-system.md
│   │   ├── role-selection-matrix.md
│   │   ├── context-architecture.md
│   │   └── engineering-handoff-matrix.md
│   │
│   ├── 02-architecture/
│   │   ├── repository-blueprint.md
│   │   ├── system-context.md
│   │   └── dependency-model.md
│   │
│   ├── 03-prds/
│   │   ├── master-prd.md
│   │   └── mini-prds/
│   │
│   ├── 04-roles/
│   │   └── engineering-role-definitions/
│   │
│   ├── 05-adrs/
│   │   ├── 0000-template.md
│   │   └── 0001-monorepo-with-nx.md
│   │
│   ├── 06-ai-sdlc/
│   │   └── README.md
│   │
│   ├── 07-bricks/
│   │   ├── active/
│   │   └── completed/
│   │
│   └── 08-reports/
│       └── telemetry/
│
├── tmp/
│   └── telemetry/
│
├── .editorconfig
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── nx.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── vitest.workspace.ts
├── LICENSE
└── README.md
```

This tree represents the intended architectural shape.

Directories should be created when they are first required. The initial commit does not need to contain empty placeholders for every future feature library.

---

# Application Responsibilities

## `apps/shell`

**System:** AI-Aware Application Shell

**Primary Technology:** Angular

The shell is the suite-level application experience.

It owns:

- Global navigation
- Application framing
- Route composition
- Shared workspace presentation
- Demonstration of the Intelligent Component Kernel inside Angular
- High-level integration of AI-aware capabilities

It does not own:

- Reusable Web Components
- Provider-specific model integrations
- Telemetry persistence
- Signal System domain logic
- Interpretation Engine domain logic

The shell may initially operate as an independent Angular application. It should not become a micro-frontend host unless implementation evidence demonstrates that such complexity is necessary.

---

## `apps/interpretation-engine`

**System:** Interpretation Engine

**Primary Technology:** Lit, Web Components, and a lightweight visualization layer

The Interpretation Engine owns interactive data interpretation experiences.

It may include:

- Structured data input
- AI-assisted interpretation
- Tables and visualization composition
- Explainable transformations
- Interactive analytical components
- D3-backed visual behavior where native rendering is insufficient

It should consume:

- `@iss/component-kernel`
- `@iss/design-tokens`
- `@iss/ai-provider`
- `@iss/telemetry`
- Interpretation-specific domain libraries

It must not become the shared component library merely because it uses Lit.

Reusable interface primitives belong in the Component Kernel.

---

## `apps/signal-system`

**System:** Full-Stack Signal System

**Primary Technology:** Angular with shared Lit components

The Signal System is the flagship application.

It owns user-facing workflows for:

- Signal intake
- Signal review
- Classification
- Scoring
- Analysis
- Publication preparation
- Operational visibility

The application composes Signal domain and feature libraries.

It should not directly:

- Store provider credentials
- Call model vendors
- Write local telemetry files
- Contain server-only ingestion or persistence code
- Reimplement shared UI components

---

## `apps/signal-api`

**System:** Signal System Backend Boundary

**Primary Technology:** Minimal TypeScript server runtime

The Signal API exists because some responsibilities cannot safely or appropriately run in the browser.

It owns:

- Server-side provider credentials
- Secure AI Provider execution
- Signal ingestion endpoints
- Persistence boundaries
- Scheduled or background operations when introduced
- Server-side telemetry storage
- External integration adapters

It does not need to become a generalized enterprise backend.

Version 1 should expose only the endpoints required by approved Signal System bricks.

The API is a deployable application because it has an independent runtime and security boundary.

---

# Platform Libraries

## `libs/platform/design-tokens`

**Import Alias:** `@iss/design-tokens`

Owns the shared visual language.

Includes:

- Color tokens
- Typography tokens
- Spacing tokens
- Sizing tokens
- Border and radius tokens
- Elevation tokens
- Motion tokens
- CSS custom-property output
- TypeScript token definitions where useful

It must not contain:

- Angular components
- Lit components
- Application layouts
- Product-specific visual decisions

All shared components and applications consume tokens through supported outputs.

---

## `libs/platform/component-kernel`

**Import Alias:** `@iss/component-kernel`

Owns the Intelligent Component Kernel.

Includes:

- Reusable Lit-based Web Components
- Component public APIs
- Component styles derived from Design Tokens
- Accessibility behavior
- Component-level tests
- Component usage documentation

Initial primitive candidates may include:

- Button
- Input
- Modal
- Table

The original project brief identified these as the first Kernel primitives.

The Kernel must remain:

- Framework-compatible
- Application-independent
- Accessible
- Tree-shakeable where practical
- Consumable through a documented public entry point

It must not contain application workflows or product-domain rules.

---

## `libs/platform/ai-provider`

**Import Alias:** `@iss/ai-provider`

Owns runtime model access.

Includes:

- Provider-neutral request and response contracts
- Completion and streaming interfaces
- Model capability definitions
- Provider adapters
- Request normalization
- Response normalization
- Retry and error normalization
- Telemetry integration
- Provider selection and configuration boundaries

Applications should request capabilities rather than instantiate vendor clients.

Example conceptual boundary:

```
Application capability
        ↓
@iss/ai-provider
        ↓
OpenAI | Anthropic | Azure OpenAI | Future Provider
```

The initial implementation may support one active provider while preserving a contract capable of additional adapters. The original design requirement called for a multi-provider abstraction with OpenAI as the default and switchable alternatives.

Provider credentials must remain server-side.

A browser application may consume an application API that internally uses `@iss/ai-provider`. It must not expose secrets or directly initialize privileged provider SDKs.

---

## `libs/platform/telemetry`

**Import Alias:** `@iss/telemetry`

Owns structured AI runtime observability.

Includes:

- Telemetry event schema
- Logger interfaces
- Storage adapter interfaces
- Local JSON persistence for development
- Aggregation logic
- Token and cost calculations
- Human-readable report generation
- Error and latency metadata
- Test fixtures that do not expose real prompt data

The initial platform should support locally generated telemetry before any external observability vendor is introduced.

The original telemetry requirement includes timestamp, model, provider, token counts, latency, estimated cost, and invocation context, with both JSON and Markdown aggregation outputs.

Telemetry must not depend on any application domain.

The AI Provider may depend on Telemetry.

Telemetry must not depend on the AI Provider.

---

## `libs/platform/configuration`

**Import Alias:** `@iss/configuration`

Owns typed configuration contracts and environment normalization.

It may include:

- Runtime configuration schemas
- Environment-variable parsing
- Safe public configuration
- Server-only configuration validation
- Feature configuration contracts

It must not contain secrets.

It must not become a generic dumping ground for constants.

Create this library only when more than one application or platform library needs consistent configuration behavior.

---

## `libs/platform/shared-types`

**Import Alias:** `@iss/shared-types`

Owns only genuinely cross-cutting contracts with no stronger domain owner.

Examples may include:

- Shared identifiers
- Pagination contracts
- Common result envelopes
- Cross-platform error contracts

This library must remain small.

Do not place a type here simply because two files use it.

Domain-specific types belong to their domain library.

---

# Domain and Feature Libraries

The repository should use domain-oriented libraries where application complexity justifies separation.

## Library Type Definitions

### `feature-*`

Owns a user-visible workflow or cohesive application capability.

May depend on:

- Its domain library
- Its data-access library
- Approved platform libraries
- Lower-level UI libraries

Must not be imported by platform libraries.

### `domain`

Owns business concepts, rules, state models, and domain-level transformations.

Should avoid framework dependencies wherever practical.

May depend on:

- Shared types
- Other explicitly approved lower-level contracts

### `data-access`

Owns communication with external APIs, persistence boundaries, repositories, and application-facing client adapters.

It may depend on:

- Domain contracts
- Configuration
- Platform transport or telemetry abstractions

It should not own UI state or presentation logic.

### `data-visualization`

Owns domain-specific visualization logic.

It may use D3 or another approved rendering utility without turning that dependency into a repository-wide abstraction.

---

# Dependency Model

## Permitted Direction

```
Apps
  ↓
Feature Libraries
  ↓
Domain and Data-Access Libraries
  ↓
Platform Libraries
  ↓
External Dependencies
```

A package may depend laterally only when:

- The responsibility is explicit
- The dependency does not create a cycle
- The dependency is visible through a public interface
- The relationship is approved by the architecture

---

# Nx Project Tags

Nx project tags should enforce dependency boundaries.

Recommended tag dimensions:

## Type Tags

```
type:app
type:feature
type:domain
type:data-access
type:ui
type:platform
type:tooling
```

## Scope Tags

```
scope:platform
scope:shell
scope:interpretation
scope:signals
scope:repository
```

## Runtime Tags

```
runtime:browser
runtime:server
runtime:universal
runtime:tooling
```

Example project:

```
{
  "tags": ["type:platform","scope:platform","runtime:universal"
  ]
}
```

---

# Dependency Constraints

The following constraints should be enforced through Nx and ESLint:

| Source | May Depend On |
| --- | --- |
| `type:app` | feature, domain, data-access, ui, platform |
| `type:feature` | domain, data-access, ui, platform |
| `type:domain` | domain, platform |
| `type:data-access` | domain, platform |
| `type:ui` | platform |
| `type:platform` | platform |
| `runtime:browser` | browser, universal |
| `runtime:server` | server, universal |
| `runtime:universal` | universal |

Additional invariants:

- `scope:platform` must not depend on application scopes.
- Signal libraries must not depend on Shell or Interpretation libraries.
- Interpretation libraries must not depend on Signal or Shell libraries.
- Shell libraries may compose exposed application capabilities only when an approved integration exists.
- Browser projects must not import server-only configuration or provider adapters.
- Application projects must not import another application project.

---

# Public API Standard

Every reusable library must expose an intentional public entry point.

Example:

```
libs/platform/ai-provider/
├── src/
│   ├── index.ts
│   ├── lib/
│   │   ├── contracts/
│   │   ├── providers/
│   │   ├── telemetry/
│   │   └── errors/
│   └── testing/
├── project.json
├── tsconfig.json
└── README.md
```

Consumers import:

```
import { AiProvider, CompletionRequest } from'@iss/ai-provider';
```

Consumers must not import:

```
import { OpenAiAdapter } from'../../../libs/platform/ai-provider/src/lib/providers/openai';
```

Only public contracts and intentionally exposed implementations should appear in `src/index.ts`.

Testing utilities should be exposed through a separate approved entry point only when cross-project consumption is needed.

---

# Internal Library Structure

A library should begin with the smallest structure needed.

Preferred initial pattern:

```
<library>/
├── src/
│   ├── index.ts
│   └── lib/
├── project.json
├── tsconfig.json
├── tsconfig.lib.json
├── tsconfig.spec.json
└── README.md
```

Add internal folders only when responsibility becomes clear.

Possible folders include:

```
contracts/
adapters/
components/
services/
models/
state/
errors/
testing/
```

Do not create all folders preemptively.

The directory structure should reflect real implementation, not anticipated complexity.

---

# Prompt Ownership

Runtime application prompts do not belong in `@iss/ai-provider`.

They belong near the capability that owns their meaning.

Recommended pattern:

```
libs/signals/feature-analysis/
└── src/
    └── lib/
        └── prompts/
            ├── analyze-signal.prompt.ts
            └── score-signal.prompt.ts
```

A prompt module should own:

- Prompt construction
- Prompt-specific input contract
- Expected response contract
- Output parsing or validation
- Version identifier when operationally useful

The AI Provider executes the request.

The domain capability defines what the request means.

GitHub Copilot prompt files remain under `.github/prompts/` because they support engineering workflows rather than runtime application intelligence.

---

# Testing Structure

Tests should remain close to the behavior they protect.

## Unit and Component Tests

Co-locate with implementation:

```
component.ts
component.spec.ts
```

or:

```
service.ts
service.spec.ts
```

## Integration Tests

Place in the owning library when the integration is internal to that library.

Use a dedicated integration project only when setup, runtime, or lifecycle differs materially from unit testing.

## End-to-End Tests

Create E2E projects only when an application is ready for meaningful workflow validation.

Recommended future structure:

```
apps/
├── shell/
├── shell-e2e/
├── interpretation-engine/
├── interpretation-engine-e2e/
├── signal-system/
└── signal-system-e2e/
```

Do not scaffold all E2E projects before the applications have stable workflows.

## Contract Tests

AI Provider and Telemetry adapters should include contract tests ensuring that multiple implementations conform to the same public behavior.

Provider contract tests must not require live paid API calls during ordinary CI.

---

# Telemetry Data and Reports

Local runtime telemetry data should not be committed.

Recommended structure:

```
tmp/telemetry/
├── events.jsonl
└── aggregates/
```

Add `tmp/telemetry/` to `.gitignore`.

Public schemas and generated example reports may be committed:

```
libs/platform/telemetry/src/lib/schema/
docs/08-reports/telemetry/
```

Committed reports must be either:

- Generated from safe public fixtures
- Explicitly sanitized
- Deliberately published operational summaries

Raw prompts, credentials, and sensitive content must never appear in repository telemetry.

---

# Documentation Structure

The repository is the canonical location for documentation required to understand, operate, and modify the software.

## `docs/00-foundation`

Rules that govern the entire engineering system.

Changes should be rare and deliberate.

## `docs/01-operations`

How engineering work moves through the system.

Includes role selection, context, handoffs, and operating procedures.

## `docs/02-architecture`

Current architectural structure and system boundaries.

This blueprint belongs here.

## `docs/03-prds`

Master PRD and seven Mini PRDs.

Each implementation package should be traceable to an applicable requirement or approved architectural decision.

## `docs/04-roles`

Full human-readable engineering role definitions.

Operational Copilot agent files remain under `.github/agents`.

## `docs/05-adrs`

Architectural decisions and their rationale.

Use four-digit numbering:

```
0000-template.md
0001-monorepo-with-nx.md
0002-ai-provider-abstraction.md
```

## `docs/06-ai-sdlc`

How GitHub Copilot is directed across the engineering lifecycle.

## `docs/07-bricks`

Active and completed engineering brick records.

Completed bricks preserve the implementation decision trail without cluttering foundational documentation.

## `docs/08-reports`

Generated or curated engineering reports suitable for repository review.

---

# Root Configuration Ownership

## `package.json`

Owns:

- Workspace scripts
- Root development dependencies
- Repository metadata
- Package-manager declaration

It should not become the location for every project-specific script.

## `pnpm-workspace.yaml`

Defines repository workspace package discovery where required.

Nx remains responsible for the project graph and task orchestration.

## `nx.json`

Owns:

- Nx workspace configuration
- Named inputs
- Cacheable operations
- Task defaults
- Plugin configuration
- Project conventions

## `tsconfig.base.json`

Owns:

- Strict TypeScript defaults
- Shared compiler options
- Workspace import aliases

Project-specific overrides remain local.

## `eslint.config.mjs`

Owns:

- Repository-wide lint rules
- Nx module-boundary enforcement
- TypeScript and framework configuration
- Targeted overrides by project type

## `vitest.workspace.ts`

Owns shared Vitest workspace discovery when Vitest is used across multiple project types.

Testing configuration may remain local where framework requirements differ.

---

# Tooling Directory

`tools/` is reserved for repository-owned automation.

## `tools/generators`

Nx generators that encode repeated repository patterns.

Do not create custom generators before repetition proves their value.

## `tools/scripts`

Focused operational scripts such as:

- Telemetry report generation
- Documentation checks
- Repository validation
- Safe fixture generation

## `tools/executors`

Custom Nx executors only when standard Nx targets and scripts cannot express a necessary workflow cleanly.

The `tools/` directory must not become a secondary application layer.

---

# Naming Conventions

## Applications

Use product or runtime names:

```
shell
interpretation-engine
signal-system
signal-api
```

## Libraries

Use responsibility-oriented names:

```
component-kernel
ai-provider
feature-analysis
data-access
```

## Import Aliases

Use the `@iss/` namespace:

```
@iss/design-tokens
@iss/component-kernel
@iss/ai-provider
@iss/telemetry
@iss/signals-domain
```

Avoid aliases that expose physical repository nesting unnecessarily.

## Files

Use kebab case:

```
completion-request.ts
signal-analysis.service.ts
ai-input.element.ts
```

Follow framework-specific file suffixes where they add meaning.

---

# Initial Repository Scope

The first repository initialization should create only the foundation required to validate the architecture.

## Create in the first initialization

```
.github/copilot-instructions.md
docs/
apps/shell/
libs/platform/design-tokens/
libs/platform/component-kernel/
libs/platform/telemetry/
libs/platform/ai-provider/
tools/scripts/
nx.json
package.json
pnpm-workspace.yaml
tsconfig.base.json
eslint.config.mjs
README.md
LICENSE
```

## Do not create yet

- All anticipated feature libraries
- All E2E applications
- All provider adapters
- External telemetry integrations
- A generalized backend framework
- Micro-frontend infrastructure
- Shared state infrastructure
- Custom Nx generators
- Empty placeholder packages

The blueprint defines where those capabilities will go when approved.

It does not require them to exist before they are needed.

---

# Repository Creation Rules

A new application or library may be created only when:

1. It has one clear responsibility.
2. Its owner is unambiguous.
3. Its dependency direction is valid.
4. Existing packages cannot own the behavior without weakening their boundaries.
5. The current brick or approved ADR requires it.
6. Its public interface can be stated clearly.

A new package should not be created merely to make the tree look architecturally sophisticated.

---

# Architecture Enforcement

The blueprint should be enforced through:

- Nx project tags
- ESLint module-boundary rules
- TypeScript path aliases
- Public package entry points
- CI validation
- Engineering review
- Path-specific Copilot instructions
- ADRs for approved exceptions

Documentation alone is not sufficient enforcement.

Automated enforcement should be added where a rule can be expressed reliably without introducing disproportionate complexity.

---

# Exceptions

Exceptions to this blueprint require Human Technical Lead approval.

An exception should identify:

- The rule being changed
- Why the existing structure is insufficient
- The affected projects
- The long-term consequence
- Whether an ADR is required
- Whether the exception is temporary or permanent

Do not encode an architectural exception silently in implementation.

---

# Definition of Done

The Repository Blueprint is complete when:

- Every initial ISS system has a defined repository location.
- Application and platform responsibilities are separated.
- The secure backend boundary is explicit.
- The AI Provider and Telemetry dependency direction is defined.
- Runtime prompts have a clear owner.
- Documentation and engineering artifacts have canonical locations.
- Nx tags and dependency constraints are established.
- Public API expectations are explicit.
- Initial versus future repository scope is separated.
- The blueprint can be translated directly into an initialization runbook.
- No speculative package is required merely to satisfy the diagram.

---

# Final Repository Model

```
GitHub Copilot Engineering System
                ↓
         Nx Monorepo Governance
                ↓
     Applications and Feature Domains
                ↓
      Shared Platform Capabilities
                ↓
 Providers, Storage, and Infrastructure
```

The repository should remain understandable to a technical reviewer without verbal explanation.

Its structure should reveal:

- What the systems are
- Where intelligence enters
- Which capabilities are shared
- Which boundaries protect the architecture
- How runtime AI activity is observed
- Where human engineering judgment remains in control

This blueprint is sufficient to lock as the repository architecture standard.