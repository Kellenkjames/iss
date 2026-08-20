# Documentation Checklist

**Canonical Repository Path:** `docs/engineering/documentation-migration-checklist.md`

**Project:** Intelligent Systems Suite (ISS)

**Version:** 1.0

**Revision:** 2026-08-19

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
| ✓ | Engineering Constitution | `docs/engineering/engineering-constitution.md` |
| ✓ | Architecture Standards | `docs/engineering/architecture-standards.md` |
| ✓ | Universal Agent Contract | `docs/engineering/universal-agent-contract.md` |
| ✓ | Role Selection Matrix | `docs/engineering/role-selection-matrix.md` |
| ✓ | Product Development Lifecycle | `docs/engineering/product-development-lifecycle.md` |
| ✓ | GitHub Copilot Engineering Framework | `docs/engineering/copilot-framework.md` |
| ✓ | Repository-Wide Copilot Instructions | `github/copilot-instructions.md` |
| ✓ | Repository Blueprint | `docs/engineering/repository-blueprint.md` |
| ✓ | Repository Initialization Runbook | `docs/engineering/initialization-runbook.md` |
| ✓ | Documentation Migration Checklist | `docs/engineering/documentation-migration-checklist.md` |
| ✓ | Repository README | `README.md` |
| ! | LICENSE | Not present in current workspace; add before public release |

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

Documentation migration is complete for the documents listed above. Future
documentation changes should update the relevant canonical document and index,
then validate links and repository-path claims. Commit and release operations
remain human-authorized actions outside this checklist.
