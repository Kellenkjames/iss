# Signal System

The Signal System is the flagship PRD-07 application in the Intelligent
Systems Suite. It demonstrates a focused workflow for discovering operational
signals, reviewing evidence, requesting AI-supported interpretation, and
recording a human decision.

## Architectural Role

The browser application owns signal presentation, local signal mapping,
prompt composition, interpretation orchestration, and human decision state. It
composes the shared platform through approved boundaries rather than
reimplementing provider, telemetry, or UI infrastructure.

## Dependencies

- `@iss/design-tokens` for the shared visual language
- `@iss/component-kernel` for reusable Web Components
- `@iss/ai-provider` for provider-neutral AI execution
- `@iss/telemetry/browser` for browser-safe AI telemetry
- Angular and TypeScript

## Usage

From the repository root:

```bash
pnpm nx serve signal-system
```

The browser workflow uses deterministic local signal fixtures and the
browser-safe demo provider configuration by default. No external credentials
are bundled into the application.

## Testing

```bash
pnpm nx test signal-system
pnpm nx lint signal-system
pnpm nx build signal-system
```

The tests cover workflow rendering, signal selection, CI provenance/freshness
mapping, and Accept/Defer/Escalate human decision capture.

## Known Limitations

- Signal records are deterministic local fixtures; the browser does not call a
  CI vendor directly.
- Human decisions are application-local and in-memory.
- The Signal API currently exposes a separate fixture-backed read contract; the
  browser integration remains deferred until a future reviewed brick.
- Authentication, collaboration, notifications, persistence, automation, and
  enterprise scope are outside the current PRD-07 release.

## Related Documentation

- [PRD-07](../../docs/product/mini-prds/prd-07.md)
- [Active Engineering Brick](../../docs/engineering/active-brick.md)
- [Architecture Standards](../../docs/engineering/architecture-standards.md)
- [Engineering Review Gate](../../docs/engineering/engineering-review-gate.md)
