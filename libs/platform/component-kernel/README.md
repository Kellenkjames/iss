# @iss/component-kernel

Shared interaction primitives for ISS implemented as Lit Web Components.

## Components

- `iss-button`
- `iss-input`
- `iss-badge`
- `iss-card`
- `iss-state`

## Registration

Register kernel elements once at application startup:

```ts
import { registerIssComponents } from '@iss/component-kernel';

registerIssComponents();
```

You can also import the side-effect entry point:

```ts
import '@iss/component-kernel/register';
```

## `iss-button` API

Purpose: trigger one immediate, named user action.

Properties and attributes:

- `variant`: `primary | secondary | tertiary | destructive` (reflected)
- `disabled`: boolean (reflected)
- `loading`: boolean (reflected)
- `type`: `button | submit | reset` (reflected)

Slots:

- default slot: action label/content
- `leading-icon`
- `trailing-icon`

Accessibility behavior:

- Uses native `<button>` semantics
- Applies visible 2px `focus-visible` ring
- Disabled and loading states map to native disabled behavior
- Loading sets `aria-busy="true"`
- Icon-only usage supports `aria-label` on `<iss-button>`

## Usage

```html
<iss-button variant="primary">Run analysis</iss-button>
```

## `iss-input` API

Purpose: single-line text entry primitive for forms, search, filters, and inline editing.

Properties and attributes:

- `variant`: `default | search | inline` (reflected)
- `label`: string
- `value`: string
- `disabled`: boolean (reflected)
- `readOnly` / `readonly`: boolean (attribute reflected as `readonly`)
- `error`: string
- `success`: boolean (reflected)
- `helper`: string
- `name`: string
- `placeholder`: string
- `type`: `text | search | email | url | tel | password` (reflected)
- `required`: boolean (reflected)

States:

- default
- focus
- filled
- disabled
- readonly
- error
- success

Accessibility behavior:

- Uses native `<input>` semantics
- Always renders a visible `<label>` associated via `for`/`id`
- Error state maps to `aria-invalid="true"`
- Helper or error message links through `aria-describedby`
- Search variant clear control is keyboard accessible with an explicit accessible name

Events:

- Standard `input` and `change` events are observable from consumers.

Usage:

```html
<iss-input
	label="Case ID"
	variant="search"
	helper="Type to filter"
></iss-input>
```

## `iss-badge` API

Purpose: compact, named status marker — the primary carrier of ISS semantic status colors.

Non-interactive. Never a button, link, or actionable element.

Properties and attributes:

- `tone`: `neutral | success | warning | danger | info` (reflected, default: `neutral`)

Slots:

- default slot: visible status label text

Accessibility behavior:

- Visible text in the default slot is the primary status signal; color reinforces but never replaces it
- No `role`, `aria-live`, or `role="status"` applied by default — badge text is persistent record state, not a live announcement
- Component does not infer or generate label text from `tone`; the consumer is responsible for supplying a meaningful label

Usage:

```html
<iss-badge tone="warning">Needs review</iss-badge>
<iss-badge tone="danger">Blocked</iss-badge>
<iss-badge tone="success">Active</iss-badge>
<iss-badge tone="info">In progress</iss-badge>
<iss-badge>Neutral</iss-badge>
```

## `iss-card` API

Purpose: structural container for grouping related content and actions into a reusable visual unit.

Properties and attributes:

- `variant`: `default | interactive` (reflected, default: `default`)

Slots:

- `header`: consumer-supplied header content, including multiple nodes
- default slot: consumer-supplied body content
- `footer`: consumer-supplied footer content

Accessibility behavior:

- The default variant remains a non-interactive container.
- The interactive variant uses a native `<button>` as the card action surface.
- Interactive cards expose native keyboard and click semantics without introducing link/navigation behavior.

Usage:

```html
<iss-card>
  <span slot="header">Case OPS-001</span>
  <iss-badge slot="header" tone="warning">Needs review</iss-badge>
  <p>Signal requires review.</p>
  <iss-button slot="footer" variant="primary">Review</iss-button>
</iss-card>
```

## `iss-state` API

Purpose: canonical shared rendering for Empty, Loading, and Error states across content regions.

Properties and attributes:

- `status`: `empty | loading | error` (reflected, default: `empty`)
- `message`: string
- `actionLabel` / `action-label`: string (optional)

Behavior:

- Unsupported or missing `status` values normalize to `empty`
- `empty` and `error` can render one optional action when `actionLabel` is provided
- `loading` never renders an action
- Action activation dispatches one `action` event (`bubbles: true`, `composed: true`)

Accessibility behavior:

- Loading region exposes `aria-busy="true"`
- Error message is announced via live-region semantics
- Empty state does not add live-region behavior

Usage:

```html
<iss-state
  status="empty"
  message="No records match the current filters."
  action-label="Clear filters"
></iss-state>
```
