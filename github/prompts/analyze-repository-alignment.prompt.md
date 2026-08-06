---
agent: ask
description: Analyze whether a proposed change aligns with ISS product, engineering, and design governance.
---

# Analyze ISS Repository Alignment

Evaluate the proposed change before implementation.

## Required analysis

Determine:

- whether the change is supported by an approved product requirement,
- whether it fits the repository architecture,
- whether an existing library, component, token, or pattern should be reused,
- whether it creates a new dependency or platform capability,
- whether it requires human approval,
- which Engineering Brick should contain the work,
- which role should review it.

## Required output

Produce:

1. **Alignment status:** Aligned, Conditionally aligned, or Not aligned
2. **Product basis**
3. **Engineering basis**
4. **Design basis**
5. **Existing reusable assets**
6. **Required approvals**
7. **Recommended brick boundary**
8. **Recommended reviewer**
9. **Unresolved gaps**
10. **Repository paths cited**

## Rules

- Do not infer approval from absence of conflict.
- Do not invent missing requirements.
- Surface contradictions explicitly.
- Do not modify files.
