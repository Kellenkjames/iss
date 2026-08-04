# Product Development Lifecycle

**Version:** 1.0

**Status:** Locked

---

# Purpose

The ISS Product Development Lifecycle defines the mandatory sequence by which every project progresses from concept to production.

Its purpose is to ensure that product, design, engineering, and implementation decisions are made in the correct order, by the appropriate discipline, before work advances.

The lifecycle exists to reduce ambiguity, improve implementation quality, and establish a repeatable development process across all ISS projects.

---

# Scope

This lifecycle governs:

- New projects
- New product capabilities
- Significant feature additions
- Major architectural enhancements

It applies to every production project developed within ISS.

---

# Core Principles

### 1. Decisions Flow Downstream

Every stage resolves uncertainty for the stage that follows.

Implementation inherits decisions.

It does not create them.

---

### 2. One Responsibility Per Stage

Each stage answers one question.

| Stage | Primary Question |
| --- | --- |
| Vision | Why should this exist? |
| Project Definition | What are we building? |
| PRD | What must it do? |
| Design | How should users experience it? |
| Engineering Planning | How should it be built? |
| Engineering Bricks | What is the next executable unit? |
| Implementation | Can it be built correctly? |
| Validation | Does it satisfy expectations? |
| Release | Is it ready to become the new baseline? |

---

### 3. Single Source of Truth

Every decision belongs to one artifact.

Requirements never migrate into Engineering Bricks.

Architecture never migrates into Design.

Design never migrates into code comments.

Every artifact owns one category of knowledge.

---

### 4. Stable Methodology

The methodology is stable.

Individual projects are experiments.

Changes to the lifecycle require repeated implementation evidence—not isolated observations.

*(This is the principle we discussed adding.)*

---

### 5. Stage Completion Is Mandatory

Work advances only when exit criteria are satisfied.

Partial completion does not propagate downstream.

---

# Lifecycle

```
Vision
    │
    ▼
Project Definition
    │
    ▼
Product Requirements (PRD)
    │
    ▼
Product Design
    │
    ▼
Engineering Planning
    │
    ▼
Engineering Bricks
    │
    ▼
Implementation
    │
    ▼
Validation
    │
    ▼
Release
```

---

# Stage Specifications

Instead of repeating large sections, every stage follows one identical template.

---

## Stage Name

### Purpose

Why this stage exists.

---

### Inputs

Required upstream artifacts.

---

### Outputs

Artifacts produced.

---

### Exit Criteria

Objective completion requirements.

---

### Responsible Roles

Human

GPT

Claude

Copilot

(as applicable)

---

That template repeats for every stage.

It keeps the document compact and predictable.

---

# Decision Authority

This is one entirely new section I'd add.

Because it's actually the heart of the lifecycle.

| Decision Type | Authority |
| --- | --- |
| Product Vision | **Human (GPT assists)** |
| Product Scope | **Human (GPT assists)** |
| Requirements (PRD) | **Human (GPT assists, Claude assists)** |
| User Experience | **Human (Claude assists)** |
| Design Language | **Human (Claude assists)** |
| Architecture | **Human (GPT assists)** |
| Repository Structure | **Human (GPT assists)** |
| Engineering Planning | **Human (GPT assists)** |
| Code Implementation | **Human + Copilot** |
| Final Approval | **Human** |

This clarifies that AI contributes heavily, but authority remains explicit.

---

# Stage Transition Rules

A project may advance only when:

- Outputs are complete.
- Exit criteria are satisfied.
- Upstream artifacts are considered stable.
- Required reviews are complete.

If implementation exposes a product or design issue...

the lifecycle returns to the responsible upstream stage.

Implementation never silently becomes the source of truth.

---

# Continuous Improvement

The lifecycle itself is versioned.

Future revisions require:

- Multiple completed projects
- Demonstrated recurring issues
- Documented rationale
- Formal version increment

The methodology does not change during active implementation without compelling evidence.

---

# Definition of Success

The Product Development Lifecycle succeeds when:

- Every implementation traces back to approved product requirements.
- Design decisions precede engineering decisions.
- Engineering decisions precede implementation.
- AI contributes within clearly defined responsibilities.
- Every completed project strengthens—not weakens—the engineering system.

---

# Why I think this is stronger

I actually think this document has evolved beyond being "the last methodology document."

It's now the **constitution for project execution**.

Every other engineering document governs a discipline:

- Constitution → engineering behavior
- Repository Blueprint → repository architecture
- Engineering Bricks → execution units

This document governs **how work moves**.

That's a unique responsibility.

---

## One final recommendation

If we're truly locking **Methodology v1.0**, I would add one sentence at the very end:

> **This document marks the completion of the ISS Engineering Methodology. Future enhancements to the methodology require implementation evidence obtained through the execution of production projects.**
>