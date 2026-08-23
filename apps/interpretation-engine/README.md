# ISS Interpretation Engine

The Interpretation Engine is the first dedicated PRD-06 reference application. It demonstrates one narrow AI-assisted interpretation workflow: a user supplies structured context and receives a concise interpretation while retaining human judgment.

## Architectural Role

This application is a thin consumer of the existing ISS platform. The UI owns interaction state and presentation. Its local interpretation service owns domain intent and delegates AI execution through `@iss/ai-provider`. Browser telemetry is supplied through `@iss/telemetry/browser` at the application boundary.

It is distinct from `apps/shell`: the shell proves platform composition, while this application demonstrates a focused AI-native interaction.

## Dependencies

- `@iss/design-tokens`
- `@iss/component-kernel`
- `@iss/ai-provider`
- `@iss/telemetry/browser`
- Angular and TypeScript

## Usage

```bash
pnpm nx serve interpretation-engine
```

The browser uses the explicit offline `demo-key` configuration by default. Real credentials are not bundled into this application.

## Testing

```bash
CI=1 pnpm nx test interpretation-engine
CI=1 pnpm nx lint interpretation-engine
CI=1 pnpm nx build interpretation-engine
```

## Known Limitations

- This is a narrow reference workflow, not a general analytics or reporting product.
- It does not persist source records, provide charts, authenticate users, or execute workflows.
- The UI consumes the existing interpretation contract and does not expose provider or telemetry implementation details.

## Related Documentation

- [PRD-06](../../docs/product/mini-prds/prd-06.md)
- [Active Engineering Brick](../../docs/engineering/active-brick.md)
- [EB-024 Interpretation Service Consumer](../../docs/engineering/archive/engineering-bricks/EB-024-INTERPRETATION-SERVICE-CONSUMER.md)
- [Architecture Standards](../../docs/engineering/architecture-standards.md)
