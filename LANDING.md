# Intelligent Systems Suite

A boundary-first engineering portfolio for AI-assisted software systems.

ISS demonstrates how reusable platform architecture, disciplined application boundaries, and human-in-control AI workflows can coexist in one coherent repository.

## Why This Exists

This repository is designed to show engineering quality, not feature volume.

The focus is deliberate:

- explicit boundaries between apps and shared platform layers
- deterministic local evaluation paths
- server-owned credential handling for live integrations
- human decision authority over AI output

## What You Can Evaluate Quickly

- Architecture discipline across multiple app surfaces
- Reusable platform composition (design tokens, component kernel, provider, telemetry)
- A flagship signal-review workflow that keeps AI in a support role
- Clear distinction between browser boundaries and server-only integration boundaries

## Start Here (60-Second Path)

1. Open Shell and use the Demo Hub cards for orientation.
2. Open Signal System and run one signal review flow.
3. Observe source-state messaging and human decision controls.
4. Inspect Signal API responses for normalized server contracts.

## Live Demo Endpoints (Local)

These endpoints assume local dev servers are running.

- Shell: http://127.0.0.1:4201/
- Signal System: http://127.0.0.1:4200/
- Interpretation Engine: http://127.0.0.1:4202/
- Signal API signals contract: http://127.0.0.1:4300/api/signals

## Core Boundaries

- Shell: platform composition reference
- Signal System: operational signal review and human decision support
- Interpretation Engine: focused reasoning/interpretation boundary
- Signal API: server-only integration boundary (read contract + server-mediated interpretation)

## Architecture and Documentation

- Current-state diagram: [docs/engineering/iss-platform-current-state-diagram.md](docs/engineering/iss-platform-current-state-diagram.md)
- Engineering index: [docs/engineering/README.md](docs/engineering/README.md)
- Product PRDs: [docs/product/mini-prds/README.md](docs/product/mini-prds/README.md)

## Scope Guardrails

ISS is intentionally not positioned as a full SaaS product in this phase.

Out of scope for this iteration:

- multi-tenant infrastructure
- broad workflow automation
- cross-app shared business state
- enterprise control-plane features

The goal is a credible, reviewable engineering system with explicit architectural intent.
