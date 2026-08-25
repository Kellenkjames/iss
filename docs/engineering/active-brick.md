# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 3 - Minimal CI Ingestion Boundary

### Status

Proposed - planning and design readiness checkpoint required before implementation.

### Previous Bricks

PRD-07 Brick 1 - Signal Discovery and Decision-Ready Detail was implemented,
validated, reviewed, approved, and committed in `68a5eec`. Its completed scope
remains the working user experience for this brick.

PRD-07 Brick 2 - Signal Source Boundary and Operational Ingestion established
the fixture-backed CI mapping shape, was reviewed and approved for Checkpoint A,
and was committed in `af32008`. Its deterministic mapper and signal metadata
remain the application contract for this brick.

### Outcome

Define the smallest secure server-side boundary for obtaining one CI or
release-build signal and returning it to the existing Signal System workflow.
The brick must establish whether a minimal `apps/signal-api` application is
required, what its read-only contract is, and how credentials, validation,
freshness, fallback, and errors are handled without turning the API into a
generalized backend.

### Scope

In scope:

- one read-only CI or release-build source integration
- a minimal server-side `apps/signal-api` boundary if required
- a stable application-facing read contract for mapped signals
- server-side credential handling and source response validation
- explicit freshness, unavailable-source, invalid-record, and fallback behavior
- deterministic fixture fallback for local development and unavailable-source
   scenarios
- compatibility with the existing discovery, interpretation, and human decision
   flow
- focused contract, mapping, security, and failure-path validation

Out of scope:

- multiple source integrations
- persistence, write endpoints, or signal mutation APIs
- event streaming, background processing, scheduled polling, or orchestration
- auth, collaboration, notifications, or role systems
- analytics dashboards or generalized reporting
- new shared platform packages without demonstrated cross-application need
- enterprise features, multi-tenancy, or SaaS expansion

### Current Planning Status

- Brick 2 provides the application-local CI mapping contract, deterministic
  fixtures, provenance, and freshness metadata.
- No `apps/signal-api` project, external CI client, backend contract, credential
  flow, persistence layer, or source runtime exists yet.
- The browser application must not call a CI vendor directly or receive source
  credentials.
- Implementation is blocked until the server boundary and source contract pass
  this brick's Checkpoint A and engineering review.

### Current Working Hypothesis

If a minimal server-side read boundary retrieves one CI or release-build record,
validates and maps it into the existing application-local signal model, and
falls back deterministically when the source is unavailable, then the Signal
System can use a credible operational source without exposing credentials or
creating a generalized backend platform.

### Prior Evidence Carried Forward

- `CI=1 pnpm nx test signal-system` - passed; 3 tests passed.
- `CI=1 pnpm nx build signal-system` - passed; production bundle generated.
- `pnpm exec eslint apps/signal-system/src --config eslint.config.mjs` - passed.
- `git diff --check` - passed.
- Local runtime was verified at `http://localhost:4200/` with the Signal System
   page serving the completed Brick 1 workflow.
- The project has no `signal-system:lint` Nx target and no app-local ESLint
   config; root ESLint was run directly as the equivalent source check.

### Checkpoint A: Planning and Design Readiness

- [ ] The first CI or release-build source is selected and its read-only value
   is justified.
- [ ] The need for `apps/signal-api` is documented against browser security and
   the repository blueprint.
- [ ] The application-facing read contract is explicit and excludes writes,
   persistence, and signal mutation.
- [ ] Server-side credential ownership, configuration, and failure behavior are
   defined without exposing secrets to the browser.
- [ ] External records have explicit required fields and runtime validation rules.
- [ ] Source-to-signal mapping preserves the Brick 2 contract deterministically.
- [ ] Freshness, stale data, unavailable-source, and invalid-record semantics are
   explicit and user-understandable.
- [ ] Fixture fallback behavior is explicit, bounded, and testable.
- [ ] Timeout, authentication failure, malformed response, and retry behavior
   are defined without introducing polling or orchestration.
- [ ] Existing AI interpretation and human decision behavior remains unchanged.
- [ ] Telemetry and sensitive-content handling follow existing platform
   boundaries.
- [ ] No new shared platform contract or dependency is required without review.
- [ ] Contract, security, mapping, failure-path, build, lint, test, and runtime
   validation are specified.

### TODOs

- [ ] Select the concrete CI or release-build source.
- [ ] Decide whether the minimal `apps/signal-api` boundary is required.
- [ ] Define the server-to-source and browser-to-API read contracts.
- [ ] Define credential, configuration, and secret-handling rules.
- [ ] Define external record validation and source-to-signal mapping.
- [ ] Define freshness, stale, unavailable, invalid, and fallback states.
- [ ] Define timeout, authentication failure, and retry behavior.
- [ ] Confirm no writes, persistence, polling, or background processing enter
   this brick.
- [ ] Define focused contract, security, mapping, and regression validation.
- [ ] Validate the design against PRD-07, the repository blueprint, and
   architecture standards.
- [ ] Request Engineering Review before scaffolding `apps/signal-api` or adding
   external integration code.

### Review Conditions Closed

The following conditions are carried forward from Bricks 1 and 2 and remain
closed for the existing user workflow and fixture-backed mapping:

- user and decision context are explicit
- signal model stays local and deterministic
- AI is a support layer, not the final authority
- telemetry remains in the approved browser-provided path
- no backend or persistence is approved for the completed fixture-backed scope

Brick 3 review conditions are not yet closed. External source access, server
runtime, credential handling, validation, fallback, and failure semantics require
explicit approval before implementation.

### Immediate Next Steps

1. Complete Brick 3 Checkpoint A for the minimal server-side CI read boundary.
2. Keep the existing fixture-backed workflow operational while external access
   remains deferred.
3. Request Engineering Review before scaffolding `apps/signal-api` or adding
   external source access.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
Brick 3 is in planning and design readiness. External CI ingestion is not
approved until its server boundary and security decisions pass Checkpoint A and
Engineering Review.
All prior historical PRD records remain available in the archive for traceability
and review context.
