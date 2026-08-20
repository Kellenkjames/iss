# Archived Engineering Bricks

This directory contains completed or superseded engineering-brick records.

These documents remain available for architectural history and implementation traceability, but they are not active work queues.

## Active Planning Document

Active in-flight planning lives in the single parent brief:

- [Active Engineering Brick](../../active-brick.md)

Durable baseline records such as Telemetry and release manifests remain in the
parent engineering directory and are not treated as active planning queues.

## Archive Contents

- [EB-014 Component Kernel Carry-Over](./EB-014-CARRY-OVER-PROMPT.md)
- [EB-016 AI Provider Integration Boundary](./EB-016-AI-PROVIDER-INTEGRATION-BOUNDARY.md)
- [EB-017 AI Provider Configuration and Factory](./EB-017-AI-PROVIDER-CONFIGURATION-AND-FACTORY.md)
- [EB-018 AI Provider Runtime Configuration](./EB-018-AI-PROVIDER-RUNTIME-CONFIGURATION.md)
- [EB-019 AI Provider Bootstrap Contract](./EB-019-AI-PROVIDER-BOOTSTRAP-CONTRACT.md)
- [EB-020 AI Provider Bootstrap Refinement](./EB-020-AI-PROVIDER-BOOTSTRAP-REFINEMENT.md)
- [EB-021 Incident Service Adoption](./EB-021-INCIDENT-SERVICE-ADOPTION.md)
- [EB-022 Shell Result Normalization](./EB-022-SHELL-RESULT-NORMALIZATION.md)
- [EB-023 Shared App Service Contract](./EB-023-SHARED-APP-SERVICE-CONTRACT.md)
- [EB-024 Interpretation Service Consumer](./EB-024-INTERPRETATION-SERVICE-CONSUMER.md)

## Maintenance Rule

Use one active planning file (`active-brick.md`) for ongoing work.

Create a new committed numbered engineering-brick record only when the work
introduces a durable architectural boundary, public contract, or explicit
review decision that should be preserved historically.

Smaller implementation increments should update the active brief and be
represented primarily by code, tests, and commit history.
