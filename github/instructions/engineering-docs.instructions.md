---
applyTo: "docs/engineering/**/*.md"
---

# ISS Engineering Documentation Instructions

Treat documents under `docs/engineering/` as governed engineering specifications.

## Required behavior

- Preserve the document's established terminology, structure, scope, and authority.
- Do not silently alter approved architecture, governance, roles, or workflows.
- Distinguish clarification from policy change.
- Prefer links to canonical documents over duplicating large policy sections.
- Keep filenames lowercase and hyphenated.
- Preserve valid relative links when moving or renaming files.
- Surface contradictions between engineering documents instead of reconciling them without approval.
- Do not convert implementation observations into new engineering policy without human approval.

## Authority

For repository architecture, consult these documents first:

1. `repository-blueprint.md`
2. `architecture-standards.md`
3. `engineering-constitution.md`

For execution workflow, consult:

- `product-development-lifecycle.md`
- `initialization-runbook.md`
- `documentation-migration-checklist.md`

For Copilot roles and behavior, consult:

- `copilot-framework.md`
- `copilot-instructions.md`
- `ai-engineering-organization.md`
- `role-selection-matrix.md`
- `universal-agent-contract.md`

## Validation

Before completing an engineering-document change:

- confirm the change does not introduce policy drift,
- check affected internal links,
- identify any related document that may require synchronized revision,
- report whether the change is editorial, clarifying, or normative.
