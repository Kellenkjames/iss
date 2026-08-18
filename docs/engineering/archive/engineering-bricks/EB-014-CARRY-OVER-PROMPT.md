# EB-014 Carry-Over Prompt: Component Kernel v1.0 Closure

## Summary

The ISS Component Kernel v1.0 has been validated, frozen, and approved for production use. This document establishes what is now stable infrastructure and defines the architectural boundary for all future application development.

## What Was Completed

### Design Tokens (PRD-01) — Validated v1.0 Foundation

The Design Tokens package provides the canonical visual language for ISS. It is complete and stable.

**Status:** Validated v1.0 Foundation

**Delivery:**

- 60+ semantic design tokens exported as CSS custom properties (`--iss-*`)
- Token categories: colors (semantic + status), typography (6 scales), spacing, elevation, motion, radius, layout/grid, opacity
- Framework-independent contract: Lit and Angular consume the same tokens
- No theme engine, runtime switching, or database

**Consumption:**

Applications consume tokens through:

```css
color: var(--iss-color-text-primary);
padding: var(--iss-space-3);
border-radius: var(--iss-radius-2);
```

The token contract is:

```text
design-tokens (root)
      ↓
All downstream projects
```

No downstream project should define its own foundational visual primitives. All visual consistency originates from this package.

**Guarantee:**

Design Tokens will evolve to support demonstrated architectural needs (e.g., additional semantic colors, responsive breakpoints), but only through formal change process documented in PRD-01.

### Component Kernel (PRD-02) — Frozen v1.0

The Intelligent Component Kernel provides 11 reusable Web Components as the shared interaction foundation for ISS. The v1.0 public contract is frozen following human approval.

**Status:** Frozen v1.0 — Human Approved

**Validated Inventory (11 public components):**

| Component | Purpose | Scope |
|---|---|---|
| `iss-button` | Native button action primitive | Primary, secondary, tertiary, destructive variants; loading and disabled states |
| `iss-input` | Labeled text entry | Single-line input types plus opt-in multiline text; error/success/helper states |
| `iss-badge` | Non-interactive semantic status marker | Neutral, success, warning, danger, info tones |
| `iss-card` | Structural content container | Default (non-interactive) and interactive (single-action) variants |
| `iss-state` | Empty, loading, error state presentation | Canonical shared rendering across content regions |
| `iss-table` | Semantic tabular record presentation | Native semantic structure; sortable headers; variant: default/compact |
| `iss-checkbox` | Native binary and indeterminate selection | Checked, indeterminate, disabled states; independent operation |
| `iss-select` | Bounded-option selection | Single and multi-selection variants; keyboard accessible listbox |
| `iss-drawer` | Controlled right-edge contextual surface | View and edit variants; focus management; Escape/scrim close; focus restoration |
| `iss-filter-bar` | Controlled aggregate search and filter criteria | Normalized state emission; consumer-owned filtering logic |
| `iss-radio` | Native same-name single-choice selection | Same-name mutual exclusion; dynamic name coordination |

**Registration:**

All components are registered through:

```ts
import '@iss/component-kernel/register';
```

or individually:

```ts
import { defineIssRadio } from '@iss/component-kernel';
defineIssRadio();
```

**Consumption from Angular:**

```html
<iss-button variant="primary" (click)="onAction()">
  Action
</iss-button>

<iss-drawer [open]="isOpen" (closed)="onClosed()">
  <h2 slot="header">Detail</h2>
  <iss-input label="Name"></iss-input>
</iss-drawer>

<iss-table [columns]="columns" [rows]="rows" (sort)="onSort($event)">
</iss-table>
```

**Validation Baseline:**

```text
13 spec files, 153 passing tests
Full validation chain: 8/8 PASS
Clean Nx dependency graph
Clean Design Token audit
Representative composition proofs
```

**Architecture Guarantees:**

1. **Framework-independent:** Components are native custom elements. They work with Angular, plain JavaScript, and other frameworks without wrappers.

2. **Accessibility-first:** Every component uses native semantic HTML, ARIA where appropriate, and keyboard support.

3. **Design Token consumption:** All visual styling derives from `--iss-*` tokens. No raw values exist in component CSS.

4. **Controlled components:** Kernel components do not own application data. They emit events and accept controlled state from the application.

5. **Stable public contract:** Public properties, events, slots, and exported types are frozen. Breaking changes require an ADR.

6. **Composition-ready:** Components compose with each other without creating architectural debt. Three representative composition proofs are included in the spec.

## What Is Intentionally Frozen (Not Deferred, Not Available)

### Card Event

- **Requested:** `cardClick` event on interactive Card
- **Decision:** Implemented as native click semantics from one internal button
- **Reason:** Native semantics satisfy the interaction contract; no application requirement justified an additional custom event before v1 freeze

### Input Form Participation

- **Requested:** Form-Associated Custom Elements with `ElementInternals`
- **Decision:** Exposes component-level state, native internal semantics, and public events only
- **Reason:** Form association would require broader forms architecture; no demonstrated v1 requirement justified expansion

### Cross-Shadow Radio Arrow Navigation

- **Limitation:** Same-name radios in independent Shadow DOM roots do not receive browser-native arrow-key coordination
- **Covered:** Labels, focusability, Space activation, same-name mutual exclusion, group isolation, lifecycle cleanup, dynamic names, deterministic checked convergence, host/native synchronization
- **Reason:** Intentionally bounded; custom cross-shadow coordination is deferred to v2

## What Is Intentionally Deferred (Outside v1.0)

The following are out of scope and remain deferred until demonstrated architectural need:

- Radio Group and custom cross-shadow arrow-key coordination
- Form-Associated Custom Elements and Angular ControlValueAccessor wrappers
- Modal or confirmation-dialog architecture
- Alert, Tabs, Tooltip, Dropdown distinct from Select, Spinner, standalone Skeleton
- Drawer dirty-state confirmation
- Table selection and pagination
- Generalized overlay or forms frameworks
- Storybook and component documentation infrastructure

**Reasoning:** These capabilities are intentionally excluded to preserve architectural clarity and prevent scope creep. When application development demonstrates a need for any deferred capability, the architectural assumption is that the Kernel—not the application—should evolve to meet it.

## Architectural Boundaries Established

The stable architecture is now:

```text
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (Workflows, Business Logic, State)     │
│  PRD-03 (Telemetry)                     │
│  Future Application Bricks              │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│    Intelligent Component Kernel v1.0    │
│  (11 Stable Reusable UI Components)     │
│  ✓ Frozen public contract               │
│  ✓ Native semantics + accessibility     │
│  ✓ Design Token consumer                │
│  ✓ No business logic                    │
│  ✓ Composition-proven                   │
└──────────────────┬──────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│     Design Tokens v1.0 Foundation       │
│  (Semantic Colors, Typography, etc.)    │
│  ✓ Validated visual language            │
│  ✓ Framework-agnostic CSS properties    │
│  ✓ Single source of truth               │
└─────────────────────────────────────────┘
```

**Key assumption:** The Kernel boundary is sealed. Applications do not implement their own foundational UI primitives. They compose Kernel components into application-specific interfaces.

## How to Use the Frozen Kernel

### 1. Register Components

At application startup, ensure components are registered:

```ts
import '@iss/component-kernel/register';
```

### 2. Consume in Templates

Use components as native custom elements:

```html
<iss-button variant="primary" (click)="onAction()">
  Analyze
</iss-button>
```

### 3. Understand Controlled State

Kernel components are controlled by the application:

```ts
// Application owns the state
@property() isDrawerOpen = false;
@property() tableRows = [];

// Kernel emits requests; application decides
onDrawerClosed() {
  this.isDrawerOpen = false;  // Application chooses to close
}

onTableSort(event: CustomEvent<IssTableSortDetail>) {
  const { key, direction } = event.detail;
  this.sortedRows = sortBy(this.tableRows, key, direction);
}
```

### 4. Leverage Composition

Compose multiple components into application workflows:

```html
<iss-filter-bar [filters]="filters" [state]="filterState" (change)="onFilterChange($event)">
</iss-filter-bar>

<iss-table [columns]="columns" [rows]="filteredRows" (sort)="onSort($event)">
</iss-table>

<iss-state *ngIf="filteredRows.length === 0" status="empty" message="No records match.">
</iss-state>
```

### 5. Use Design Tokens

All custom styling consumes tokens:

```css
.my-container {
  color: var(--iss-color-text-primary);
  padding: var(--iss-space-4);
  background: var(--iss-color-surface-1);
  border-radius: var(--iss-radius-2);
}
```

## Change Policy for the Frozen Kernel

After v1.0 approval, public contract changes require one of:

1. **Demonstrated application requirement:** A new feature in an ISS application needs component capability not currently available.
2. **Accessibility defect:** A component fails WCAG or introduces a11y regression.
3. **Platform defect:** A component has a runtime bug or architectural blocker.

**Implementation cleanup** that preserves public contracts may occur through normal engineering review without requiring a formal change process.

**Example:** A component's internal implementation is refactored for performance without changing public properties, events, or slots. This is acceptable.

**Counter-example:** Adding a new public property or changing an event signature requires justification through application demand.

## What This Enables for PRD-03 and Beyond

With the Kernel frozen and Design Tokens stable, the next phase can proceed with confidence:

1. **Telemetry (PRD-03)** can instrument all AI interactions without concern for UI-layer changes.
2. **Applications** can build on a reliable, tested foundation without worrying about component API churn.
3. **New bricks** can be added without re-architecting UI infrastructure.
4. **Teams** can move independently: Application teams consume Kernel; infrastructure teams maintain Kernel only when application demand justifies it.

## Documentation References

- [ISS Component Kernel v1.0 Release Manifest](../../iss-component-kernel-v1.0-release-manifest.md)
  - Complete validation results
  - Known limitations
  - Intentional design-spec deviations
  - Deferred capabilities
  - Change policy

- [PRD-01: Design Tokens](../../../product/mini-prds/prd-01.md)
  - Design Tokens responsibilities and scope
  - Validated token categories
  - Framework-agnostic contract

- [PRD-02: Intelligent Component Kernel](../../../product/mini-prds/prd-02.md)
  - Kernel mission and architecture
  - 11-component inventory
  - Non-responsibilities and deferred features
  - Success criteria

## Key Takeaway

The ISS Component Kernel v1.0 is a **frozen, stable, production-ready foundation**. It is not a starting point for future work; it is the reliable ground upon which future work is built.

Applications should assume:

- The 11 components will remain available with their current public contracts.
- Design Tokens provide the visual foundation; no application needs a custom theme.
- Architectural focus shifts from infrastructure to application logic and AI integration.
- Any need for new foundational UI primitives is a signal that the Kernel should evolve, not that the application should create local solutions.

The next phase begins with infrastructure for observability (PRD-03: Telemetry) and application-level workflows, not with UI or component infrastructure.
