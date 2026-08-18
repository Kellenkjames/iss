# ISS Component Kernel Implementation Standard

**Version:** 1.0\
**Status:** Active\
**Applies To:** `libs/platform/component-kernel`\
**Architecture Layer:** Shared Platform / Presentation\
**Primary PRD:** PRD-02 --- Intelligent Component Kernel

------------------------------------------------------------------------

## 1. Purpose

This standard defines the standing implementation conventions for the
Intelligent Systems Suite (ISS) Component Kernel.

It captures the architectural patterns established through the initial
Kernel engineering bricks so that future component work can reference a
stable repository standard rather than restating settled rules in every
Engineering Brick contract.

This document supplements, but does not replace:

-   the ISS Engineering Constitution;
-   Architecture Standards;
-   Repository Blueprint;
-   PRD-02 --- Intelligent Component Kernel;
-   authoritative ISS design documentation;
-   component-specific Engineering Brick contracts.

When a component-specific contract introduces an explicit exception or
new architectural decision, that decision must be surfaced for review
rather than silently overriding this standard.

------------------------------------------------------------------------

## 2. Architectural Boundary

The Component Kernel resides at:

`libs/platform/component-kernel`

Its role is to provide framework-independent, reusable interaction and
presentation primitives for ISS applications.

### Permitted internal dependency

-   Design Tokens

### Prohibited dependencies and concerns

The Kernel must not depend on or contain:

-   Angular application code;
-   application-specific business logic;
-   application state management;
-   routing;
-   authentication;
-   AI-provider integrations;
-   telemetry or analytics;
-   backend/API communication;
-   project-specific workflows.

The intended dependency direction remains:

``` text
Design Tokens
      ↓
Component Kernel
      ↓
ISS Applications
```

Applications consume the Kernel. The Kernel must not depend on
applications.

------------------------------------------------------------------------

## 3. Implementation Technology

Kernel components use:

-   Lit;
-   TypeScript;
-   Web Components APIs;
-   native HTML semantics wherever appropriate.

Components must remain framework-independent.

Do not introduce additional UI frameworks, component abstraction layers,
or generalized infrastructure unless a demonstrated architectural need
has been approved.

Transparency and native platform behavior are preferred over
abstraction.

------------------------------------------------------------------------

## 4. Design Token Consumption

Kernel components consume the canonical ISS Design Tokens through the
established `--iss-*` CSS custom-property contract.

Foundational visual values must not be redeclared inside the Kernel.

### Raw values

Raw values may be used locally only when they represent:

-   intrinsic component geometry;
-   accessibility requirements;
-   native implementation mechanics;
-   or behavior for which no appropriate architectural token exists.

Examples may include local icon geometry, focus-ring mechanics,
target-size requirements, or similarly component-specific implementation
details.

Raw values must not become an informal replacement for the Design Tokens
package.

If implementation reveals a missing foundational visual primitive that
is likely to be reused across components, surface the requirement for an
explicit Design Tokens decision rather than inventing a new token
architecture inside the component brick.

------------------------------------------------------------------------

## 5. Public Component APIs

Public APIs must remain:

-   small;
-   typed;
-   closed where practical;
-   predictable;
-   stable;
-   justified by demonstrated consumer need.

Do not expose properties, variants, slots, events, or styling escape
hatches solely for hypothetical flexibility.

Enum-like public values should use explicit supported sets. Unsupported
values should normalize to an approved default when normalization is
appropriate to the component contract.

Breaking changes to established public APIs require the repository's
normal architectural decision process.

------------------------------------------------------------------------

## 6. Native Semantics First

Use native HTML semantics and browser behavior wherever they correctly
model the interaction.

Established examples include:

-   `iss-button` → native `<button>`;
-   `iss-input` → native `<input>` or `<textarea>` when multiline mode is enabled;
-   `iss-badge` → non-interactive text/status presentation;
-   interactive components → native interactive semantics where
    applicable.

Do not recreate native interaction behavior with generic elements when
an appropriate semantic HTML element exists.

ARIA supplements native semantics. It must not be used as an unnecessary
substitute for them.

------------------------------------------------------------------------

## 7. Accessibility

Accessibility is part of the component contract and must not be deferred
as later polish.

Each component must consider, where applicable:

-   accessible naming;
-   semantic structure;
-   keyboard operation;
-   focus behavior and visible focus treatment;
-   disabled and readonly semantics;
-   state communication;
-   color-independent meaning;
-   interaction target sizing;
-   screen-reader behavior;
-   reduced-motion preferences.

Accessibility behavior should be implemented at the lowest appropriate
architectural layer so downstream applications inherit correct behavior
by default.

Do not infer business-specific accessible language when the component
cannot know the consumer's intent.

------------------------------------------------------------------------

## 8. Registration Architecture

All public Kernel custom elements use the established registration
architecture.

Each new public component must:

1.  use the `iss-*` custom-element namespace;
2.  provide registration through the existing Kernel registration
    surface;
3.  preserve duplicate-safe definition behavior using the established
    `customElements.get` guard pattern;
4.  join `registerIssComponents()` when appropriate;
5.  avoid creating a second registry or parallel registration subsystem.

Registration changes should be additive unless an explicit architectural
refactor has been approved.

------------------------------------------------------------------------

## 9. Public Exports

New public components extend the existing Component Kernel entry point
and follow established export conventions.

Export only the public symbols required by the component contract, such
as:

-   tag constants;
-   component classes;
-   public types;
-   approved registration helpers.

Do not create alternate package surfaces or component-specific package
architectures without demonstrated need.

------------------------------------------------------------------------

## 10. Angular Interoperability

ISS Angular applications consume Kernel components directly as native
custom elements.

The default integration model is:

``` text
Kernel Web Component
        ↓
Angular Template
```

not:

``` text
Kernel Web Component
        ↓
Angular Wrapper
        ↓
Angular Template
```

Do not introduce Angular wrappers, ControlValueAccessor implementations,
or framework-specific adaptation layers unless a demonstrated
interoperability requirement proves they are necessary.

Framework-specific convenience alone is not sufficient justification.

------------------------------------------------------------------------

## 11. Shell Integration

The ISS shell may be updated to provide a minimal interoperability proof
for a new Kernel component.

Shell changes should demonstrate only what is necessary to verify:

-   registration;
-   rendering;
-   direct Angular consumption;
-   essential interaction or composition behavior.

The shell is not a Storybook replacement, component showcase, or
application-design surface.

Do not expand a Kernel brick into shell redesign or application-specific
functionality.

------------------------------------------------------------------------

## 12. Testing Standard

Every new component requires focused, behavior-oriented tests
appropriate to its contract.

Tests should verify public behavior rather than merely implementation
details wherever practical.

Relevant areas may include:

-   registration;
-   rendering;
-   public properties and attributes;
-   normalization;
-   native semantics;
-   accessibility;
-   events;
-   keyboard behavior;
-   state synchronization;
-   slots and composition;
-   disabled/readonly behavior;
-   regressions to established components.

### Canonical test-target requirement

A test file existing in the repository is not sufficient evidence of
coverage.

Every new component test suite must be executed by the canonical Nx
`component-kernel` test target.

The final implementation report and Engineering Review should confirm
the executed spec-file and test counts when relevant.

Existing Kernel component tests must remain green.

------------------------------------------------------------------------

## 13. Runtime Verification

Build, lint, and unit tests are necessary but may not prove all browser
behavior.

Perform runtime browser verification when visual, lifecycle, focus,
event, composition, or custom-element behavior cannot be adequately
established through automated tests alone.

Runtime verification is especially important when implementation
involves:

-   Lit reactive state;
-   slot projection;
-   custom-element lifecycle behavior;
-   focus management;
-   layered interaction surfaces;
-   cross-framework rendering;
-   browser-native semantics.

A component that compiles and passes tests but fails to render or behave
correctly in the shell is not complete.

------------------------------------------------------------------------

## 14. Standard Validation Chain

Unless a Brick contract explicitly requires additional validation,
Kernel work must complete the following chain:

``` bash
pnpm nx build design-tokens
pnpm nx lint design-tokens

pnpm nx build component-kernel
pnpm nx lint component-kernel
pnpm nx test component-kernel

pnpm nx lint shell
pnpm nx build shell
pnpm nx test shell --watch=false
```

The Nx dependency graph must also be inspected to confirm the intended
architecture remains intact:

``` text
component-kernel → design-tokens
shell → component-kernel
```

No forbidden reverse dependency should be introduced.

A lint or test pass is not a substitute for a required build.
Environmental failures must be reported distinctly rather than treated
as successful validation.

------------------------------------------------------------------------

## 15. Dependency Discipline

Dependencies should remain intentionally minimal.

Before adding a dependency, determine whether the capability can be
implemented transparently with:

-   Lit;
-   TypeScript;
-   native Web APIs;
-   existing repository infrastructure.

Do not add a library merely to reduce a small amount of component-local
implementation.

Any new runtime dependency must be explicitly justified in the
Engineering Brick report and independently reviewed.

------------------------------------------------------------------------

## 16. Scope Discipline

A Kernel Engineering Brick should normally introduce one architectural
capability or one component primitive/composite.

Do not create speculative:

-   base component classes;
-   generic component abstractions;
-   new registries;
-   form frameworks;
-   validation frameworks;
-   styling systems;
-   icon systems;
-   animation frameworks;
-   utility packages;
-   additional components;
-   application features

unless the Brick contract explicitly authorizes them.

Repeated implementation patterns may justify future abstraction, but
repetition must be demonstrated before generalization.

------------------------------------------------------------------------

## 17. Existing Architecture Preservation

Future components should reuse established Kernel architecture before
introducing new mechanisms.

Relevant existing patterns include:

-   canonical Design Token consumption;
-   duplicate-safe custom-element registration;
-   aggregate registration;
-   public export conventions;
-   closed property normalization;
-   direct Angular consumption;
-   native semantic elements;
-   behavior-oriented tests;
-   minimal shell interoperability proofs.

Use the nearest relevant existing component as an implementation
reference when appropriate, while treating the current Brick contract
and authoritative specifications as the source of truth for
component-specific behavior.

Do not copy an existing pattern when the new component's semantics
require a different solution.

------------------------------------------------------------------------

## 18. Specification Authority

For component-specific behavior, consult the smallest authoritative
source set necessary to implement the Brick correctly.

Typical priority:

1.  current Engineering Brick contract;
2.  PRD-02;
3.  relevant Component Library Specification section;
4.  relevant Design Foundations section;
5.  this Implementation Standard;
6.  nearest established Kernel implementation.

Broader governance documentation should be consulted when a conflict,
ambiguity, architectural exception, or new system-level decision arises.

Do not invent missing requirements merely to make a component more
comprehensive.

------------------------------------------------------------------------

## 19. Engineering Brick Workflow

The standard Kernel delivery cadence is:

``` text
Brick Delta Contract
        ↓
Agent Implementation
        ↓
Validation
        ↓
Independent Engineering Review
        ↓
Human Approval
        ↓
Commit
        ↓
Push
```

The implementation Agent must stop before commit and push unless
explicitly instructed otherwise.

Independent review should inspect the actual repository diff and
validation evidence rather than relying solely on the implementation
report.

Human approval remains the final decision gate.

------------------------------------------------------------------------

## 20. Agent Context Strategy

Future Kernel Engineering Brick prompts should use this document as
standing context rather than restating settled architectural rules.

A Brick Delta should focus on information that is genuinely new:

-   objective;
-   component-specific contract;
-   locked decisions;
-   scope;
-   explicit exclusions;
-   specification gaps;
-   acceptance criteria;
-   brick-specific validation or review hotspots.

Agents should inspect the relevant PRD/specification and nearest
implementation patterns first. Broader repository documentation should
be loaded only when needed to resolve ambiguity or architectural
conflict.

This approach reduces repeated AI context while preserving engineering
rigor.

------------------------------------------------------------------------

## 21. Definition of Compliance

A Component Kernel change complies with this standard when:

-   it remains inside the Kernel's architectural boundary;
-   it consumes canonical Design Tokens without duplicating foundational
    values;
-   it uses framework-independent Lit/Web Component architecture;
-   its public API is minimal and intentional;
-   native semantics and accessibility are built in;
-   it extends existing registration/export infrastructure;
-   Angular can consume it directly where applicable;
-   its tests actually execute through the canonical Nx target;
-   required build, lint, test, graph, and relevant runtime checks pass;
-   no speculative infrastructure or unrelated scope is introduced;
-   independent Engineering Review finds no blocking architectural
    issue.

The objective is not maximum component sophistication.

The objective is a stable, reusable interaction layer that becomes more
capable without becoming more architecturally complex than demonstrated
needs require.
