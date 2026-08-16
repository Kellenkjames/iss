# @iss/component-kernel

Shared interaction primitives for ISS implemented as Lit Web Components.

## Components

- `iss-button`
- `iss-input`
- `iss-badge`
- `iss-card`
- `iss-state`
- `iss-table`
- `iss-checkbox`
- `iss-select`
- `iss-filter-bar`

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

## `iss-filter-bar` API

Purpose: expose and edit normalized search and Select-based filter criteria without performing data filtering.

Properties:

- `filters`: `IssFilterDefinition[]`, where each definition is `{ key: string; label: string; options: IssSelectOption[]; mode?: 'single' | 'multi' }`
- `state`: `IssFilterState`, shaped as `{ search: string; selections: Record<string, string[]> }`
- `searchLabel`: visible Search Input label; an empty string omits Search Input rendering

Defaults:

```ts
filters = [];
state = { search: '', selections: {} };
searchLabel = '';
```

Behavior:

- Missing or unsupported filter modes normalize to `single`.
- Single and multi selections are represented as string arrays.
- Empty selection keys are omitted from normalized state.
- External state replacement synchronizes the internal Search Input and Select controls.
- Applied criteria render as private removable pills using filter and option labels.
- Clear all resets state to `{ search: '', selections: {} }` and is visible only while criteria are active.

Events:

- `change`: one bubbling, composed aggregate event per normalized user state change. Read the current normalized state from `event.target.state`; state is not duplicated in event detail.

The component composes `iss-input`, `iss-select`, and `iss-button`. It does not filter application data, fetch data, build queries, persist state, or provide date-range or loading behavior.

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

## `iss-select` API

Purpose: choose one or several values from a bounded, named option set.

Properties:

- `variant`: `single | multi` (reflected, default: `single`)
- `label`: visible field label
- `options`: `IssSelectOption[]`, where each option is `{ value: string; label: string }`
- `value`: single-selection value
- `values`: multi-selection values
- `placeholder`: trigger text when there is no matching selection
- `disabled`: boolean (reflected)
- `error`: error message

Selection state is read from the host properties. Single selection closes after one choice; multi selection toggles membership and remains open. Both variants emit one composed, bubbling standard `change` event per selection action.

Accessibility behavior:

- Uses a native button trigger with `aria-expanded` and `aria-haspopup="listbox"`
- Uses an in-shadow-root `listbox` with `option` children and `aria-selected`
- Multi-select exposes `aria-multiselectable="true"`
- Keyboard navigation uses Enter, Space, ArrowUp, ArrowDown, Escape, and Tab
- Error text is associated with the trigger through `aria-describedby`

Usage:

```html
<iss-select
  label="Case status"
  [options]="options"
  [value]="selectedValue"
></iss-select>
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

## `iss-table` API

Purpose: canonical semantic table for structured record lists.

Properties and attributes:

- `variant`: `default | compact` (reflected, default: `default`)
- `columns`: `ColumnDef[]`
- `rows`: `Record<string, unknown>[]`
- `sortKey`: string (optional)
- `sortDirection` / `sort-direction`: `none | ascending | descending` (reflected, optional)
- `emptyMessage` / `empty-message`: string (optional)

Public types:

- `ColumnDef`: `{ key: string; label: string; sortable?: boolean }`
- `IssTableRow`: `Record<string, unknown>`
- `IssTableSortDetail`: `{ key: string; direction: 'none' | 'ascending' | 'descending' }`

Behavior:

- Renders native semantic table structure (`table`, `thead`, `tbody`, `th`, `td`)
- Sortable headers render native buttons and emit exactly one `sort` event per activation
- The `sort` event bubbles and is composed
- The component never mutates or reorders consumer-supplied `rows`
- When `rows` is empty, table reuses `iss-state` with `status="empty"`

Accessibility behavior:

- Header cells use `scope="col"`
- Sort state is exposed via `aria-sort` on sortable header cells
- Sort interaction uses keyboard-operable native button controls

Usage:

```html
<iss-table></iss-table>
```

## `iss-checkbox` API

Purpose: independent binary selection with native checkbox semantics.

Properties and attributes:

- `checked`: boolean (reflected)
- `indeterminate`: boolean (reflected; applied to the native checkbox property)
- `disabled`: boolean (reflected)

Slots:

- default slot: visible checkbox label/content

Behavior:

- Uses a native `<input type="checkbox">` inside the component.
- The checked state is consumer-controlled and updates from native user interaction.
- Indeterminate state is consumer-controlled and is synchronized with the native checkbox property; native activation may clear it.
- Disabled state maps to native checkbox behavior and applies the documented 50% opacity treatment.
- Standard `change` events are observable at the custom-element boundary.

Accessibility behavior:

- The visible default-slot content participates in a native label/input association.
- Native keyboard, checked, indeterminate, and disabled semantics are preserved.
- Focus-visible styling is provided on the custom control.

Usage:

```html
<iss-checkbox>Include archived records</iss-checkbox>
<iss-checkbox checked>Selected record</iss-checkbox>
<iss-checkbox indeterminate>Select all records</iss-checkbox>
```
