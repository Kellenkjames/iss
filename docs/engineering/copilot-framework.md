# Copilot Framework

---

**Project:** Intelligent Systems Suite

**Applies To:** GitHub Copilot in VS Code and GitHub

**Version:** 1.0

**Status:** Phase 1 Operational Standard

**Owner:** Human Technical Lead

---

# Purpose

The GitHub Copilot Engineering Framework translates the Intelligent Systems Suite engineering operating model into repository-native instructions that GitHub Copilot can consistently execute.

The framework defines:

- How universal engineering rules are delivered
- How specialist engineers are represented
- How task-specific workflows are invoked
- How contextual instructions are scoped
- How duplication and instruction conflict are prevented
- How the Human Technical Lead retains control

The goal is not to create ten independent prompt documents.

The goal is to create one coherent instruction system with specialized execution roles.

GitHub Copilot currently supports several complementary customization mechanisms: repository-wide instructions, path-specific instructions, custom agents, reusable prompt files, and agent skills. These mechanisms have different scopes and should not be treated as interchangeable.

---

# Core Principle

> Copilot receives permanent rules globally, specialist behavior through agents, local conventions through path-specific instructions, and temporary objectives through engineering bricks.
>

This creates four distinct instruction layers:

```
Repository Instructions
↓
How all engineering work behaves

Path-Specific Instructions
↓
How work behaves inside a repository area

Custom Agent
↓
Which specialist is performing the work

Engineering Brick
↓
What must be accomplished now
```

These layers should reinforce one another.

They should not duplicate one another.

---

# Human Authority

The Human Technical Lead remains the engineering orchestrator.

The Human Technical Lead:

- Selects the engineering brick
- Chooses the primary Copilot engineer
- Approves changes in scope
- Resolves architectural ambiguity
- Determines whether additional specialists are required
- Accepts or rejects completed work
- Authorizes commits

Copilot engineers may recommend a handoff.

They may not autonomously assign work to another engineer or expand the brick.

---

# Framework Architecture

The framework uses five GitHub Copilot customization mechanisms.

## Layer 1 — Repository-Wide Instructions

**Purpose:** Define permanent rules that apply to nearly every Copilot interaction.

**Canonical location:**

```
github/copilot-instructions.md
```

GitHub supports repository-wide instructions through `github/copilot-instructions.md`. These instructions provide persistent context about how Copilot should understand, build, test, and validate the repository.

This file should contain only high-frequency instructions.

Examples:

- Repository purpose
- Human authority
- Architecture-first behavior
- Package dependency rules
- Scope discipline
- Validation expectations
- Documentation expectations
- Handoff requirements
- Required response structure
- Prohibition against speculative scope expansion

It should not contain:

- Complete role definitions
- Entire PRDs
- Large architectural explanations
- Package-specific conventions
- Temporary engineering objectives
- Historical decisions

The repository-wide instruction file is the behavioral spine of Copilot inside ISS.

---

## Layer 2 — Path-Specific Instructions

**Purpose:** Apply rules only when Copilot works inside a relevant file path.

**Canonical location:**

```
github/instructions/
```

**File convention:**

```
<scope>.instructions.md
```

GitHub supports path-specific `.instructions.md` files with an `applyTo` field, allowing instructions to activate only for matching files or directories. This capability is supported in VS Code and other selected Copilot surfaces.

Proposed files:

```
github/instructions/
├── angular.instructions.md
├── lit-components.instructions.md
├── ai-provider.instructions.md
├── telemetry.instructions.md
├── testing.instructions.md
├── documentation.instructions.md
└── github-actions.instructions.md
```

Example structure:

```
---
applyTo: "apps/**/*.ts,apps/**/*.html,apps/**/*.scss"
---

# Angular Application Instructions

- Keep application logic inside the owning application.
- Consume platform packages through public APIs.
- Do not reproduce design tokens or shared components locally.
- Use standalone Angular patterns unless an approved exception exists.
- Preserve strict TypeScript settings.
```

Path-specific files should contain technical rules tied to the affected area.

They should not redefine the assigned engineer.

---

## Layer 3 — Custom Agents

**Purpose:** Represent the ten specialist engineers in the AI Engineering Organization.

**Canonical location:**

```
github/agents/
```

**Recommended naming convention:**

```
<role-name>.agent.md
```

GitHub custom agents are specialized Copilot configurations defined through Markdown agent profiles. Agent profiles can specify a name, description, behavioral instructions, tools, and optional MCP configuration. Repository-level agents are stored under `github/agents/`.

Proposed agents:

```
github/agents/
├── architecture-lead.agent.md
├── engineering-reviewer.agent.md
├── design-systems-engineer.agent.md
├── ai-integration-engineer.agent.md
├── telemetry-engineer.agent.md
├── frontend-engineer.agent.md
├── backend-engineer.agent.md
├── testing-engineer.agent.md
├── documentation-engineer.agent.md
└── devops-engineer.agent.md
```

Each agent should contain:

1. Metadata
2. Identity
3. Mission
4. Ownership
5. Non-responsibilities
6. Required context
7. Operating sequence
8. Engineering heuristics
9. Escalation triggers
10. Handoff requirements
11. Definition of done

Custom agents should remain concise.

The complete human-readable role definitions remain in `/docs`.

The agent profiles operationalize those definitions rather than reproduce them in full.

---

## Layer 4 — Prompt Files

**Purpose:** Provide reusable workflows for repeated engineering activities.

**Canonical location:**

```
github/prompts/
```

**File convention:**

```
<workflow-name>.prompt.md
```

Prompt files are designed for reusable, task-specific interactions rather than permanent behavior. GitHub currently documents them as available in supported IDEs, including VS Code, while noting that the feature remains subject to change.

Initial prompt files:

```
github/prompts/
├── start-brick.prompt.md
├── architecture-review.prompt.md
├── validate-brick.prompt.md
├── engineering-review.prompt.md
├── generate-tests.prompt.md
├── update-documentation.prompt.md
└── prepare-handoff.prompt.md
```

Prompt files should define repeatable procedures.

They should not define enduring engineering philosophy.

Example:

```
# Start Engineering Brick

Review the supplied engineering brick.

Before changing code:

1. Restate the objective.
2. Identify the affected packages.
3. Confirm the applicable architecture standards.
4. Identify required context.
5. Flag unresolved decisions.
6. Propose the smallest valid implementation sequence.

Do not implement until the Human Technical Lead confirms the approach.
```

Because prompt-file support may evolve, ISS should treat prompt files as productivity accelerators rather than the only location for critical rules.

---

## Layer 5 — Agent Skills

**Purpose:** Package detailed, reusable knowledge that should be loaded only when relevant.

GitHub describes agent skills as folders containing instructions, scripts, and supporting resources that Copilot may load for specialized tasks. GitHub recommends using global custom instructions for concise, broadly applicable rules and skills for more detailed guidance needed only in specific situations.

Agent skills are not required for the first commit.

Potential future skills:

- Nx workspace operations
- Angular application scaffolding
- Lit component creation
- AI provider implementation
- Telemetry event design
- ADR creation
- Accessibility validation
- Release preparation

For Version 1:

> Use instructions, agents, and prompt files first. Introduce skills only after repeated implementation reveals a clear need.
>

This prevents premature complexity.

---

# Instruction Hierarchy

When Copilot receives multiple instruction sources, ISS applies the following conceptual hierarchy:

```
1. Human Technical Lead
2. Engineering Constitution
3. Architecture Standards
4. Repository-Wide Copilot Instructions
5. Applicable Path-Specific Instructions
6. Selected Custom Agent
7. Applicable PRD and ADRs
8. Current Engineering Brick
9. Existing Repository Implementation
10. Copilot Recommendation
```

The Human Technical Lead remains sovereign.

Existing code is evidence of current implementation.

It is not proof that the implementation is architecturally correct.

---

# Repository Layout

The initial customization structure should be:

```
github/
├── copilot-instructions.md
│
├── agents/
│   ├── architecture-lead.agent.md
│   ├── engineering-reviewer.agent.md
│   ├── design-systems-engineer.agent.md
│   ├── ai-integration-engineer.agent.md
│   ├── telemetry-engineer.agent.md
│   ├── frontend-engineer.agent.md
│   ├── backend-engineer.agent.md
│   ├── testing-engineer.agent.md
│   ├── documentation-engineer.agent.md
│   └── devops-engineer.agent.md
│
├── instructions/
│   ├── angular.instructions.md
│   ├── lit-components.instructions.md
│   ├── ai-provider.instructions.md
│   ├── telemetry.instructions.md
│   ├── testing.instructions.md
│   ├── documentation.instructions.md
│   └── github-actions.instructions.md
│
├── prompts/
│   ├── start-brick.prompt.md
│   ├── architecture-review.prompt.md
│   ├── validate-brick.prompt.md
│   ├── engineering-review.prompt.md
│   ├── generate-tests.prompt.md
│   ├── update-documentation.prompt.md
│   └── prepare-handoff.prompt.md
│
└── workflows/
    └── ci.yml
```

This structure separates:

- Persistent repository behavior
- Specialized engineering identity
- Path-specific implementation rules
- Reusable task procedures
- Repository automation

---

# Repository-Wide Instruction Standard

The repository-wide instruction file should follow this structure.

## 1. Repository Identity

Briefly explain ISS and its architectural intent.

## 2. Authority Model

State that the Human Technical Lead controls scope, architecture, handoffs, and commits.

## 3. Decision Hierarchy

Reference the foundational engineering documents.

## 4. Architecture Rules

Include only the most consequential rules:

- Platform before product
- Respect public package boundaries
- Applications consume platform packages
- Platform packages do not depend on applications
- Avoid circular dependencies
- Prefer explicit interfaces
- No provider-specific AI logic outside the AI Provider boundary

## 5. Work Discipline

- Operate on one engineering brick at a time
- Do not expand scope
- Clarify ambiguity before implementation
- Prefer the smallest complete change
- Do not generate speculative infrastructure

## 6. Validation

Require relevant:

- Type checking
- Linting
- Tests
- Builds
- Accessibility validation
- Documentation review

## 7. Handoff Format

Require the standard Engineering Handoff Matrix output.

## 8. Communication

Require concise, evidence-based summaries.

---

# Custom Agent Specification Standard

Every custom agent should use the same structure.

```
---
name: <Display Name>
description: <When this engineer should be selected>
---

# Identity

You are the <Role> for the Intelligent Systems Suite.

# Mission

<One clear mission statement.>

# Ownership

You own:

- ...
- ...
- ...

# Non-Responsibilities

You do not own:

- ...
- ...
- ...

# Required Context

Before beginning work, review:

- `github/copilot-instructions.md`
- `<role definition path>`
- `<applicable PRD paths>`
- `<applicable standards>`

Load additional context only when required by the current brick.

# Operating Sequence

1. Confirm the brick objective.
2. Identify affected files and packages.
3. Validate architectural boundaries.
4. Implement the smallest complete change.
5. Run applicable validation.
6. Prepare the standard handoff.

# Engineering Heuristics

- ...
- ...
- ...

# Escalation Triggers

Stop and escalate when:

- ...
- ...
- ...

# Handoff

Return:

- Engineering Summary
- Work Completed
- Files Created or Modified
- Architectural Observations
- Outstanding Risks
- Recommended Next Engineer
- Human Decisions Required
- Confidence Assessment

# Definition of Done

Work is complete when:

- ...
- ...
- ...
```

---

# Metadata Standard

Every custom agent should contain:

```
---
name: Architecture Lead
description: Validates architecture, package boundaries, dependencies, and implementation approach before significant engineering work begins.---
```

Tool permissions should be introduced deliberately.

We should not grant or restrict tools merely to make the files look sophisticated.

Version 1 agents can rely on default tooling unless a role requires a meaningful restriction.

For example:

- Documentation Engineer may eventually be limited primarily to documentation files.
- Engineering Reviewer may operate read-first and avoid unsolicited implementation.
- Architecture Lead may analyze broadly but should not make large implementation changes without approval.

Tool restrictions should follow observed workflow needs.

---

# Context Loading Model

Each agent session should receive four context categories.

## Universal Context

Always applicable:

- Repository instructions
- Engineering Constitution
- Architecture Standards
- Universal Agent Contract

## Role Context

Applicable to the selected engineer:

- Role definition
- Role heuristics
- Role escalation rules

## Brick Context

Applicable to the present objective:

- Brick description
- Acceptance criteria
- Affected packages
- Required validation

## Local Repository Context

Limited to:

- Relevant files
- Public interfaces
- Adjacent dependencies
- Applicable package documentation

The agent should not load the entire documentation tree by default.

---

# Instruction Composition Rules

## Write Direct Instructions

Prefer:

> Do not introduce a dependency from platform packages to application packages.
>

Avoid:

> You should generally try to keep an eye on whether platform packages might potentially depend on application packages.
>

---

## Keep One Authority per Rule

A rule should have one canonical home.

Examples:

| Rule | Canonical Location |
| --- | --- |
| Human remains sovereign | Repository instructions |
| Angular conventions | Angular path instructions |
| Frontend ownership | Frontend agent |
| AI Provider scope | AI Provider PRD |
| Current acceptance criteria | Engineering brick |
| Historical rationale | ADR |

---

## Reference Instead of Repeating

Agent profiles should reference foundational documents.

They should not embed entire sections from them.

---

## Keep Instructions Observable

Instructions should describe behavior that can be verified.

Prefer:

> Run affected tests and report the commands and results.
>

Avoid:

> Produce high-quality code.
>

---

## Separate Rules from Workflow

- Instructions establish enduring behavior.
- Agents establish specialization.
- Prompt files establish repeatable procedures.
- Bricks establish immediate objectives.

---

## Avoid Persona Theater

Agents should not mimic personalities.

They should represent professional responsibilities.

The Architecture Lead is not “visionary.”

The Engineering Reviewer is not “skeptical.”

Each role should be defined by decisions, boundaries, outputs, and quality standards.

---

# Copilot Session Protocol

Every engineering brick should follow this sequence.

## 1. Select the Brick

The Human Technical Lead defines:

- Objective
- Scope
- Acceptance criteria
- Constraints

## 2. Select the Primary Engineer

Use the Role Selection Matrix.

## 3. Load Context

Apply the Context Architecture.

## 4. Confirm Understanding

Before implementation, the engineer should state:

- Intended outcome
- Affected areas
- Architectural concerns
- Required validation
- Unresolved decisions

## 5. Implement

Perform the smallest complete change.

## 6. Validate

Run all applicable checks.

## 7. Prepare Handoff

Use the Engineering Handoff Matrix.

## 8. Review

Invoke the Engineering Reviewer when required.

## 9. Human Approval

The Human Technical Lead accepts, revises, or rejects the work.

## 10. Commit

Commit only after validation and approval.

---

# Change-Control Rules

Copilot instruction files are engineering infrastructure.

Changes to them can influence future repository behavior.

Therefore:

- Changes must be reviewed like code.
- Significant behavioral changes should be documented.
- Agent changes should be tested on a contained brick.
- Repository instructions should remain concise.
- Experimental guidance belongs in a branch until validated.
- Foundational rules should not be silently reworded.

GitHub notes that Copilot behavior remains non-deterministic and that overly long instructions may be overlooked, making concise, specific instructions and iterative testing essential.

---

# Validation Strategy

The framework is successful only if it changes engineering outcomes.

We should validate it through controlled bricks.

For each engineer, assess:

- Did it stay within its role?
- Did it load appropriate context?
- Did it respect package boundaries?
- Did it avoid unnecessary scope expansion?
- Did it follow the required handoff structure?
- Did it run appropriate validation?
- Did it correctly escalate uncertainty?

The agent profile should be revised when repeated behavior reveals a systemic issue.

It should not be revised merely because one output was imperfect.

---

# Version 1 Scope

Version 1 includes:

- One repository-wide instruction file
- Ten custom agent profiles
- A small set of path-specific instruction files
- A small set of reusable prompt files
- References to canonical repository documentation
- A defined engineering session protocol

Version 1 does not require:

- MCP servers
- Complex hooks
- Autonomous multi-agent orchestration
- Agent-created agent assignments
- Organization-wide instructions
- Enterprise-level configuration
- Extensive agent skills
- Automated prompt analytics
- Custom Copilot telemetry

These may be considered only after implementation proves they are useful.

---

# Definition of Done

The GitHub Copilot Engineering Framework is complete when:

- The customization hierarchy is defined.
- Every instruction type has a clear responsibility.
- File locations and naming conventions are established.
- The custom agent template is established.
- Context-loading rules are explicit.
- The Human Technical Lead remains the orchestrator.
- Scope boundaries are protected.
- The framework can be translated directly into repository files.
- No critical engineering rule depends on a preview-only feature.
- The system can begin with minimal complexity and evolve through evidence.

---

# Definition of Success

The framework succeeds when GitHub Copilot behaves less like a generic coding assistant and more like a disciplined engineering organization operating inside established boundaries.

The visible outcomes should be:

- Consistent architectural decisions
- Clear role ownership
- Smaller and more focused changes
- Fewer repeated instructions
- Predictable handoffs
- Reliable validation
- Reduced scope drift
- Stronger human control

The objective is not autonomous software development.

The objective is **controlled engineering leverage**.

---

# Framework Summary

```
github/copilot-instructions.md
↓
How all engineering work behaves

github/instructions/*.instructions.md
↓
How specific repository areas are handled

github/agents/*.agent.md
↓
Which specialist performs the work

github/prompts/*.prompt.md
↓
How repeated engineering procedures are invoked

Engineering Brick
↓
What must be accomplished now

Human Technical Lead
↓
What is approved and committed
```

---

## Deliverable Assessment

This framework is strong enough to lock as the governing design for the Copilot layer.

The most important decision is the separation of responsibilities:

- **Repository instructions** carry universal rules.
- **Path instructions** carry local technical conventions.
- **Custom agents** carry engineering ownership.
- **Prompt files** carry repeated workflows.
- **Engineering bricks** carry temporary objectives.
- **The human** controls orchestration.

That separation keeps the operating model understandable and prevents ten role files from becoming ten competing sources of truth.

The next logical action is to create the first concrete artifact from this framework:

> **`github/copilot-instructions.md` — ISS Repository-Wide Copilot Instructions**
>
