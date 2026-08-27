# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 5 - Browser Signal Consumption and Live Interpretation Boundary

### Status

Proposed - planning and design readiness checkpoint required before browser or live-AI integration.

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

PRD-07 Brick 4 - GitHub Actions Signal Integration implemented the approved
server-side GitHub source path, was reviewed with conditions, and had its
blocking implementation findings resolved. Its API and fixture fallback remain
the source boundary for this brick.

### Outcome

Connect the browser Signal System to the existing Signal API and define the
smallest server-mediated interpretation boundary for live AI. The brick must
let the browser consume normalized signals without receiving GitHub credentials,
preserve fixture mode for local development, and route live provider execution
through a reviewed server boundary without turning the application into a
generalized AI platform.

### Scope

In scope:

- browser consumption of the existing read-only `GET /api/signals` contract
- explicit browser source-loading, empty, stale, unavailable, and retry states
- preservation of deterministic local fixture mode
- a server-mediated interpretation contract for live AI provider execution
- server-only provider credentials and sanitized interpretation responses
- compatibility with the existing signal review and human decision workflow
- focused browser/API contract, security, provider, and regression validation

Out of scope:

- additional source integrations
- writes, persistence, signal mutation, or decision submission APIs
- event streaming, background processing, scheduled polling, or orchestration
- auth, collaboration, notifications, or role systems
- analytics dashboards or generalized reporting
- new shared platform packages without demonstrated cross-application need
- autonomous AI decisions or generalized agent behavior
- enterprise features, multi-tenancy, or SaaS expansion

### Current Planning Status

- Brick 2 provides the application-local CI mapping contract, deterministic
   fixtures, provenance, and freshness metadata.
- Brick 3 provides a loopback-only, fixture-backed `GET /api/signals` server
   boundary with HTTP contract tests and no external calls.
- Brick 4 provides native server-side GitHub retrieval, validation, mapping,
   bounded retry behavior, and sanitized source errors in `apps/signal-api`.
- The browser Signal System still consumes local fixtures and uses the
   browser-safe `demo-key` provider behavior.
- No browser-to-API signal loading or server-mediated interpretation endpoint
   exists yet.
- No persistence layer, polling loop, background orchestration, or decision
   submission API is proposed for this brick.
- Implementation is blocked until this brick's browser contract, live-AI
   boundary, credential handling, fallback, and validation decisions pass
   Checkpoint A and Engineering Review.
- The Brick 5 design specification is [PRD-07 Brick 5 Browser Consumption and
   Live Interpretation Boundary](prd-07-brick-5-browser-consumption-and-live-interpretation.md).
   It records the proposed browser source contract, server-mediated
   interpretation boundary, security, fallback, and validation requirements.
- The revised proposal resolves the prior topology and contract blockers by
   selecting `apps/signal-system/proxy.conf.json` for local `/api` forwarding,
   relative `/api` requests in production, a server-owned provider path, and a
   discriminated interpretation response with fixed HTTP statuses.
- The remaining provider configuration decisions are resolved in the design:
   `ISS_AI_PROVIDER` is the server-side selection variable, `openai` is the only
   v1 value, and local missing credentials explicitly use deterministic
   `demo-key` behavior while production returns sanitized `503` unavailable.
- The Brick 4 design specification is [PRD-07 Brick 4 GitHub Actions Signal
  Integration](prd-07-brick-4-github-actions-integration.md).
- Brick 4 implementation review returned **Pass with Conditions** /
  **Approve with Changes** / **Approved with Conditions**. Code-level findings
  were resolved; live credentialed validation remains an operational follow-up.

### Current Working Hypothesis

If the browser consumes normalized signals through `GET /api/signals`, while
live interpretation uses a separate server-mediated provider boundary and the
fixture path remains available locally, then the Signal System can become a
coherent end-to-end experience without exposing source or AI credentials.

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

### Brick 4 Implementation Evidence Carried Forward

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

- [x] Browser source-loading contract is defined for `GET /api/signals`.
- [x] Fixture mode and API mode selection are explicit and deterministic.
- [x] Empty, stale, unavailable, malformed, and retryable source states are
   mapped to understandable browser states.
- [x] Browser source errors cannot mutate human decisions or silently replace
   source data with fabricated signals.
- [x] Live interpretation endpoint and request/response shape are explicit.
- [x] Provider credentials remain server-only and are never exposed to the
   browser or returned in interpretation responses.
- [x] Interpretation errors, timeout, retry, and unavailable-provider behavior
   are bounded and distinguishable from source errors.
- [x] AI output remains explanatory and secondary to human Accept, Defer, and
   Escalate decisions.
- [x] Existing demo-provider behavior remains available without credentials.
- [x] Telemetry and raw prompt/response handling remain within approved
   boundaries and exclude sensitive content.
- [x] No persistence, writes, decision mutation, polling, orchestration, or
   new shared platform contract is required.
- [x] Browser/API, interpretation, security, failure-path, build, lint, test,
   and runtime validation are specified.

### TODOs

- [x] Define the documented browser `GET /api/signals` consumption contract.
- [x] Define documented API-mode, fixture-mode, and local fallback selection.
- [x] Define documented browser source loading, empty, stale, unavailable, and
   retry states.
- [x] Define the documented server-mediated interpretation contract.
- [x] Define documented provider credential ownership and server-only
   configuration.
- [x] Define documented interpretation timeout, retry, unavailable, and
   sanitized error behavior.
- [x] Define documented prompt and response filtering for telemetry and browser
   output.
- [x] Confirm human decision behavior remains application-local and unchanged.
- [x] Define focused browser/API, provider, security, and regression validation.
- [x] Validate the design proposal against PRD-07 and architecture standards.
- [ ] Request Engineering Review before implementing browser/API or live-AI
   integration.

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
and the approved server integration is implemented. Its code-level review
conditions are closed; deployment credentials and live GitHub validation remain
operational follow-up.

Brick 5 is not yet approved for implementation. Browser-to-API signal access,
server-mediated live AI inference, and any additional source scope remain gated
behind this brick's Checkpoint A and Engineering Review.

The Brick 5 design proposal is complete, including the local proxy topology,
server-provider ownership migration, signal-keyed decision state, and
discriminated interpretation response. It is ready for human technical-lead
approval and Engineering Review. No implementation authorization is implied by
the proposal.

### Immediate Next Steps

1. Obtain human technical-lead approval for the Brick 5 design proposal.
2. Request Engineering Review before implementing browser/API or live-AI
   integration.
3. Keep the fixture-backed API, browser workflow, and demo provider operational
   during design.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
PRD-07 Brick 3 is complete for the reviewed fixture-backed API boundary. Brick 4
has implemented the approved GitHub server integration and completed its
code-level review. Brick 5 has a complete design proposal and remains in
planning and design readiness; browser source consumption and live AI inference
are not approved until human approval and Engineering Review are complete.
All prior historical PRD records remain available in the archive for traceability
and review context.
