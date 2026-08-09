# @iss/component-kernel

Shared interaction primitives for ISS implemented as Lit Web Components.

## Components

- `iss-button`

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
