# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 2 - Signal Source Boundary and Operational Ingestion

### Status

Proposed - planning and design readiness checkpoint required before implementation.

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
- The existing signal model includes subject, evidence, status, owner, and
   confidence, but does not yet include source provenance or freshness.
- No source adapter, backend contract, persistence layer, or ingestion
   abstraction has been proposed or implemented for Brick 2.
- The next implementation decision is intentionally blocked on source-boundary
   and runtime-shape approval.

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

- [ ] One source domain is selected and justified against the current fixture.
- [ ] The source boundary is defined as application-owned unless reuse is
   demonstrated and approved.
- [ ] Required provenance fields are explicit, including source identity and
   source record reference.
- [ ] Freshness semantics are explicit and understandable to a human reviewer.
- [ ] Source-to-signal mapping rules are deterministic and testable.
- [ ] Fixture fallback behavior is defined for local development and failure
   states.
- [ ] Backend, HTTP, file, or adapter shape is selected only if required by the
   chosen source.
- [ ] No persistence, polling, event streaming, or background processing is
   included without explicit approval.
- [ ] Existing AI interpretation and human decision behavior remains unchanged.
- [ ] Security, secret handling, and sensitive-source data constraints are
   documented.
- [ ] Validation covers source mapping, provenance, freshness, fallback, and
   regression of the existing review workflow.
- [ ] The design does not require a new shared platform contract.

### Proposed TODOs

- [ ] Select the first operational source domain.
- [ ] Define the source record and provenance requirements.
- [ ] Define freshness and unavailable-source behavior.
- [ ] Decide whether the source can remain fixture-backed for this brick.
- [ ] Decide whether an application-local adapter is sufficient.
- [ ] Document the backend and persistence decision.
- [ ] Define source-to-signal mapping and invalid-record behavior.
- [ ] Define focused test, build, lint, and runtime validation.
- [ ] Validate the design against PRD-07 and architecture standards.
- [ ] Request engineering review before implementing a new boundary.

### Review Conditions Closed

The following conditions are carried forward from Brick 1 and remain closed for
the existing user workflow:

- user and decision context are explicit
- signal model stays local and deterministic
- AI is a support layer, not the final authority
- telemetry remains in the approved browser-provided path
- no backend or persistence is required for v1

Brick 2 review conditions are not yet closed. The source, boundary, runtime
shape, provenance, and freshness decisions require explicit approval before
implementation.

### Immediate Next Steps

1. Complete Checkpoint A for Brick 2, beginning with the CI or release-build
   source decision.
2. Keep signal logic and domain ownership in the app layer unless a reuse case
   is proven and reviewed.
3. Preserve the Brick 1 fixture and review workflow while evaluating ingestion.
4. Request engineering review before implementing any new source or boundary.
5. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
Brick 2 is in planning and design readiness. Implementation is not approved
until the source boundary and runtime decisions are closed through Checkpoint A.
All prior historical PRD records remain available in the archive for traceability
and review context.
