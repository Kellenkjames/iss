# ISS Application Shell

The ISS Application Shell is the canonical reference integration application for the Intelligent Systems Suite. It demonstrates how an Angular application consumes the shared platform packages through their public boundaries.

The shell is intentionally lightweight and proof-oriented. It validates platform composition and integration contracts; it is not a production product or the flagship application.

## Architectural Role

The shell is the application host at the top of the ISS composition model:

```text
Design Tokens
        ->
Component Kernel
        ->
AI Provider
        ->
Telemetry
        ->
Application Shell
```

It composes the shared Web Components, invokes AI through the AI Provider boundary, and supplies browser telemetry at the runtime boundary. The shell owns application composition only. Reusable infrastructure belongs in the platform libraries.

## Dependencies

The shell consumes these internal packages:

- `@iss/design-tokens` for shared visual tokens
- `@iss/component-kernel` for reusable Web Components
- `@iss/ai-provider` for provider-neutral AI execution
- `@iss/telemetry/browser` for browser-safe local telemetry

The application is built with Angular and TypeScript.

## Public Interface

The shell has no reusable production API. Its interface is an executable reference for engineers building ISS applications. The examples in `src/app/` demonstrate component composition, provider invocation, application-level result normalization, and telemetry integration.

## Usage

Install workspace dependencies from the repository root, then start the development server:

```bash
pnpm nx serve shell
```

The browser demo uses the explicit `demo-key` provider configuration by default. This keeps local browser execution deterministic and prevents real credentials from being required or bundled into the application. Live provider credentials are runtime concerns outside this browser-safe reference path.

## Testing

Run the shell test target from the repository root:

```bash
CI=1 pnpm nx test shell
```

The tests cover application startup, Component Kernel composition, the default browser-safe provider configuration, and telemetry recording without persisting raw prompts.

The shell participates in the platform validation matrix:

```bash
CI=1 pnpm nx run-many --target=lint --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1
CI=1 pnpm nx run-many --target=test --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1
CI=1 pnpm nx run-many --target=build --projects=design-tokens,component-kernel,telemetry,ai-provider,shell --parallel=1
```

## Known Limitations

- The shell is a reference integration, not a production application.
- Its AI interaction is a demonstration path and is intentionally not a complete product workflow.
- Browser telemetry is local-first and is not a hosted observability system.
- The shell does not implement authentication, persistent business data, backend orchestration, or proprietary domain logic.
- PRD-06 and PRD-07 product capabilities are outside the shell's scope.

## Related Documentation

No separate ADR is currently associated with the shell. The governing references are:

- [PRD-05](../../docs/product/mini-prds/prd-05.md)
- [Active Engineering Brick](../../docs/engineering/active-brick.md)
- [Architecture Standards](../../docs/engineering/architecture-standards.md)
- [Engineering Review Gate](../../docs/engineering/engineering-review-gate.md)
- [Telemetry v1 Baseline](../../docs/engineering/telemetry-v1-baseline.md)
