# Signal API

The Signal API is the server-side boundary for the PRD-07 Signal System. This
project exposes a minimal read contract with server-side GitHub Actions
retrieval when configured and deterministic fixture mode for local development.

## Architectural Role

The API is a server-only application boundary. It is intentionally separate
from the browser Signal System and is the future home for reviewed external
integration adapters and protected credentials.

The API binds to `127.0.0.1` by default; only the local port can be changed with
`SIGNAL_API_PORT`.

## Contract

`GET /api/signals` returns signals with status, ownership, confidence, and CI
provenance/freshness metadata. With `GITHUB_TOKEN` and `GITHUB_REPOSITORY`
configured, the server reads one latest GitHub Actions workflow run. Without
those values in local development, it returns deterministic fixture signals.

Other routes return `404`. The current endpoint performs no writes, persistence,
polling, background processing, vendor calls, or signal mutation.

## Usage

From the repository root:

```bash
pnpm nx serve signal-api
pnpm nx build signal-api
```

The development server uses port `4300` by default. Set `SIGNAL_API_PORT` for a
different local port. GitHub mode uses server-only `GITHUB_TOKEN` and
`GITHUB_REPOSITORY` values; production misconfiguration returns a sanitized
`503`.

## Testing

```bash
pnpm nx test signal-api
pnpm nx lint signal-api
```

The tests cover fixture mode, GitHub mapping, provenance/freshness fields,
unauthorized and malformed responses, production configuration failure, and
unsupported route behavior.

## Known Limitations

- GitHub access is limited to one read-only workflow-runs request per API call.
- External credentials are read only by the server runtime and are not accepted
  from browser requests or stored by the application.
- There is no persistence, authentication, polling, event streaming, or retry
  orchestration.
- Browser integration with the API remains a separate reviewed implementation
  step.

## GitHub Integration

PRD-07 Brick 4 implements a read-only GitHub Actions workflow-run integration.
It uses native server-side `fetch`, strict response validation, bounded retry
behavior, and deterministic fixture fallback for local development.

See [PRD-07 Brick 4 design specification](../../docs/engineering/prd-07-brick-4-github-actions-integration.md)
for the approved contract and implementation boundaries.

## Related Documentation

- [PRD-07](../../docs/product/mini-prds/prd-07.md)
- [Active Engineering Brick](../../docs/engineering/active-brick.md)
- [Repository Blueprint](../../docs/engineering/repository-blueprint.md)
- [Engineering Review Gate](../../docs/engineering/engineering-review-gate.md)
