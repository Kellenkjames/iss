# PRD-07 Brick 4: GitHub Actions Signal Integration

## Status

Proposed design for human and Engineering Reviewer approval. This document
formalizes the boundary before vendor integration code is introduced.

## Decision Summary

- Source: GitHub Actions workflow runs for the ISS repository.
- Access: GitHub REST API, read-only, using the workflow-runs endpoint.
- Runtime: server-side `apps/signal-api`; the browser never calls GitHub.
- Credential: `GITHUB_TOKEN` supplied to the server runtime by deployment
  configuration. The application does not create, persist, print, or rotate it.
- Browser contract: preserve `GET /api/signals` and its existing signal shape.
- Local development: fixture mode remains the default when no GitHub token and
  repository configuration are present.
- Persistence: none. Each request retrieves or derives the current response.
- Polling and background processing: none.

## Source Request

The server may request the latest workflow runs for one configured repository:

```text
GET /repos/{owner}/{repo}/actions/runs?per_page=10
Authorization: Bearer <server-only token>
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28
```

The owner and repository are server runtime configuration. They are not
accepted from the browser request. The first implementation should use one
repository and one read-only source; selecting multiple repositories is out of
scope.

## Minimum Vendor Fields

Each returned workflow run must provide:

- `id`: numeric source record identity
- `name`: workflow name
- `status`: `queued`, `in_progress`, or `completed`
- `conclusion`: nullable until completed; expected values include `success`,
  `failure`, `cancelled`, `timed_out`, or `neutral`
- `created_at`: ISO 8601 creation timestamp
- `updated_at`: ISO 8601 update timestamp
- `html_url`: source reference for operator inspection

The integration must not request workflow logs, secrets, repository contents,
actor identity, commit messages, or other unnecessary payloads.

## Mapping Rules

The adapter maps one selected workflow run into the existing Signal contract.
The first implementation selects the most recently updated run from the bounded
response.

| GitHub run | Signal field |
|---|---|
| `id` | `source.recordId` as a string with `github-actions:` prefix |
| configured repository | `source.system` remains `CI`; repository is included in evidence |
| `name` | `title` |
| `status` and `conclusion` | `status` |
| `updated_at` | `source.observedAt` |
| run age | `source.freshness` |
| completed failure/cancellation/timeout | `Blocked` |
| completed success | `Open` |
| queued or in-progress | `Review` |
| completed failure or non-success conclusion | `High` confidence |
| in-progress or successful run | `Medium` confidence |

Freshness is calculated from `updated_at` at response time:

- less than one hour old: `Current`
- one to twenty-four hours old: `Stale`
- more than twenty-four hours old or an invalid timestamp: `Unknown`

The adapter must preserve the source URL in the evidence text without storing
raw logs or secret-bearing content.

## Runtime Validation

The server validates the response before mapping it:

- top-level response is an object with a `workflow_runs` array
- each selected run is an object
- `id` is a positive number
- `name` is a non-empty string
- `status` is one of the allowed values
- a completed run has a recognized or explicitly handled nullable conclusion
- `created_at`, `updated_at`, and `html_url` are non-empty strings
- timestamps parse as valid ISO 8601 dates
- `html_url` is an HTTPS GitHub URL

Invalid records are rejected without partial signal mutation. If no valid run
remains, the server uses the unavailable-source behavior below.

## Failure and Fallback Behavior

The API must distinguish source failures from interpretation failures. Responses
are non-destructive and never mutate a previously recorded human decision.

| Condition | API behavior |
|---|---|
| missing token/configuration in local development | serve deterministic fixtures with `source: fixture` |
| missing token in a deployed environment | return `503` with a sanitized configuration error |
| timeout or network failure | retry once, then return `503` with `source: unavailable`; retain fixture fallback only in local fixture mode |
| GitHub `401` or `403` | do not retry; return sanitized `502`/`503` source error; never expose token details |
| GitHub `429` | honor `Retry-After` when bounded; retry once, then return `503` |
| GitHub `5xx` | retry once with bounded backoff, then return `503` |
| malformed response or invalid records | return sanitized `502`; do not partially map records |
| empty `workflow_runs` | return `200` with an empty signal list and source status `empty`; do not invent a signal |
| valid stale run | return `200` and mark freshness `Stale` |

Fixture fallback is an explicit local-development mode, not an automatic
production substitute for unavailable GitHub data. The browser receives only
sanitized error/status information and never receives credentials or raw vendor
payloads.

## Timeout, Retry, and Rate Limits

- Per-request timeout: 5 seconds.
- Retry count: one retry for network errors, `429`, and `5xx` responses.
- Backoff: bounded 250 milliseconds before the single retry.
- No polling, queue, scheduled refresh, or circuit breaker is introduced.
- `Retry-After` is honored only when it is a valid value no greater than the
  5-second request budget; otherwise the fixed 250-millisecond delay applies.

## Credential and Secret Handling

- `GITHUB_TOKEN` is read only by the server runtime.
- The token is supplied by deployment or local process environment and is not
  committed, accepted from request parameters, returned in JSON, or written to
  telemetry.
- The application does not own rotation. Deployment infrastructure is
  responsible for provisioning and rotating the token.
- Logs and telemetry contain provider, endpoint category, status code, timing,
  and outcome only. They exclude authorization headers, raw response bodies,
  workflow logs, actor details, and repository secrets.
- A future deployment must use a least-privilege read-only token suitable for
  Actions metadata access; permission selection is a deployment decision.

## Browser Contract and Human Workflow

`GET /api/signals` remains the only browser-facing source read contract. The
Signal System continues to discover, inspect, interpret, and record human
Accept/Defer/Escalate decisions. Source failure must not automatically change a
signal decision or trigger an operational action.

The browser integration is a separate implementation step after this design is
approved. Until then, the Signal System continues using its local deterministic
fixtures.

## Validation Plan

Before integration approval, tests must cover:

- successful GitHub response mapping
- status, confidence, provenance, and freshness mapping
- missing and malformed required fields
- empty workflow-run responses
- stale and invalid timestamps
- timeout, network, `401`, `403`, `429`, and `5xx` behavior
- one bounded retry and `Retry-After` handling
- local fixture fallback and deployed missing-token behavior
- absence of authorization headers and raw vendor payloads in API responses,
  logs, and telemetry
- regression of the existing Signal System workflow and human decisions

The implementation must pass the repository lint, test, build, and diff checks.
A separate Engineering Review is required before merging external GitHub access
or changing the existing browser contract.

## Human Decisions Required

The following decisions require explicit approval before implementation:

- GitHub REST API and latest-run selection as the initial source strategy
- `GITHUB_TOKEN` server-runtime ownership and deployment-managed rotation
- local fixture fallback versus deployed `503` behavior
- one retry with a 5-second request budget
- the minimum vendor field set and mapping rules above
- least-privilege GitHub token permissions for the deployment environment
