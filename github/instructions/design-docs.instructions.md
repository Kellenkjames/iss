---
applyTo: "docs/design/**/*"
---

# ISS Design Documentation Instructions

Treat `docs/design/` as the canonical ISS Design Operating System and its onboarding context.

## Required behavior

- Preserve the six-phase design hierarchy:
  1. Design Philosophy
  2. Design Foundations
  3. Component Library
  4. Application Composition Patterns
  5. Reference Screens
  6. Governance and Adoption
- Reuse approved foundations, components, and composition patterns before proposing new ones.
- Do not invent one-off visual or interaction patterns.
- Preserve accessibility requirements and human-in-the-loop AI principles.
- Treat Claude Design HTML and JavaScript files as generated archival artifacts.
- Do not manually alter generated Claude Design assets unless explicitly instructed.
- Make governance changes through the approved design change lifecycle.
- Distinguish documentation edits from design-system changes.

## Canonical Markdown context

Consult first:

- `design-partner-charter.md`
- `design-kickoff-package.md`

The generated design system is located under:

- `claude-design-system/`

## Validation

Before completing a design-document change:

- identify the affected design phase,
- confirm whether an existing component or pattern already covers the need,
- identify downstream effects on components, composition, reference screens, or governance,
- report whether generated archive files were modified.
