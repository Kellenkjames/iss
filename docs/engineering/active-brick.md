# Active Engineering Brick

This file is the single active planning brief for in-flight engineering work.

Historical PRD records that are no longer part of the live instance have been
archived to preserve evidence without polluting the active brief.

- Archive directory: [docs/engineering/archive/engineering-bricks](archive/engineering-bricks)
- Historical PRD-05/PRD-06 summary: [docs/engineering/archive/prd-05-prd-06-historical-bricks.md](archive/prd-05-prd-06-historical-bricks.md)

## Active Work

### PRD-07 Brick 1 - Signal Discovery and Decision-Ready Detail

### Status

Active - design checkpoint approved; implementation continues within the approved scope.

### Outcome

Deliver a narrow, human-centered signal review workflow that demonstrates
signal discovery, evidence inspection, AI-assisted interpretation, and a clear
human decision boundary without expanding into backend, enterprise, or shared
platform scope.

### Scope

In scope:

- signal discovery list and quick triage
- selected signal detail with evidence and ownership
- AI-assisted interpretation via the approved provider boundary
- human decision authority for accept, defer, or escalate
- deterministic local data for v1
- browser-safe telemetry evidence

Out of scope:

- auth, collaboration, notifications, or role systems
- backend persistence or API services
- workflow automation or orchestration
- analytics dashboards or generalized reporting
- new shared platform contracts
- enterprise features or SaaS expansion

### Current Implementation Status

- Application scaffold is in place for the Signal System.
- The app owns signal data, prompt construction, interpretation orchestration,
  and UI status handling.
- Provider config remains routed through the repo’s approved runtime boundary.
- The current focused validation path is passing:
  - `CI=1 pnpm nx test signal-system`

### Review Conditions Closed

The design checkpoint is closed for the live PRD-07 instance. The approved scope
remains limited to the application-owned signal workflow and does not broaden into
platform or enterprise concerns.

- user and decision context are explicit
- signal model stays local and deterministic
- AI is a support layer, not the final authority
- telemetry remains in the approved browser-provided path
- no backend or persistence is required for v1

### Checkpoint A: Planning and Design Readiness

- [x] Primary user and decision context are defined.
- [x] Signal concept is local, discrete, and actionable.
- [x] Lifecycle, detail surface, and discovery flow are defined.
- [x] AI interpretation is explicitly secondary to the human review.
- [x] Telemetry expectations remain aligned to the repo boundary.
- [x] Frontend-first and deterministic local-data model are approved.
- [x] Application-owned versus platform-owned responsibilities are explicit.
- [x] Enterprise, backend, and dashboard scope is intentionally excluded.
- [x] Implementation readiness is confirmed for the first v1 slice.

### Immediate Next Steps

1. Continue implementation only within the approved signal workflow scope.
2. Keep signal logic and domain ownership in the app layer.
3. Preserve deterministic data and browser-safe execution until a future review
   approves broader infrastructure.
4. Continue to keep historical PRD artifacts archived instead of carrying them in
   the active brief.

### Validation Notes

The active brief is intentionally concise and focused on the current live work.
All prior historical PRD records remain available in the archive for traceability
and review context.
