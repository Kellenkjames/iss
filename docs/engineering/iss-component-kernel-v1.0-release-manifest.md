# ISS Component Kernel v1.0 Release Manifest

## 1. Release Status

```text
Version: 1.0
Status: Stable Candidate — Pending Human Approval
```

This manifest records the final EB-014 Pass 3 validation state. It does not represent human approval, a commit, or a published release.

## 2. Purpose

The ISS Component Kernel is the framework-independent shared UI foundation for ISS applications. It provides Lit Web Components with native interaction semantics, accessibility behavior, stable public contracts, and Design Token consumption without application-specific orchestration.

## 3. Architecture

- Lit-based TypeScript Web Components
- Direct Angular consumption through native custom elements
- Canonical Design Token dependency
- Duplicate-safe `defineIssX()` helpers and aggregate `registerIssComponents()` registration
- Dependency direction:

```text
design-tokens
      ↑
component-kernel
      ↑
shell
```

The Kernel contains no Angular application code, application services, network behavior, persistence, routing, forms architecture, or business-domain orchestration.

## 4. Component Inventory

| Component | High-level purpose |
|---|---|
| `iss-button` | Native button action primitive |
| `iss-input` | Labeled single-line text entry |
| `iss-badge` | Non-interactive semantic status marker |
| `iss-card` | Structural content container with optional single-action mode |
| `iss-state` | Empty, loading, and error state presentation |
| `iss-table` | Semantic tabular record presentation with sorting |
| `iss-checkbox` | Native binary and indeterminate selection |
| `iss-select` | Single and multi bounded-option selection |
| `iss-drawer` | Controlled right-edge contextual detail/edit surface |
| `iss-filter-bar` | Controlled aggregate search and filter criteria |
| `iss-radio` | Native same-name single-choice selection |

Public component count: **11**.

## 5. Public Contract Freeze

The v1 component set and public contracts are frozen pending human approval.

Pass 2 introduced no new public components, properties, events, exported infrastructure, or external dependencies. Interactive Card uses native click semantics and does not emit `cardClick`. Kernel controls are not Form-Associated Custom Elements in v1.0.

## 6. Validation Baseline

The following values are the successful Pass 3 baseline:

```text
Public components:          11
Kernel spec files:          13
Kernel tests:               153
Kernel test failures:       0
Kernel test skips:          0
Invalid Design Tokens:      0
Full validation chain:      8/8 PASS
Nx project count:           3
```

The Component Kernel v1.0 Regression Baseline is **13 spec files and 153 passing tests**.

## 7. Composition Evidence

Three representative composition proofs pass in the Kernel composition spec:

- **Data:** `iss-filter-bar` emits normalized state; consumer-owned logic derives rows; `iss-table` receives external rows; empty results are represented through `iss-state`.
- **Detail/Edit:** `iss-drawer` contains Input, Select, Checkbox, Radio, and Button controls; initial focus, nested interaction, controlled close, and focus restoration are verified.
- **Content:** default `iss-card` contains `iss-badge` and `iss-button`; the Button remains independently operable.

No filtering logic was moved into the Kernel and no application workflow was added.

## 8. Accessibility Posture

- Native semantic foundations are used for buttons, inputs, checkboxes, radios, and table sorting controls.
- Labels and native controls are associated through generated IDs or native label structure.
- Disabled, readonly, checked, mixed, selected, and invalid states are exposed through native semantics and appropriate ARIA.
- Drawer uses dialog semantics, title association, focus entry, focus containment, Escape handling, scrim/close controls, focus restoration, inert inactive content, and reduced-motion handling.
- System State exposes busy and error announcement semantics without unnecessary live behavior for empty states.
- Table uses native table structure, `scope="col"`, and `aria-sort` without conflicting `aria-pressed` state.
- No formal WCAG certification is claimed by this manifest.

## 9. Known Limitations

- Same-name `iss-radio` instances in independent Shadow DOM roots do not receive browser-native ArrowUp/ArrowDown/ArrowLeft/ArrowRight group navigation across component boundaries.
- This limitation is bounded to cross-shadow arrow navigation. Labels, focusability, Space activation, same-name mutual exclusion, group isolation, lifecycle cleanup, dynamic names, deterministic external checked convergence, host/native synchronization, and exactly-once change behavior are covered by tests and runtime evidence.

## 10. Intentional Design-Spec Deviations

### Card Event

Historical design material contains a `cardClick` example. The final v1 implementation uses native click semantics from one internal interactive surface and does not expose a custom `cardClick` event.

Reason:

- Native semantics satisfy the demonstrated interaction contract.
- No application requirement justifies an additional custom event before v1 freeze.
- Avoiding a second event preserves a smaller and more predictable public API.

### Input Form Participation

Historical design material references `ElementInternals` form participation. The final v1 implementation exposes component-level state, native internal semantics, and public events, but does not implement Form-Associated Custom Elements.

Reason:

- Form association would establish a broader forms architecture.
- No demonstrated v1 application requirement justified that expansion.
- `ElementInternals`, form submission, validation integration, and Angular forms/CVA remain deferred.

## 11. Deferred Capabilities

The following remain outside Kernel v1.0:

- Radio Group and custom cross-shadow arrow coordination
- Form-Associated Custom Elements and Angular wrappers/CVA
- Modal or confirmation-dialog architecture
- Alert, Tabs, Tooltip, Dropdown distinct from Select, Spinner, and standalone Skeleton
- Drawer dirty-state confirmation
- Table selection and pagination
- Generalized overlay or forms frameworks
- Storybook

Their absence is intentional and is not an EB-014 release defect.

## 12. Change Policy

After v1.0 approval, changes to frozen Component Kernel public contracts require a demonstrated application requirement, accessibility defect, or platform defect.

Implementation cleanup that preserves public contracts may still occur through normal engineering review.

## 13. Approval

```text
Engineering Validation: Complete
Human Approval: Pending
Release State: Stable Candidate
```
