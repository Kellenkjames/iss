# Role Selection Matrix

## Intelligent Systems Suite

**Deliverable:** Phase 0 — AI Engineering Team

**Artifact:** Role Selection Matrix

**Status:** Draft for Review

---

# Purpose

The Role Selection Matrix reduces cognitive load during development by helping the Technical Lead choose the correct AI Engineer for each engineering brick.

This document does not automate engineering work.

It does not assign tasks.

It does not replace judgment.

It provides a lightweight routing system so each work session begins with the right specialist, the right context, and the right handoff expectation.

---

# Core Principle

> **Select the engineer based on the primary engineering risk, not the visible task.**
> 

A UI task may actually be an architecture task.

A documentation task may actually be an ADR task.

A telemetry task may actually be an AI integration task.

Choose the engineer who owns the highest-risk decision in the work.

---

# Default Selection Rule

Before starting a brick, ask:

```
What is the main thing that could go wrong if this is done poorly?
```

Then select the engineer who owns that risk.

---

# Role Selection Matrix

| Work Type | Primary Engineer | Secondary Engineer | Use When |
| --- | --- | --- | --- |
| Package boundary decision | Architecture Lead | Engineering Reviewer | Work affects where code belongs. |
| Public API design | Architecture Lead | Documentation Engineer | Exports, props, events, or shared interfaces change. |
| Scope clarification | Architecture Lead | Documentation Engineer | Work may expand beyond Version 1. |
| ADR recommendation | Architecture Lead | Documentation Engineer | A decision has long-term consequences. |
| Lit component implementation | Design Systems Engineer | Frontend Engineer | Building Kernel primitives. |
| Web Component API | Design Systems Engineer | Architecture Lead | Component props, events, or slots are being defined. |
| Accessibility behavior | Design Systems Engineer | Testing Engineer | Focus, keyboard, labels, ARIA, or modal behavior involved. |
| Angular screen/page | Frontend Engineer | Design Systems Engineer | Building app-level UI composition. |
| Angular routing/layout | Frontend Engineer | Architecture Lead | App structure or navigation changes. |
| Frontend state handling | Frontend Engineer | Architecture Lead | UI state, derived state, or data flow involved. |
| Backend API/service | Backend Engineer | Architecture Lead | Services, endpoints, contracts, or persistence involved. |
| Data persistence | Backend Engineer | Architecture Lead | File-backed, database, or storage decision needed. |
| Request/response contract | Backend Engineer | Documentation Engineer | Typed contracts or service boundaries change. |
| AI provider interface | AI Integration Engineer | Architecture Lead | Provider abstraction, model options, or response shape involved. |
| Prompt interface | AI Integration Engineer | Documentation Engineer | Application passes structured context into AI. |
| AI invocation path | AI Integration Engineer | Telemetry Engineer | Runtime AI call is added or changed. |
| Token/cost logging | Telemetry Engineer | AI Integration Engineer | Token counts, cost, latency, or invocation context involved. |
| Monthly telemetry report | Telemetry Engineer | Documentation Engineer | JSON/Markdown operational reports involved. |
| Test strategy | Testing Engineer | Architecture Lead | Deciding what test level protects the boundary. |
| Unit/component tests | Testing Engineer | Relevant implementation engineer | Testing completed implementation. |
| Integration tests | Testing Engineer | Architecture Lead | Multiple packages or apps interact. |
| README drafting | Documentation Engineer | Relevant owner | Project docs, usage docs, or limitations. |
| ADR drafting | Documentation Engineer | Architecture Lead | Formal decision record needed. |
| Developer guide | Documentation Engineer | DevOps Engineer | Setup, workflow, or contributor documentation. |
| CI/CD pipeline | DevOps Engineer | Testing Engineer | GitHub Actions, checks, build flow, or release flow. |
| Repo configuration | DevOps Engineer | Architecture Lead | Workspace, tooling, linting, package scripts. |
| Dependency installation | Architecture Lead | DevOps Engineer | Any new dependency added to the repo. |
| Final review | Engineering Reviewer | Architecture Lead | Work is ready for standards review. |
| Standards compliance | Engineering Reviewer | Relevant owner | Checking completed work against ISS standards. |

---

# High-Risk Override Rule

If a brick touches any of the following, start with the **Architecture Lead**:

- package boundaries
- dependency direction
- public interfaces
- new dependencies
- scope expansion
- architectural standards
- security-sensitive behavior
- ADR-worthy decisions

When in doubt, start with Architecture Lead.

---

# Final Review Rule

Every completed brick should pass through the **Engineering Reviewer** before commit when it affects:

- production code
- public interfaces
- tests
- package boundaries
- documentation
- CI/CD
- AI behavior
- telemetry behavior

The Reviewer is not the first engineer.

The Reviewer is the final quality gate.

---

# Session Router Prompt

Use this minimal prompt when the correct engineer is unclear.

```
Task:
[describe today's brick]

Using the ISS Role Selection Matrix, identify:

Primary Engineer:
Secondary Engineer:
Required Context:
Likely Handoff:
Human Decision Required:
Reason:
```

The response should be short.

The router does not execute work.

It only selects the correct role.

---

# Required Context Pattern

Each session should load only the context required for the selected engineer.

Default context includes:

```
Current brick
Relevant Mini PRD
Architecture Standards
Engineering Constitution
Applicable ADRs
Active files
```

Do not load every document by default.

Lean context improves output quality.

---

# Common Routing Examples

## Example 1

Task:

```
Build iss-button primitive.
```

Primary Engineer:

```
Design Systems Engineer
```

Secondary Engineer:

```
Frontend Engineer
```

Reason:

```
The primary risk is component API, accessibility, and design-token consistency.
```

---

## Example 2

Task:

```
Add OpenAI implementation to AI Provider.
```

Primary Engineer:

```
AI Integration Engineer
```

Secondary Engineer:

```
Telemetry Engineer
```

Reason:

```
The primary risk is provider abstraction and normalized AI invocation behavior.
```

---

## Example 3

Task:

```
Add GitHub Actions CI workflow.
```

Primary Engineer:

```
DevOps Engineer
```

Secondary Engineer:

```
Testing Engineer
```

Reason:

```
The primary risk is build reliability and automated quality enforcement.
```

---

## Example 4

Task:

```
Decide whether Telemetry should use local JSON or SQLite.
```

Primary Engineer:

```
Architecture Lead
```

Secondary Engineer:

```
Telemetry Engineer
```

Reason:

```
The primary risk is architectural persistence strategy and long-term package responsibility.
```

---

## Example 5

Task:

```
Review completed Signal Detail workflow before commit.
```

Primary Engineer:

```
Engineering Reviewer
```

Secondary Engineer:

```
Architecture Lead
```

Reason:

```
The primary risk is standards compliance across architecture, tests, documentation, and integration.
```

---

# Anti-Patterns

Avoid these patterns:

## Loading too many engineers

Do not involve five engineers when one primary and one secondary engineer are sufficient.

## Starting with Reviewer

The Reviewer validates completed work.

The Reviewer does not usually define the initial implementation.

## Using Architecture Lead for everything

Architecture Lead is for architectural risk.

Routine implementation should go to the appropriate specialist.

## Treating the matrix as automation

The matrix recommends.

The Technical Lead decides.

## Loading full project context every time

Context should be scoped to the brick.

More context is not always better.

---

# Definition of Done

The Role Selection Matrix is successful when the Technical Lead can identify the correct AI Engineer for a work session in under two minutes.

It should reduce daily decision friction without introducing orchestration complexity.

The matrix succeeds when engineering coordination becomes lightweight, repeatable, and human-led.