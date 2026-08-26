# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 4 - GitHub Actions Signal Integration

### Status

Proposed - planning and design readiness checkpoint required before external integration.

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
- No GitHub client, credential flow, vendor response validator, persistence
   layer, polling loop, or external runtime integration exists yet.
- The browser application must not call GitHub directly or receive GitHub
   credentials.
- Implementation is blocked until this brick's source, credential, runtime,
   failure, and validation decisions pass Checkpoint A and Engineering Review.

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

### Checkpoint A: Planning and Design Readiness

- [ ] GitHub Actions workflow runs are confirmed as the single source domain and
  the minimum useful fields are justified.
- [ ] The browser-to-API contract is confirmed as read-only `GET /api/signals`.
- [ ] GitHub credential ownership, storage, rotation, and runtime access are
  defined without exposing secrets to the browser.
- [ ] The server-to-GitHub request and response contract is explicit and bounded.
- [ ] Required vendor fields and runtime validation rules are defined.
- [ ] Vendor states map deterministically to the existing signal status,
  confidence, provenance, and freshness fields.
- [ ] Unavailable, unauthorized, rate-limited, stale, malformed, and empty
  responses have explicit non-destructive behavior.
- [ ] Fixture fallback behavior is explicit, bounded, and testable.
- [ ] Timeout and retry behavior is defined without polling or orchestration.
- [ ] Existing AI interpretation and human decision behavior remains unchanged.
- [ ] Vendor payload and telemetry handling exclude secrets and unnecessary raw
  source content.
- [ ] No persistence, writes, new shared platform package, or unrelated
  integration is required.
- [ ] Contract, security, mapping, failure-path, build, lint, test, and runtime
  validation are specified.

### TODOs

- [ ] Confirm GitHub Actions as the only vendor source for this brick.
- [ ] Define the minimum GitHub workflow-run request and response fields.
- [ ] Define server-side GitHub credential ownership and configuration.
- [ ] Define runtime validation and vendor-to-signal mapping rules.
- [ ] Define freshness and status mapping semantics.
- [ ] Define unavailable, unauthorized, rate-limited, stale, malformed, and
  empty-response behavior.
- [ ] Define deterministic fixture fallback and non-destructive state handling.
- [ ] Define bounded timeout and retry behavior.
- [ ] Define focused contract, security, mapping, and regression validation.
- [ ] Validate the design against PRD-07, the repository blueprint, and
  architecture standards.
- [ ] Request Engineering Review before adding vendor integration code.

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

The next integration brick has not yet completed its design checkpoint.

### Immediate Next Steps

1. Complete Checkpoint A for the GitHub Actions integration boundary.
2. Request Engineering Review before adding GitHub client or credential code.
3. Keep the existing fixture-backed API and browser workflow operational during
   design and review.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
PRD-07 Brick 3 is complete for the reviewed fixture-backed API boundary. Brick 4
is in planning and design readiness; GitHub Actions ingestion is not approved
until its Checkpoint A and Engineering Review gates are complete.
All prior historical PRD records remain available in the archive for traceability
and review context.
