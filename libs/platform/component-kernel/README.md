# @iss/component-kernel

Shared interaction primitives for ISS implemented as Lit Web Components.

## Components

- `iss-button`
- `iss-input`

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
