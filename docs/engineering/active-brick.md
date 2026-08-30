# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 5 - Browser Signal Consumption and Live Interpretation Boundary

### Status

Approved with Conditions - browser/API integration implemented, validated, and reviewed for the approved scope; operational validation evidence is captured for the local demo and server-side contract paths, while live credentialed provider validation and deployed one-origin validation remain the remaining follow-up before broader production use.

### Operational Validation Evidence

Current evidence collected against the approved scope:

- `pnpm nx test shell --watch=false` -> 4 test files passed, 13 tests passed.
- `pnpm nx test signal-api --watch=false` -> 1 test file passed, 19 tests passed.
- Live contract validation against the current local server returned `200` for `GET /api/signals` and `200` for `POST /api/interpretations`.
- The interpretation response shape included the expected `success`, `provider`, `model`, and `interpretation` fields in the current local server mode.

This evidence supports the current implementation claim without implying live provider credential validation or deployed one-origin production readiness.

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
- The browser Signal System consumes normalized API signals when available and
   preserves local fixtures as its fallback.
- The server-mediated `POST /api/interpretations` endpoint is implemented with
   bounded input, sanitized errors, and local demo-provider behavior.
- No persistence layer, polling loop, background orchestration, or decision
   submission API is proposed for this brick.
- Browser integration uses the same-origin `/api` proxy; the browser does not
   call GitHub or receive provider credentials.
- The Brick 5 design specification is [PRD-07 Brick 5 Browser Consumption and
   Live Interpretation Boundary](archive/engineering-bricks/EB-026-PRD-07-BRICK-5-BROWSER-CONSUMPTION-AND-LIVE-INTERPRETATION.md).
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

### Brick 5 Implementation Evidence

- Signal API tests: 19 passed.
- Signal API lint and production build: passed.
- Signal System tests: 4 passed.
- Signal System lint and production build: passed with the Angular proxy
   configuration present.
- The browser source client validates normalized API responses and preserves
   fixtures when API mode is unavailable.
- The interpretation endpoint validates request size and fields, preserves the
   discriminated response shape, and uses server-side provider execution.
- Live credentialed AI validation and deployed one-origin validation remain
   operational follow-ups.
- The Brick 4 design specification is [PRD-07 Brick 4 GitHub Actions Signal
   Integration](archive/engineering-bricks/EB-025-PRD-07-BRICK-4-GITHUB-ACTIONS-INTEGRATION.md).
- Brick 4 implementation review returned **Pass with Conditions** /
  **Approve with Changes** / **Approved with Conditions**. Code-level findings
  were resolved; live credentialed validation remains an operational follow-up.

### Current Working Hypothesis

If the browser consumes normalized signals through `GET /api/signals`, while
live interpretation uses a separate server-mediated provider boundary and the
fixture path remains available locally, then the Signal System can become a
coherent end-to-end experience without exposing source or AI credentials.

### Archived Evidence

Detailed checkpoint history, prior brick evidence, and design-gate material are
archived for traceability:

- [Archived Engineering Bricks Index](archive/engineering-bricks/README.md)
- [EB-025 PRD-07 Brick 4 GitHub Actions Integration](archive/engineering-bricks/EB-025-PRD-07-BRICK-4-GITHUB-ACTIONS-INTEGRATION.md)
- [EB-026 PRD-07 Brick 5 Browser Consumption and Live Interpretation](archive/engineering-bricks/EB-026-PRD-07-BRICK-5-BROWSER-CONSUMPTION-AND-LIVE-INTERPRETATION.md)
- [Historical PRD-05 and PRD-06 Summary](archive/prd-05-prd-06-historical-bricks.md)

### Immediate Next Steps

1. Keep the fixture-backed API and demo provider available for local fallback.
2. Complete live credentialed provider validation outside demo mode.
3. Complete deployed one-origin validation before broader production use.
4. Continue to keep historical PRD artifacts archived instead of carrying them
   in the active brief.
