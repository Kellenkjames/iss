# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 3 - Minimal CI Ingestion Boundary

### Status

Active - Checkpoint A complete for the fixture-backed API boundary; external integration remains gated.

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
- No external CI client, credential flow, persistence layer, or vendor source
   runtime exists yet; those concerns are explicitly deferred to a future
   external-integration brick.
- A minimal `apps/signal-api` project now exposes a read-only fixture-backed
   `GET /api/signals` contract on loopback.
- The API returns CI provenance and freshness while making no vendor calls,
   accepting no credentials, and writing no persistent state.
- The browser application must not call a CI vendor directly or receive source
   credentials.
- External integration remains blocked until a separate brick defines and
   reviews the vendor boundary, credentials, validation, and failure semantics.

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

### Brick 3 Implementation Evidence

- `PATH="$PWD/node_modules/.bin:$PATH" ./node_modules/.bin/nx test signal-api` -
   passed; 2 HTTP contract tests passed.
- `PATH="$PWD/node_modules/.bin:$PATH" ./node_modules/.bin/nx build signal-api` -
   passed; TypeScript server bundle generated.
- Manual HTTP verification returned `200` for `GET /api/signals` and `404` for
   an unsupported route.
- The API binds to `127.0.0.1` by default and uses `SIGNAL_API_PORT` only for
   local runtime selection.

### Checkpoint A: Planning and Design Readiness

- [x] CI or release-build status is selected as the source domain, justified by
   the existing release-build fixture.
- [x] `apps/signal-api` is required as the server-side boundary because the
   browser must not hold CI credentials or call a vendor directly.
- [x] The application-facing contract is read-only `GET /api/signals` and
   excludes writes, persistence, and signal mutation.
- [x] The fixture-backed implementation accepts no credentials and performs no
   external calls; future credential ownership and vendor failure behavior are
   explicitly deferred to a separate integration brick.
- [x] The current fixture record has explicit required fields and preserves the
   Brick 2 mapping contract; runtime validation of vendor records is deferred.
- [x] Provenance and freshness are explicit in the returned signal contract.
- [x] The current source is deterministic and available by construction; stale,
   unavailable, invalid-record, and fallback semantics for a vendor source are
   explicitly deferred.
- [x] The fixture response is bounded and testable, with no polling,
   orchestration, or background processing.
- [x] Existing AI interpretation and human decision behavior remains unchanged.
- [x] The API contains no sensitive source content or credentials and does not
   bypass the existing platform boundaries.
- [x] No new shared platform contract or dependency is required for this slice.
- [x] Contract, mapping, build, test, lint, runtime, and 404-boundary validation
   are specified and evidenced below.

### TODOs

- [x] Select the CI or release-build source domain for the fixture-backed slice.
- [x] Decide that the minimal `apps/signal-api` boundary is required for the
   server-side contract.
- [x] Define the fixture-backed server read contract and preserve the Brick 2
   application mapping contract.
- [x] Confirm that no credentials, external calls, persistence, or writes enter
   this implementation.
- [x] Define focused contract, security, mapping, and regression validation.
- [x] Validate the implemented slice against PRD-07, the repository blueprint,
   and architecture standards.
- [x] Request Engineering Review before external integration.
- [ ] Define vendor credential ownership and configuration for the future
   external-integration brick.
- [ ] Define vendor record validation and source failure semantics for the future
   external-integration brick.

### Review Conditions Closed

The following conditions are carried forward from Bricks 1 and 2 and remain
closed for the existing user workflow and fixture-backed mapping:

- user and decision context are explicit
- signal model stays local and deterministic
- AI is a support layer, not the final authority
- telemetry remains in the approved browser-provided path
- no backend or persistence is approved for the completed fixture-backed scope

Brick 3 Checkpoint A conditions are closed for the fixture-backed API boundary.
The loopback address is enforced in `apps/signal-api/src/main.ts` as
`127.0.0.1`, while only the local port is configurable. External source access,
vendor credentials, runtime integration, validation, fallback, and failure
semantics remain explicitly gated for a future reviewed brick.

### Immediate Next Steps

1. Request Engineering Review for the completed fixture-backed API boundary.
2. Keep the existing fixture-backed workflow operational while external access
   remains deferred.
3. Define the future vendor integration brick only after the required human and
   architecture decisions are available.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
Brick 3 Checkpoint A is complete for the fixture-backed API boundary and is
ready for Engineering Review. External CI ingestion is not approved by this
brief and requires a separate reviewed brick.
All prior historical PRD records remain available in the archive for traceability
and review context.
