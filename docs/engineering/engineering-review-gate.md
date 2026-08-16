# Engineering Review Gate

---

## Purpose

This document defines when a project should invoke the engineering-review agent and what the lightweight review gate should cover.

The default rule is simple:

- use the review agent for milestone-quality checks and architecture-sensitive changes
- do not use it for every micro-iteration or every small implementation edit
- trust repo validation for routine implementation feedback

This keeps the process efficient while preserving the safety net that worked well during the Component Kernel work.

---

## Default Rule

Use the engineering-review agent when the work is one of the following:

1. establishing or changing a public contract
2. introducing a new shared platform package
3. changing architectural boundaries
4. making a scope decision that affects the project roadmap
5. validating a high-risk implementation before a milestone or human approval

Do not require a review agent for routine code changes that are already covered by:

- build validation
- lint validation
- targeted tests
- package-level assumptions
- clear repo conventions

---

## Lightweight Review Checklist

When the review gate is triggered, it should be a short, focused pass around the following items.

### 1. Boundary check

- Does the work remain in the correct architectural layer?
- Does it respect the repo’s declared ownership boundaries?
- Does the implementation align with the current package model?
- Is there any unintended coupling to application logic or unrelated layers?

### 2. Scope check

- Is the solution still aligned with the relevant PRD and v1 baseline?
- Are we avoiding dashboard, analytics, hosted platform, or product-telemetry drift?
- Is the feature intentionally narrow and reviewable?

### 3. Public contract check

- Is the API small and stable?
- Are storage details private?
- Does the contract match repository conventions?
- Would a future engineer understand the interface without reading app behavior?

### 4. Safety check

- Are secrets, credentials, and raw prompts excluded?
- Are sensitive fields filtered or redacted before any output is stored?
- Does the implementation avoid accidental leakage into generated reports or logs?

### 5. Validation check

- build passes
- lint passes
- targeted tests pass
- package output is valid and inspectable
- no unexpected repo drift was introduced outside the brick scope

---

## Trigger Conditions for PRD-03 and Similar Bricks

For the Telemetry work and similar platform bricks, the engineering-review agent should be triggered at the following moments:

- before declaring the brick complete
- before expanding scope beyond v1 requirements
- before moving into the next phase of development
- whenever the work affects cross-cutting platform boundaries

For normal implementation loops, repo validation is sufficient.

---

## Recommendation for Daily Workflow

Use the following default workflow:

1. implement in the repo
2. run build, lint, and targeted tests
3. if a boundary or scope question arises, do a quick review against the relevant PRD and baseline document
4. only invoke the engineering-review agent when a milestone gate or architectural decision is at stake

This makes review feel natural and automatic without requiring constant human orchestration.

---

## Standard Review Gate Language

Use this shorthand when preparing a review pass:

> Review this brick against the relevant PRD, v1 baseline, and package boundary standards. Confirm the implementation remains narrow, architecture-safe, and repo-aligned. Validate the public contract, security boundaries, and package-level validation output before approval.

This is intentionally lightweight and should be used as a default review prompt when a package milestone is ready for approval.
