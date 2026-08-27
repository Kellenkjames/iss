# PRD-07 Brick 5: Browser Consumption and Live Interpretation Boundary

## Status

Design proposal revised to address the initial review findings. Human technical-
lead approval and Engineering Review are still required before implementation.

## Decision Summary

- Signal source: browser reads normalized signals from `GET /api/signals`.
- Local mode: deterministic `signalRecords` remains the default when API mode
  is not selected.
- API mode: the browser uses relative `/api` requests through the same-origin
  development proxy and one-origin deployment; it does not construct GitHub
  requests or receive source credentials.
- Local topology: Angular development uses a same-origin `/api` proxy to the
  loopback Signal API. The browser does not call port `4300` directly and no
  broad CORS policy is introduced.
- Proxy wiring: add `apps/signal-system/proxy.conf.json` with `/api` forwarding
  to `http://127.0.0.1:4300`, and add that file to the development serve target.
  Production uses relative `/api` requests behind one origin; no browser API
  base URL is required for v1.
- Interpretation: browser sends a minimal review request to
  `POST /api/interpretations`; the server owns provider execution.
- Credentials: provider credentials remain server-only. The browser receives
  only sanitized provider status and interpretation content.
- Business persistence: none. Signal selections, interpretations, and decisions
  remain in memory for this brick. Existing approved browser telemetry may
  continue its local `localStorage` behavior; that telemetry storage is not
  business-state persistence.
- Human authority: Accept, Defer, and Escalate remain local human actions and
  are never submitted as automated decisions.

## Browser Signal Contract

`GET /api/signals` remains the only source-read request:

```text
GET /api/signals
```

The response is the existing normalized shape:

```typescript
{
  source: 'github-actions' | 'fixture' | 'empty' | 'unavailable';
  signals: SignalRecord[];
}
```

The browser must ignore unknown fields and must not expose raw GitHub payloads.
No repository, token, vendor endpoint, or source query parameters are accepted
from the browser.

`source` is the only source-state field and `signals` is always an array. Each
signal uses the existing `SignalRecord` contract. `evidence` is the canonical
signal content field; the browser does not introduce a separate `context`
signal field.

## Source Mode and Failure Behavior

- When API mode is not selected, use deterministic local fixtures.
- In development, the configured proxy selects API mode; in production,
  relative `/api` requests are always API mode. No runtime browser base URL is
  exposed in v1.
- A successful `github-actions` response replaces the displayed source list.
- An `empty` response displays an explicit empty state and no fabricated signal.
- A `503` or `source: unavailable` response preserves the last successful source
  view when one exists and shows a retryable, non-actionable source status.
- A malformed response is rejected and shows a retryable source error; it must
  not partially replace the displayed list.
- A stale signal remains visible with its freshness metadata; the browser does
  not silently discard it or promote it to current.
- Retrying is user-initiated. No polling or background refresh is introduced.
- Source loading and errors must not clear or mutate a recorded human decision.
- When an API response replaces fixtures, preserve the selected signal by
  matching its stable `id`; clear selection only when that ID is absent.
- A source refresh never carries a prior decision to a different signal. A
  decision is stored as `{ signalId, decision }` in memory and remains attached
  to that signal ID.

## Interpretation Contract

The browser may send a focused request after a user selects a signal and chooses
Interpret signal:

```text
POST /api/interpretations
Content-Type: application/json

{
  "subject": "Release build failure",
  "evidence": "The build exited with an error...",
  "question": "What should we inspect next?"
}
```

The server validates a JSON object with only these string fields: `subject`
(required, 1-200 characters), `evidence` (required, 1-4000 characters), and
`question` (optional, at most 1000 characters). Unknown fields are ignored and
the total UTF-8 request body is limited to 6 KB. The server passes only these
approved fields to its prompt builder and shared AI Provider boundary. The
response is the following discriminated union with fixed HTTP statuses:

```typescript
type InterpretationResponse =
  | {
      success: true;
      provider: string;
      model: string;
      interpretation: string;
    }
  | {
      success: false;
      error: {
        code: 'invalid_request' | 'unavailable' | 'unauthorized' | 'malformed';
        message: string;
      };
    };
```

Successful `interpretation` content is limited to 8000 characters. `provider`
and `model` are returned only on successful responses. Error messages are fixed,
sanitized categories and never contain credentials, authorization headers, raw
provider responses, or provider implementation details.

## Provider Runtime

- `apps/signal-api` owns live provider execution.
- The implementation removes the browser call to `interpretSignal` and the
  browser `createProviderFactory` path for API mode. The browser retains only
  an API client and the existing deterministic demo path when API mode is not
  selected.
- Provider configuration is read from server runtime environment only.
- `OPENAI_API_KEY`, `OPENAI_MODEL`, and provider selection are read from server
  runtime configuration only. They are never accepted from browser request
  bodies or query parameters. `ISS_AI_*` remains a browser-demo-only
  configuration concern.
- Local development without a live provider credential returns deterministic
  demo output from the existing provider boundary. Production without a
  provider credential returns sanitized `503` unavailable behavior.
- The AI response remains explanatory evidence. It cannot accept, defer,
  escalate, mutate, persist, or submit a signal decision.

## Interpretation Failure Behavior

- Malformed JSON, oversized bodies, unknown required values, or missing fields:
  `400` with `{ code: "invalid_request", message: "Interpretation request is invalid." }`.
- Provider configuration missing in production: `503` with `unavailable`.
- Provider timeout or transient failure: one bounded retry within a total
  five-second provider budget, then `503` with `{ code: "unavailable", ... }`.
- Provider unauthorized failure: `502` with `unauthorized` and no credential
  details.
- Malformed provider response: `502` with sanitized error and no partial result.
- Successful provider response: `200` with normalized interpretation content.

Interpretation failures are distinct from source failures and do not mutate the
source list or human decision state.

## Security and Telemetry

- Browser requests contain only subject, evidence, and optional question.
- Server logs and telemetry contain outcome, provider, model, timing, and safe
  error category only.
- Raw prompts, raw provider responses, authorization headers, source tokens,
  GitHub logs, and sensitive source content are excluded from telemetry.
- CORS is not broadened for this brick. Local development uses the Angular
  same-origin `/api` proxy declared in `apps/signal-system/proxy.conf.json` to
  `127.0.0.1:4300`, and deployed browser/API traffic uses one origin.
- No new shared platform package is required. Provider and telemetry behavior
  continues through existing approved boundaries.
- Business state is in memory only. Existing approved telemetry may write its
  filtered invocation evidence to browser `localStorage`; prompts, provider
  responses, credentials, and signal decisions are not written there.

## Validation Plan

Before implementation review, tests must cover:

- local fixture mode remains available
- API signal loading replaces fixtures on a successful normalized response
- empty, unavailable, stale, malformed, and retryable source states
- last successful source view is preserved on source failure
- source errors do not mutate human decisions
- interpretation request validation and bounded body size
- same-origin proxy behavior in local development
- successful server-mediated interpretation mapping
- missing provider configuration and sanitized provider errors
- provider timeout, transient retry, unauthorized, malformed, and success paths
- absence of credentials, raw prompts, and raw provider responses in browser
  payloads, logs, and telemetry
- regression of existing discovery, evidence, interpretation, and human
  Accept/Defer/Escalate behavior

The implementation must pass repository lint, test, build, and diff checks. A
separate Engineering Review is required before merging browser/API wiring or
live provider execution.

## Human Decisions Required

The following decisions are now concrete proposals for approval before
implementation:

- Use an Angular same-origin `/api` proxy locally and one origin in deployment;
  do not broaden CORS or make the API base URL browser-configurable for v1.
- Use the exact `POST /api/interpretations` request and response shapes above,
  with `evidence` as the canonical field and sanitized error objects.
- Use server-side `ISS_AI_PROVIDER` with `openai` as the only v1 value,
  `OPENAI_API_KEY`, and `OPENAI_MODEL` for live execution; retain deterministic
  `demo-key` output only when local credentials are absent.
- Enforce a 6 KB request body limit, an 8000-character interpretation limit,
  and a total five-second provider budget with one retry.
- Deliver browser source consumption and server-mediated interpretation as one
  implementation slice; keep business state in memory and existing filtered
  telemetry storage unchanged.
