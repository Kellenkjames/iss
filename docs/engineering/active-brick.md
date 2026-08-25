# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 2 - Signal Source Boundary and Operational Ingestion

### Status

Active - Checkpoint A complete; ready for engineering review before external ingestion.

### Previous Brick

PRD-07 Brick 1 - Signal Discovery and Decision-Ready Detail was implemented,
validated, reviewed, approved, and committed in `68a5eec`. Its completed scope
remains the working user experience for this brick.

### Outcome

Define the smallest credible source boundary for feeding operational signals
into the existing Signal System workflow. The brick must determine whether one
realistic source, beginning with CI or release-build status, can be introduced
without prematurely creating backend infrastructure, persistence, or a shared
platform contract.

### Scope

In scope:

- one source domain candidate, preferably CI or release-build status
- source provenance and signal freshness requirements
- a narrow application-owned source boundary
- a deterministic fixture adapter retained for local development
- a decision on whether a backend or HTTP boundary is actually required
- compatibility with the existing discovery, interpretation, and decision flow
- a focused validation strategy for source mapping and fallback behavior

Out of scope:

- multiple source integrations
- backend persistence or production infrastructure before approval
- event streaming, background processing, or polling orchestration
- auth, collaboration, notifications, or role systems
- analytics dashboards or generalized reporting
- new shared platform packages without demonstrated cross-application need
- enterprise features, multi-tenancy, or SaaS expansion

### Current Implementation Status

- Brick 1 provides the current application-owned signal workflow and deterministic
   fixture dataset.
- A deterministic CI fixture mapper now adds source provenance and freshness to
   the existing signal model.
- The mapper remains application-local; no backend contract, persistence layer,
   polling loop, or shared platform package was introduced.
- The existing discovery, interpretation, and human decision workflow remains
   unchanged and consumes the mapped signal records.
- Real external ingestion remains blocked on the unresolved runtime and source
   access decisions below; this brick currently proves the source mapping shape
   using deterministic fixtures only.

### Current Working Hypothesis

If the Signal System adds one narrow source boundary around CI or release-build
status, maps source records into the existing application-local signal model,
and preserves a deterministic fixture fallback, then the product can become
operationally meaningful without prematurely becoming a backend platform.

### Brick 1 Evidence Carried Forward

- `CI=1 pnpm nx test signal-system` - passed; 3 tests passed.
- `CI=1 pnpm nx build signal-system` - passed; production bundle generated.
- `pnpm exec eslint apps/signal-system/src --config eslint.config.mjs` - passed.
- `git diff --check` - passed.
- Local runtime was verified at `http://localhost:4200/` with the Signal System
   page serving the completed Brick 1 workflow.
- The project has no `signal-system:lint` Nx target and no app-local ESLint
   config; root ESLint was run directly as the equivalent source check.

### Checkpoint A: Planning and Design Readiness

- [x] One source domain is selected and justified against the current fixture:
  CI or release-build status matches the existing release failure fixture.
- [x] The source boundary is defined as application-owned unless reuse is
   demonstrated and approved.
- [x] Required provenance fields are explicit, including source identity and
   source record reference.
- [x] Freshness semantics are explicit and understandable to a human reviewer.
- [x] Source-to-signal mapping rules are deterministic and testable.
- [x] Fixture data is retained as the local development source and mapping
  failures remain testable without an external system.
- [x] External-source fallback is explicitly deferred: a future ingestion brick
   must define how the fixture view, source-unavailable state, and signal
   decisions behave; this fixture-only slice has no external source failure path.
- [x] The current brick uses an application-local adapter over fixtures; no
   backend, HTTP, file, or external runtime is required for this milestone.
- [x] No persistence, polling, event streaming, or background processing is
  included in the current implementation.
- [x] Existing AI interpretation and human decision behavior remains unchanged.
- [x] No source credentials or secrets are accepted by the browser application;
   any future external access must use a reviewed server-side boundary and must
   avoid exposing raw sensitive source content to the client.
- [x] Validation covers source mapping, provenance, freshness, and regression of
   the existing review workflow. Fixture fallback and invalid-record validation
   remain deferred until external input is implemented.
- [x] The current design does not require a new shared platform contract.

### TODOs

- [x] Select the first operational source domain.
- [x] Define the source record and provenance requirements.
- [x] Define freshness semantics for mapped fixture records.
- [x] Defer unavailable-source behavior and fixture fallback semantics to the
   external-ingestion brick; no external source exists in this milestone.
- [x] Decide that the current adapter remains application-local.
- [x] Document the backend and persistence decision: both remain deferred for
   this fixture-backed milestone.
- [x] Define and test source-to-signal mapping for valid records.
- [x] Defer invalid-record behavior and validation rules to the
   external-ingestion brick; current fixture records are typed at compile time.
- [x] Define focused test, build, lint, and runtime validation.
- [x] Validate the design against PRD-07 and architecture standards.
- [x] Request engineering review before implementing external source access or a
   new boundary.

### Review Conditions Closed

The following conditions are carried forward from Brick 1 and remain closed for
the existing user workflow:

- user and decision context are explicit
- signal model stays local and deterministic
- AI is a support layer, not the final authority
- telemetry remains in the approved browser-provided path
- no backend or persistence is required for v1

Brick 2 Checkpoint A conditions are closed for the fixture-backed source
boundary. External source access, fallback behavior, and invalid-record rules
remain outside the approved implementation scope until a future ingestion brick
defines and reviews that runtime and security boundary.

### Immediate Next Steps

1. Request Engineering Review for the completed Checkpoint A design and
   deterministic source-mapping implementation.
2. Keep signal logic and domain ownership in the app layer unless a reuse case
   is proven and reviewed.
3. Preserve the fixture and review workflow while external ingestion remains
   deferred.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
Brick 2 Checkpoint A is complete for the fixture-backed source boundary and is
ready for Engineering Review. External ingestion is not approved by this brief.
All prior historical PRD records remain available in the archive for traceability
and review context.
