# Signal API

The Signal API is the server-side boundary for the PRD-07 Signal System. This
project currently exposes a minimal, fixture-backed read contract so the
browser application can be developed against a server boundary without adding
vendor credentials, external CI calls, or persistence.

## Architectural Role

The API is a server-only application boundary. It is intentionally separate
from the browser Signal System and is the future home for reviewed external
integration adapters and protected credentials.

The current implementation is limited to deterministic CI fixture data. It
binds to `127.0.0.1` by default; only the local port can be changed with
`SIGNAL_API_PORT`.

## Contract

`GET /api/signals` returns a JSON response containing fixture-backed signals
with status, ownership, confidence, and CI provenance/freshness metadata.

Other routes return `404`. The current endpoint performs no writes, persistence,
polling, background processing, vendor calls, or signal mutation.

## Usage

From the repository root:

```bash
pnpm nx serve signal-api
pnpm nx build signal-api
```

The development server uses port `4300` by default. Set `SIGNAL_API_PORT` for a
different local port.

## Testing

```bash
pnpm nx test signal-api
pnpm nx lint signal-api
```

The tests cover the read contract, provenance/freshness fields, and unsupported
route behavior.

## Known Limitations

- The API is fixture-backed and does not connect to a CI vendor.
- External credentials are not accepted or stored.
- There is no persistence, authentication, polling, event streaming, or retry
  orchestration.
- External CI integration requires a separate reviewed engineering brick.

## Related Documentation

- [PRD-07](../../docs/product/mini-prds/prd-07.md)
- [Active Engineering Brick](../../docs/engineering/active-brick.md)
- [Repository Blueprint](../../docs/engineering/repository-blueprint.md)
- [Engineering Review Gate](../../docs/engineering/engineering-review-gate.md)
