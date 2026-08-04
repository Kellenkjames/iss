# Documentation Checklist

**Canonical Repository Path:** `docs/01-operations/documentation-migration-checklist.md`

**Project:** Intelligent Systems Suite (ISS)

**Status:** Phase 1 Operational Procedure

**Owner:** Human Technical Lead

---

# Purpose

This checklist defines the canonical destination for every approved engineering document created during the planning phase of the Intelligent Systems Suite.

Its purpose is to ensure documentation is:

- Migrated consistently
- Stored in a single canonical location
- Free of duplication
- Ready for long-term maintenance

This document does not define repository structure or engineering standards. Those responsibilities belong to the Repository Blueprint and related governance documents.

---

# Migration Principles

Documentation migration should always:

- Preserve a single source of truth.
- Migrate only approved documents.
- Exclude drafts, working notes, and historical iterations.
- Place each document in its canonical repository location.
- Remove duplicate copies after migration.

Every document should exist in **one authoritative location**.

---

# Migration Checklist

| Status | Document | Destination |
| --- | --- | --- |
| ☐ | Engineering Constitution | `docs/00-governance/` |
| ☐ | Architecture Standards | `docs/00-governance/` |
| ☐ | Universal Agent Contract | `docs/00-governance/` |
| ☐ | Engineering Operating System | `docs/00-governance/` |
| ☐ | Context Architecture | `docs/00-governance/` |
| ☐ | Engineering Handoff Matrix | `docs/00-governance/` |
| ☐ | GitHub Copilot Engineering Framework | `docs/02-ai-engineering/` |
| ☐ | Repository-Wide Copilot Instructions | `.github/copilot-instructions.md` |
| ☐ | Repository Blueprint | `docs/01-operations/` |
| ☐ | Repository Initialization Runbook | `docs/01-operations/` |
| ☐ | Documentation Migration Checklist | `docs/01-operations/` |
| ☐ | Repository README | Repository root |
| ☐ | LICENSE | Repository root |

---

# Validation

Before marking migration complete, verify:

- Every approved document has been migrated.
- No draft documents were included.
- No duplicate copies remain.
- Repository paths match the Repository Blueprint.
- Internal links resolve correctly.
- Repository navigation is logical and complete.

---

# Completion Criteria

Documentation migration is complete when:

- Every approved document exists in its canonical location.
- No planning artifacts remain outside the repository.
- Documentation can be located without ambiguity.
- The repository contains a single authoritative engineering knowledge base.

---

# Next Step

After documentation migration is complete:

1. Execute the Repository Initialization Runbook.
2. Create the initial repository commit.
3. Begin the First Engineering Brick.