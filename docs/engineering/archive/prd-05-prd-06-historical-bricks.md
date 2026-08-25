# Archived PRD-05 and PRD-06 Engineering Bricks

This file preserves the historical engineering-brick records that are no longer part of the active planning instance. The current active work is tracked in the parent brief, [../active-brick.md](../active-brick.md).

The records below are retained for architectural history, review traceability, and implementation context. They are not active work queues.

---

## Completed PRD-06 v1 Record

### Title

PRD-06 Brick 4 - Purposeful Source Visualization

### Status

Completed - Engineering review passed; PRD-06 v1 closure approved.

### Outcome

Add one lightweight visualization to the Interpretation Engine that helps a user see a meaningful pattern in the current in-memory source dataset before requesting an interpretation. The visualization must support the inspection workflow, remain understandable without AI output, and avoid turning the reference application into a dashboard or analytics product.

### Why This Brick Exists

PRD-06 identifies lightweight charts as a v1 capability. Brick 3 established a typed source dataset and local selection boundary; Brick 4 can now add a visual summary without inventing data ingestion, persistence, or generalized chart infrastructure. The visualization is a supporting lens on the existing fixture, not a new source of truth.

### Current Working Hypothesis

If the application renders one accessible, deterministic visual summary derived from the existing `SourceRecord[]` fixture, while retaining the table as the authoritative inspection surface, then PRD-06 will demonstrate purposeful visualization without introducing analytics-platform scope or a new shared UI contract.

### Design Direction

The experience should remain an inspection workspace:

```text
Source records table
        |
Purposeful visual summary of the same records
        |
Selected record context -> existing interpretation workflow
```

Candidate visualization: a compact status-distribution graphic showing Open, Review, and Blocked records. The design checkpoint must confirm whether a CSS-based visual, an existing Kernel composition, or a small visualization dependency is appropriate. Do not add a charting dependency before that choice is reviewed.

Design constraints:

- use the existing dataset as the sole source of visual values
- keep the table available as the accessible source representation
- provide a text summary and meaningful labels for non-visual users
- preserve the selected-record and manual interpretation paths
- avoid animation that communicates essential information only visually
- avoid dashboards, axes-heavy analytics, filtering, sorting, pagination, and multiple chart types

### Review Checkpoint Status

- Checkpoint A: design readiness - passed; use a token-based CSS status distribution with a first-class text summary and no new dependency.
- Checkpoint B: visualization milestone - passed; status distribution is rendered from the existing dataset and browser-tested.
- Checkpoint C: validation gate - passed; focused accessibility, behavior, lint, test, and build checks pass.
- Checkpoint D: scope gate - passed; no additional charts, metrics, filters, or external data were introduced.
- Checkpoint E: review remediation - completed; undefined text and border tokens were replaced with the existing `--iss-color-text-muted` and `--iss-color-border` tokens and revalidated.
- Engineering-review trigger: satisfied; final re-review passed on 2026-08-23.

### TODOs

- [x] Define the single visual question the chart answers: how are the current source records distributed by operational status?
- [x] Select the smallest representation: three labeled horizontal status bars derived from the existing records.
- [x] Decide between token-based CSS, existing Kernel primitives, and a new visualization dependency: use token-based CSS and native semantic markup; add no dependency.
- [x] Define the derived view-model without changing the `SourceRecord` contract.
- [x] Add a text-equivalent summary and accessible labeling.
- [x] Render the visualization from the existing deterministic dataset.
- [x] Keep the table authoritative and the interpretation handoff unchanged.
- [x] Add focused tests for derived values, empty data, labels, and responsive rendering.
- [x] Add browser checks for visual presence, no overflow, and accessible text.
- [x] Document the visualization’s purpose and known limitations.
- [x] Run focused application validation after the first implementation edit.
- [x] Run the applicable six-project repository matrix.
- [x] Trigger engineering review before Brick 4 closure.

### In Scope

- one visualization answering one clearly stated inspection question
- derived values from the existing in-memory source dataset
- accessible text summary and semantic labeling
- responsive presentation using existing design tokens
- focused application tests and documentation

### Out of Scope

- multiple charts or a configurable visualization system
- external data sources, ingestion, or persistence
- charting infrastructure shared across applications
- dashboards, filters, sorting, pagination, or reporting
- predictive analytics or autonomous recommendations
- changes to AI Provider, Telemetry, Design Tokens, or Component Kernel contracts

### Likely Files or Projects Affected

- `apps/interpretation-engine/src/app/app.ts`
- `apps/interpretation-engine/src/app/app.html`
- `apps/interpretation-engine/src/app/app.css`
- `apps/interpretation-engine/src/app/source-dataset.ts` only if a derived view-model is needed
- `apps/interpretation-engine/src/app/app.spec.ts`
- `apps/interpretation-engine/README.md`
- `docs/engineering/active-brick.md`
- `package.json` and `pnpm-lock.yaml` only if Checkpoint A approves a new visualization dependency

### Acceptance Criteria

- one purposeful visual summary is visible beside or near the authoritative source table
- the visual is derived only from the deterministic source dataset
- the visual question and interpretation are clear without invoking AI
- an equivalent text summary is available to assistive technology and non-visual users
- empty data behavior is explicit
- the visualization remains usable on desktop and mobile without overflow
- table selection, manual input, and interpretation handoff remain intact
- no persistence, external ingestion, dashboard behavior, or platform contract changes are introduced
- focused tests and applicable lint, test, and build targets pass
- engineering review approves the visualization boundary before closure

### Review Gate

Engineering review is required at Checkpoint A if a new dependency or reusable visualization abstraction is proposed, at Checkpoint B for the visual-to-source relationship, and at Checkpoint C before closure. Review must verify that the visualization is purposeful, accessible, deterministic, application-local, and subordinate to human inspection and interpretation.

### Review Remediation Evidence

- Focused tests, lint, and production build passed after replacing the undefined tokens.
- Browser computed styles confirmed the panel border and status-track background resolve to `--iss-color-border`.
- Browser computed styles confirmed no values are supplied by the removed `--iss-color-text-secondary` or `--iss-color-border-subtle` tokens.

### Review Outcome

- Result: Pass.
- Recommendation: Approve.
- Engineering brick status: Approved.
- Review date: 2026-08-23.
- Previous blocking token findings were resolved with existing shared tokens; no conditions remain.
- Final review confirmed scope alignment, application-local visualization ownership, accessible text equivalence, responsive behavior, documentation completeness, and validation evidence.

### PRD-06 v1 Closure

- PRD-06 v1 completion assessment: Pass.
- Decision: Close PRD-06 v1 now.
- Recommendation: Approve Closure.
- Required v1 gaps: none identified.
- Optional future extensions remain deferred under PRD-06 Section 9 and require separate planning and review.
- Closure date: 2026-08-23.

### Risks and Unresolved Decisions

- A new charting dependency could be disproportionate to one visual summary; resolve this before implementation.
- Visual summaries can imply analytical certainty; labels and supporting text must make the derived nature of the fixture clear.
- SVG or canvas output could weaken accessibility if the text equivalent is not treated as first-class content.
- Additional metrics or chart types belong in later bricks and require new scope approval.

---

## Completed PRD-06 Record

### Title

PRD-06 Brick 3 - Structured Source Dataset Presentation

### Status

Completed - Engineering review passed with conditions closed.

### Outcome

Introduce a small, deterministic source dataset view in the dedicated Interpretation Engine so users can inspect the information that will later be interpreted. This brick establishes the presentation and selection boundary for structured information without adding persistence, charts, ingestion, or new platform infrastructure.

### Why This Brick Exists

Brick 2 proved the interpretation interaction with manually supplied subject and context. PRD-06 also requires structured data presentation before the application can demonstrate interpretation of a dataset. Brick 3 should establish that source-information surface independently, keeping the input understandable and the future chart boundary open without prematurely building an analytics product.

### Current Working Hypothesis

If the Interpretation Engine presents a small typed in-memory dataset through existing Kernel components, with clear empty and selected states, then future interpretation and visualization bricks can consume a stable source-selection contract without introducing persistence or domain storage.

### Design Direction

The experience should read as an inspection workspace, not a dashboard:

```text
Page heading and purpose
        |
Source dataset summary
        |
Structured records table/list  ->  selected record context
        |
Interpret selected context (handoff to existing interpretation flow)
```

Design constraints:

- use existing Design Tokens and Component Kernel primitives
- show one deliberately small dataset with human-readable columns
- make the selected record obvious and keyboard-accessible
- preserve the existing interpretation workflow rather than duplicating it
- avoid charts, filters, pagination, persistence, and dashboard chrome

### Review Checkpoint Status

- Checkpoint A: design readiness - passed; local typed records and selector boundary approved for implementation.
- Checkpoint B: interaction milestone - passed; dataset display, selection, and interpretation handoff are browser-tested.
- Checkpoint C: validation gate - passed; focused tests, lint, and production build pass.
- Checkpoint D: scope gate - passed; no charts, filters, persistence, or additional datasets were introduced.
- Engineering-review trigger: satisfied; final review passed with documentation conditions closed.

### TODOs

- [x] Define a minimal typed source record and dataset fixture owned by the application.
- [x] Select records by local record id while keeping the contract local to the application.
- [x] Design the table columns around inspection, not analytics.
- [x] Add selected, unselected, and empty dataset states using existing Kernel components.
- [x] Connect the selected record to the existing interpretation request without duplicating provider logic.
- [x] Preserve the current manual interpretation flow as a supported path.
- [x] Add focused tests for dataset rendering and interpretation handoff.
- [x] Document the source dataset boundary and fixture limitations.
- [x] Run the focused application validation after the first implementation edit.
- [x] Run the applicable repository matrix.
- [x] Trigger engineering review before Brick 3 closure.

### In Scope

- one typed, in-memory dataset fixture
- structured record presentation using existing Kernel components
- selection state for one source record
- selected-record handoff into the existing interpretation request
- empty and selected state behavior
- focused application tests and documentation

### Out of Scope

- charting or visualization libraries
- external data ingestion or persistence
- dashboard chrome or filtering behaviors
- business workflow automation
- new platform contracts or shared domain abstractions

### Likely Files or Projects Affected

- `apps/interpretation-engine/src/app/source-dataset.ts`
- `apps/interpretation-engine/src/app/app.ts`
- `apps/interpretation-engine/src/app/app.html`
- `apps/interpretation-engine/src/app/app.css`
- `apps/interpretation-engine/src/app/app.spec.ts`
- `docs/engineering/active-brick.md`

### Acceptance Criteria

- the source dataset remains a small, local fixture owned by the app
- the table and selection flow remain understandable without analytics framing
- the interpretation handoff stays intact and human-controlled
- empty and selected states remain explicit and accessible
- no persistence or external backend is introduced
- focused tests and repo validation pass
- review occurs before closure

### Review Outcome

- Result: Pass.
- Recommendation: Approve.
- Engineering brick status: Approved.

---

## Next Proposed Brick

### Title

PRD-05 Brick 1 - Application Shell Reference Integration Validation

### Planning Status

Proposed for human approval.

### Outcome

Confirm that `apps/shell` is a complete, understandable reference integration for the current platform baseline without adding product features or new infrastructure.

### Why This Brick Exists

PRD-05 defines the shell as the canonical example of how an ISS application consumes Design Tokens, Component Kernel, AI Provider, and Telemetry. The shell already demonstrates these integrations, but its reference status should be closed through an explicit acceptance pass before PRD-06 or PRD-07 work begins.

### Local Hypothesis

If the shell's platform imports, component composition, AI workflows, browser demo behavior, and validation targets are checked together, then PRD-05 v1 can be confirmed without changing shared platform contracts or introducing shell infrastructure.

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

Use the engineering review gate if the acceptance pass changes a shared boundary or introduces a new public shell contract.

---

## Next Proposed Brick

### Title

PRD-07 Brick 1 - Signal Discovery and Decision-Ready Detail

### Status

Proposed - Planning and design readiness checkpoint required before implementation.

### Outcome

Define the first PRD-07 release slice as a narrow, human-centered signal workflow that demonstrates discovery, inspection, AI-assisted interpretation, and operational evidence without introducing enterprise, backend, or platform-scope expansion.

### Why This Brick Exists

PRD-07 is the flagship application boundary for ISS. The first release must prove one complete, coherent application workflow rather than broad product scope. The Shell and Interpretation Engine already establish the repository pattern: reuse platform contracts, keep application logic local, and use deterministic data for v1 validation. This first brick should establish the exact user problem, signal model, workflow, and ownership boundaries for the Signal System before any app scaffolding or dependency expansion occurs.

### Current Working Hypothesis

If the Signal System defines one clear signal workflow around meaningful evidence, human decision authority, and AI-supported interpretation, while keeping initial data deterministic and all platform work in approved packages, then the first PRD-07 brick will deliver a flagship-quality vertical slice without turning the project into a generalized SaaS product or a new shared platform layer.

### Design Direction

The experience should read as a disciplined decision workspace rather than a dashboard or AI demo.

```text
Signal discovery list
        |
Selected signal detail
        |
Evidence and context review
        |
AI-assisted interpretation
        |
Human decision / actionability
        |
Telemetry evidence
```

Design constraints:

- use the existing Design Tokens and Component Kernel primitives wherever possible
- keep the initial data deterministic and application-local
- make the signal status, owner, and evidence explicit
- keep the AI output secondary to the user’s review of the signal itself
- preserve human judgment as the authority for any decision
- avoid dashboards, notifications, collaboration, authentication, and workflow automation
- avoid back-end and persistence requirements until the workflow is proven

### Review Checkpoint Status

- Checkpoint A: design readiness - passed; primary user context, signal model, lifecycle, discovery surface, detail surface, AI interpretation boundary, telemetry expectations, and validation strategy are confirmed for the first v1 slice.
- Checkpoint B: implementation milestone - pending; only after the brick is approved and the app workflow is implemented.
- Checkpoint C: validation gate - pending; focused tests, lint, and build checks required before closure.
- Checkpoint D: scope gate - pending; confirm no enterprise, collaboration, automation, or platform drift enters the brick.
- Checkpoint E: engineering review - pending; required before closure once the implementation is ready.
- Checkpoint F: closure - pending; only after review conditions close and PRD criteria are satisfied.

### Review Conditions Closed

The following review conditions are closed as of 2026-08-24:

- User and decision context: the primary user is an engineering or operations lead triaging a small set of operational signals; the decision is to accept, defer, or escalate based on evidence rather than blindly follow AI output.
- Signal model: the signal is defined as an application-local, deterministic record with subject, evidence, status, owner, and confidence. It remains a product-specific workflow and is not promoted into a shared platform contract.
- Scope guard: the first release intentionally excludes authentication, collaboration, workflow automation, ERP or enterprise features, backend persistence, and dashboard expansion. The implementation remains frontend-first and local-first.
- AI decision boundary: AI interpretation is explicitly secondary to the human reviewer. The app sends the signal subject and evidence to the shared provider boundary, but the user remains the authority for the final decision.

### TODOs

- [x] Define the primary user and decision context for the Signal System.
- [x] Define a minimal, explicit signal data model owned by the application.
- [x] Decide the initial source of truth: deterministic in-memory fixture, not an early backend.
- [x] Design the discovery surface, selected-signal detail view, and interpretation flow.
- [x] Confirm AI usage stays in the application boundary and relies on `@iss/ai-provider`.
- [x] Confirm telemetry remains captured through the repository’s approved browser evidence path.
- [x] Define the minimal successful vertical slice for v1.
- [x] Document application-owned versus platform-owned responsibilities for the first brick.
- [x] Confirm no enterprise, collaboration, or workflow automation scope enters v1.
- [x] Validate the design against PRD-07 success criteria and repo architecture standards.

### In Scope

- signal discovery
- signal presentation
- structured detail views
- AI-assisted interpretation
- human decision authority
- shared Design Tokens usage
- shared Component Kernel usage
- AI Provider integration
- browser telemetry evidence
- one complete end-to-end workflow with deterministic data

### Out of Scope

- multi-user collaboration
- authentication and role-based access control
- notifications or event-driven user messaging
- workflow automation
- persistent business storage or backend services
- analytics dashboards or generalized reporting
- mobile-native development
- plugin ecosystems or extensibility frameworks
- enterprise SaaS features
- autonomous agent logic
- generalized AI agent infrastructure

### Likely Files or Projects Affected

- `apps/signal-system/` (new app project to be created only after this design checkpoint)
- `apps/signal-system/src/app/` for application-local signal workflow and composition
- `apps/signal-system/src/app/signal-model.ts` or equivalent for the domain contract
- `apps/signal-system/src/app/signal-service.ts` for application-owned signal orchestration
- `apps/signal-system/src/app/app.html` and `app.ts` for discovery/detail/interpretation UI
- `apps/signal-system/src/app/app.css` for token-based styling
- `apps/signal-system/project.json` for Nx project registration
- `docs/engineering/active-brick.md`
- `docs/product/mini-prds/prd-07.md` only if the design checkpoint requires a scope clarification

### Acceptance Criteria

- the user and decision context are explicit and reviewable
- the signal concept is understandable without requiring product speculation
- the initial workflow is a narrow, polished vertical slice rather than a broad toolkit
- signal discovery and detail surfaces are clearly separated and purposeful
- AI interpretation is a support layer, not a replacement for human judgment
- the app consumes platform packages through the approved public boundaries
- telemetry evidence is captured for the AI interaction path
- deterministic local source data is the v1 default unless a later approved brick adds a real backend
- no enterprise, collaboration, automation, or analytics drift is introduced
- design readiness is approved before app scaffolding or dependency creation begins

### Review Trigger

Engineering review is required before implementation begins because this brick establishes the flagship application boundary, application ownership model, and the first public workflow contract for PRD-07.

### Risks and Unresolved Decisions

- the app could drift into dashboard or analytics territory if signal detail expands too early
- AI could become the dominant experience instead of a support tool without a sharp human-judgment boundary
- a backend could be introduced too early before the application workflow is validated
- a reusable abstraction could accidentally become a shared platform feature before the application proves its necessity
- the signal model must remain narrow and reviewable; overgeneralization would weaken the flagship signal

### Recommended Review

- primary: Engineering Reviewer
- secondary: Frontend Engineer
- tertiary: AI Integration Engineer

### Checkpoint A: Planning And Design Readiness

The following checklist must be satisfied before implementation begins. If any item is unresolved, the brick remains in planning status and the work should not advance to scaffolding or dependency changes.

#### 1. User and Decision Context

- [x] The primary user is explicitly defined and tied to a real decision-making role.
- [x] The user’s core question is stated in plain language.
- [x] The workflow is framed around decision support, not generalized AI interaction.
- [x] The product concept remains a narrow operational signal workflow rather than a platform or dashboard abstraction.

#### 2. Signal Concept and Definition

- [x] A signal is defined as a discrete, actionable unit of meaningful information.
- [x] Each signal contains enough evidence for an informed review without requiring a large analytics system.
- [x] Signal meaning is distinct from generic notifications, feed items, or platform events.
- [x] The signal definition remains application-local and not promoted into a shared platform contract.

#### 3. Signal Lifecycle and States

- [x] The signal lifecycle is explicit: discovered, inspected, interpreted, decided, and closed or deferred.
- [x] The minimum required states are defined, such as open, review, action required, and resolved.
- [x] State transitions remain understandable to a human reviewer.
- [x] The lifecycle does not imply workflow automation, orchestration, or enterprise process systems.

#### 4. Discovery and Detail Surfaces

- [x] The discovery surface is designed as a compact signal list or feed that supports quick triage.
- [x] The detail surface exposes the signal’s evidence, context, status, and ownership clearly.
- [x] The detail surface is intentionally narrower than a dashboard and remains easy to review within a single screen.
- [x] The selection and presentation path is clear for keyboard and screen-reader users.

#### 5. AI Interpretation Entry Point

- [x] The AI interpretation entry point is explicitly tied to a user’s review of the signal.
- [x] The model input includes subject, evidence, and optional user question, without introducing hidden context or opaque prompt behavior.
- [x] AI output remains explanatory and secondary to the human evidence review.
- [x] The app does not treat AI as the final authority on the decision.

#### 6. Telemetry Expectations

- [x] The AI interaction path is expected to emit telemetry through the approved repository boundary.
- [x] Telemetry captures operational evidence such as provider, model, timing, and outcome without storing raw sensitive content.
- [x] The application does not implement custom telemetry storage or duplicated logging behavior.
- [x] Telemetry remains observability evidence for engineering review rather than product analytics.

#### 7. Human Decision Authority

- [x] The user is clearly the decision-maker for acceptance, deferral, or rejection of the signal.
- [x] The AI interpretation is framed as evidence support rather than autonomous decision-making.
- [x] There is no hidden automation, forced action, or silent state mutation.
- [x] The UI makes the decision boundary explicit and reviewable.

#### 8. Minimum Successful Vertical Slice

- [x] The first brick defines one complete workflow: discover signal -> inspect evidence -> request interpretation -> record/capture evidence -> decide.
- [x] The slice remains intentionally small enough for review and validation.
- [x] Deterministic fixture data is approved as the initial source of truth for v1.
- [x] The slice does not depend on authentication, persistence, or external systems to prove the architectural pattern.

#### 9. Application Versus Platform Ownership

- [x] Signal concepts, business flow, and UX remain owned by the application layer.
- [x] Reusable platform packages remain limited to design tokens, kernel components, AI Provider, and telemetry.
- [x] No new shared infrastructure is proposed before the application need is proven.
- [x] The app does not duplicate any provider or telemetry logic already defined at the platform layer.

#### 10. Frontend / Backend Boundary

- [x] The initial implementation is defined as frontend-first with local deterministic data.
- [x] No backend contract is introduced unless the brick explicitly requires it and the design checkpoint approves it.
- [x] The application boundary is described precisely and does not depend on hidden services.
- [x] The v1 implementation remains browser-safe and local-first.

#### 11. Data and Persistence Assumptions

- [x] The initial data model is in-memory and deterministic.
- [x] Persistence is explicitly out of scope for the first brick.
- [x] No enterprise data model, user data store, or app-specific database is introduced prematurely.
- [x] The application can be understood and validated from the repository without requiring a service layer.

#### 12. Runtime and Browser Safety Constraints

- [x] The v1 execution path remains safe for browser-only local execution.
- [x] No secrets, raw credentials, or sensitive provider details are embedded in the app.
- [x] The AI Provider boundary handles runtime config safely and deterministically.
- [x] The app behavior is reviewable without relying on any external environment-specific configuration.

#### 13. Design Direction and Accessibility Expectations

- [x] The visual language matches the repository’s Design Tokens and shared interaction patterns.
- [x] The app remains understandable and accessible without relying on color alone.
- [x] Labels, status semantics, and text summaries are treated as first-class content.
- [x] The design supports both desktop and mobile readability without creating dashboard-scale complexity.

#### 14. Explicit Out-of-Scope Statement

- [x] The brick explicitly lists excluded features and product domains.
- [x] Collaboration, auth, workflow orchestration, and enterprise SaaS scope are clearly rejected for v1.
- [x] The work is intentionally narrower than a general-purpose product or platform.
- [x] No roadmap drift is hidden inside the implementation plan.

#### Approval Decision

- [x] Ready for implementation
- [ ] Needs design revision before implementation
- [ ] Rejected for architecture or scope reasons

#### Required Reviewer Signoff

- Primary reviewer: Engineering Reviewer
- Secondary reviewer: Frontend Engineer
- Tertiary reviewer: AI Integration Engineer

### Recommended Human Decision

This brick is approved to continue into implementation after the design checkpoint confirms the signal model, vertical slice, ownership boundaries, and validation strategy. The review conditions above are closed as of 2026-08-24, and the planned implementation remains within the approved PRD-07 scope.

---
