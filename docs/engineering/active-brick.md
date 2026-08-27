# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 4 - GitHub Actions Signal Integration

### Status

Active - GitHub server integration implemented; implementation review required before closure.

### Previous Bricks

PRD-07 Brick 1 - Signal Discovery and Decision-Ready Detail was implemented,
validated, reviewed, approved, and committed in `68a5eec`. Its completed scope
remains the working user experience for this brick.

PRD-07 Brick 2 - Signal Source Boundary and Operational Ingestion established
the fixture-backed CI mapping shape, was reviewed and approved for Checkpoint A,
and was committed in `af32008`. Its deterministic mapper and signal metadata
remain the application contract for this brick.

PRD-07 Brick 3 - Minimal CI Ingestion Boundary established the fixture-backed
server read boundary, was reviewed with conditions, had its documentation
follow-up completed, and was committed in `f7ccc71`. Its read-only API contract
remains the server boundary for this brick.

### Outcome

Connect the existing Signal API to one real CI source: GitHub Actions workflow
runs for the repository. The brick must retrieve only the information required
to produce the existing signal contract, keep credentials server-side, validate
vendor responses, and preserve deterministic fixture fallback without turning
the API into a generalized integration platform.

### Scope

In scope:

- one read-only GitHub Actions workflow-run integration
- server-side credential configuration and access in `apps/signal-api`
- explicit vendor-to-signal mapping and response validation
- freshness, unavailable-source, invalid-record, and fixture-fallback behavior
- compatibility with the existing `GET /api/signals` contract and Signal System
  workflow
- focused contract, security, mapping, and failure-path validation

Out of scope:

- multiple vendor or CI integrations
- write endpoints, persistence, or signal mutation APIs
- event streaming, background processing, scheduled polling, or orchestration
- auth, collaboration, notifications, or role systems
- analytics dashboards or generalized reporting
- new shared platform packages without demonstrated cross-application need
- enterprise features, multi-tenancy, or SaaS expansion

### Current Planning Status

- Brick 2 provides the application-local CI mapping contract, deterministic
   fixtures, provenance, and freshness metadata.
- Brick 3 provides a loopback-only, fixture-backed `GET /api/signals` server
   boundary with HTTP contract tests and no external calls.
- Native server-side `fetch`, GitHub response validation, latest-run mapping,
  bounded retry behavior, and sanitized error handling are implemented in
  `apps/signal-api`.
- No persistence layer, polling loop, or background orchestration exists.
- The browser application must not call GitHub directly or receive GitHub
   credentials.
- The browser Signal System remains on its local fixture path; browser-to-API
   integration is not included in this implementation slice.
- The proposed design specification is [PRD-07 Brick 4 GitHub Actions Signal
   Integration](prd-07-brick-4-github-actions-integration.md). It records the
   approved REST endpoint, server-only token, mapping, validation, fallback,
   timeout, retry, and telemetry decisions.
- The human technical lead approved the documented design decisions on
   2026-08-26, including the lean native-`fetch` implementation approach.
- Engineering Review approved the design with **Pass** / **Approve** /
   **Approved**, authorizing implementation within the documented scope.

### Current Working Hypothesis

If `apps/signal-api` retrieves one GitHub Actions workflow-run result through a
server-side credential boundary, validates and maps it into the existing signal
contract, and falls back deterministically when GitHub is unavailable, then the
Signal System can use a credible operational source without exposing credentials
or creating a generalized backend platform.

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
- Application READMEs document the server and browser boundaries, contracts,
   usage, validation, and known limitations.
- Brick 3 Engineering Review result: **Pass with Conditions**; recommendation:
   **Approve with Changes**; status: **Approved with Conditions**.
- The review condition was non-blocking documentation discoverability; the
   requested READMEs are now present and Brick 3 advanced.

### Brick 4 Implementation Evidence

- `./node_modules/.bin/nx test signal-api` - passed; 15 tests passed.
- `./node_modules/.bin/nx build signal-api` - passed after GitHub integration.
- `./node_modules/.bin/nx lint signal-api` - passed.
- Tests cover GitHub latest-run mapping, status/confidence/freshness,
   provenance, unauthorized and forbidden responses, malformed records,
   production missing configuration, local fixture mode, empty responses,
   transient server and network retries, bounded `Retry-After` handling,
   invalid repository configuration, stale freshness, response-body timeout,
   and the 404 boundary.
- GitHub credentials are never accepted from request parameters or returned in
   API payloads.

### Checkpoint A: Planning and Design Readiness

- [x] GitHub Actions workflow runs are confirmed as the single source domain and
  the minimum useful fields are justified.
- [x] The browser-to-API contract is confirmed as read-only `GET /api/signals`.
- [x] GitHub credential ownership, storage, rotation, and runtime access are
  defined without exposing secrets to the browser.
- [x] The server-to-GitHub request and response contract is explicit and bounded.
- [x] Required vendor fields and runtime validation rules are defined.
- [x] Vendor states map deterministically to the existing signal status,
  confidence, provenance, and freshness fields.
- [x] Unavailable, unauthorized, rate-limited, stale, malformed, and empty
  responses have explicit non-destructive behavior.
- [x] Fixture fallback behavior is explicit, bounded, and testable.
- [x] Timeout and retry behavior is defined without polling or orchestration.
- [x] Existing AI interpretation and human decision behavior remains unchanged.
- [x] Vendor payload and telemetry handling exclude secrets and unnecessary raw
  source content.
- [x] No persistence, writes, new shared platform package, or unrelated
  integration is required.
- [x] Contract, security, mapping, failure-path, build, lint, test, and runtime
  validation are specified.

### TODOs

- [x] Confirm GitHub Actions as the only vendor source for this brick.
- [x] Define the approved minimum GitHub workflow-run request and response
   fields in the design specification.
- [x] Define the approved server-side GitHub credential ownership and
   configuration in the design specification.
- [x] Define approved runtime validation and vendor-to-signal mapping rules.
- [x] Define approved freshness and status mapping semantics.
- [x] Define approved unavailable, unauthorized, rate-limited, stale,
   malformed, and empty-response behavior.
- [x] Define approved deterministic fixture fallback and non-destructive state
   handling.
- [x] Define approved bounded timeout and retry behavior.
- [x] Define focused contract, security, mapping, and regression validation.
- [x] Validate the proposed design against PRD-07, the repository blueprint,
   and architecture standards.
- [x] Request Engineering Review before adding vendor integration code.

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
`127.0.0.1`, while only the local port is configurable. GitHub source access,
vendor credentials, runtime integration, validation, fallback, and failure
semantics remain explicitly gated for this brick's Checkpoint A and Engineering
Review.

Brick 4 design decisions are documented and human-approved in
[prd-07-brick-4-github-actions-integration.md](prd-07-brick-4-github-actions-integration.md)
and the approved server integration is now implemented. The browser integration
and additional source scope remain gated behind a separate reviewed decision.

### Immediate Next Steps

1. Request Engineering Review for the completed GitHub server integration.
2. Keep the fixture-backed API and browser workflow operational as the local
   fallback path.
3. Do not add browser-to-API wiring or expand the GitHub source scope without a
   separate reviewed implementation decision.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
PRD-07 Brick 3 is complete for the reviewed fixture-backed API boundary. Brick 4
has implemented the approved GitHub server integration and is ready for its
implementation review. Browser integration and additional sources remain gated.
All prior historical PRD records remain available in the archive for traceability
and review context.
