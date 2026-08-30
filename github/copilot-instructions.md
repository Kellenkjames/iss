# ISS AI-Driven SDLC Operating Model

## Purpose

This document captures the reusable engineering method used to develop the Intelligent Systems Suite (ISS). It is intended as transferable intellectual property: a practical operating model for using AI-assisted engineering without transferring product, architectural, or acceptance authority away from people.

The method is platform-agnostic. GitHub Copilot is the current implementation partner, but the controls apply to any capable AI engineering assistant.

## Methodology

ISS treats AI as a bounded implementation collaborator within a human-directed software delivery lifecycle:

1. **Establish authoritative context.** Approved product requirements, architecture, design standards, implementation, and tests define the working context before changes begin.
2. **Constrain work to a valid brick.** Each request has one independently verifiable outcome, a defined scope, and an explicit owner for unresolved decisions.
3. **Implement from approved decisions.** The AI may inspect, propose, and implement; it must not invent product scope, architectural direction, dependencies, or platform conventions.
4. **Validate with evidence.** Relevant lint, test, type-check, build, and behavior checks determine completion. Unrun or failing checks remain visible rather than being implied away.
5. **Preserve human decision authority.** A human technical lead approves scope, resolves ambiguity, authorizes breaking changes and dependencies, and accepts completed work.
6. **Maintain the operational record.** Documentation changes with behavior, contracts, workflows, and architecture so the repository remains understandable and reviewable.

These controls make AI contribution repeatable, inspectable, and transferable across teams while retaining clear accountability.

## Repository Implementation

The sections below are the ISS-specific implementation of this operating model for AI assistants working in this repository. They turn the methodology into directly executable repository guidance.

---

## ISS Repository Instructions

## Project Identity

This repository contains the Intelligent Systems Suite (ISS), an AI-native software platform and reference architecture.

Treat the repository documentation as the authoritative source for product, engineering, design, and workflow decisions.

Do not invent architecture, requirements, components, conventions, or dependencies when the repository already defines them.

## Source-of-Truth Order

When instructions or documents appear to conflict, use this precedence:

1. Explicit human direction in the current task
2. Approved product requirements in `docs/product/`
3. Repository-wide instructions in this file
4. Engineering governance in `docs/engineering/`
5. Design specifications in `docs/design/`
6. Existing implementation and tests
7. General conventions or model knowledge

Surface unresolved conflicts instead of silently choosing.

## Required Operating Model

Before modifying files:

1. Understand the requested outcome.
2. Identify the relevant product, engineering, and design documents.
3. Inspect the existing repository implementation.
4. State any material assumptions or unresolved gaps.
5. Make the smallest coherent change that satisfies the request.

Implementation executes approved decisions. It should not create missing product or architectural decisions without approval.

## Engineering Brick Discipline

All implementation work should be scoped as a small, independently validatable Engineering Brick.

A brick should:

- have one clear outcome,
- remain within approved scope,
- minimize unrelated changes,
- preserve architectural boundaries,
- include appropriate validation,
- update documentation when behavior or contracts change.

Do not combine unrelated improvements into one task.

## Architecture Rules

- Preserve the Nx integrated monorepo structure.
- Use repository-local tooling through `pnpm`.
- Do not install or assume global Nx tooling.
- Do not add dependencies without a demonstrated requirement.
- Prefer existing libraries, components, tokens, and patterns before creating new ones.
- Keep platform logic reusable and product logic isolated.
- Do not bypass documented module boundaries or repository conventions.
- Do not restructure the repository without explicit approval.

Consult:

- `docs/engineering/repository-blueprint.md`
- `docs/engineering/architecture-standards.md`
- `docs/engineering/engineering-constitution.md`

## Product Rules

- Product scope and requirements come from `docs/product/`.
- Do not infer unapproved features.
- Do not expand an MVP requirement into a broader platform capability without approval.
- When requirements are incomplete, identify the gap before implementing.

## Design Rules

- Use the ISS Design Operating System in `docs/design/`.
- Reuse approved foundations, components, and application composition patterns.
- Do not invent one-off visual or interaction patterns when an approved pattern exists.
- Accessibility is required at the component and workflow level.
- AI-generated interfaces must preserve visible human review, explainability, and state where specified.

## Code Quality

All code should be:

- readable,
- typed,
- testable,
- accessible where applicable,
- aligned with existing patterns,
- free of speculative abstraction.

Prefer simple implementations that preserve future extensibility over premature frameworks.

## Validation

Before declaring work complete:

- run the relevant lint, test, type-check, and build targets,
- report exactly what was run,
- disclose any failures or skipped validation,
- verify that unrelated files were not changed,
- confirm that the result remains within the requested brick.

Never claim validation passed unless the corresponding command succeeded.

## Documentation

Update documentation when a change affects:

- public behavior,
- component contracts,
- architecture,
- workflows,
- repository conventions,
- operational procedures.

Do not duplicate canonical documentation unnecessarily. Link to the authoritative document where appropriate.

## Human Authority

Human approval remains final for:

- product vision,
- product scope,
- requirements,
- architecture changes,
- new dependencies,
- new platform components or patterns,
- breaking changes,
- final acceptance.

When a decision exceeds the current task's authority, stop and surface it clearly.
