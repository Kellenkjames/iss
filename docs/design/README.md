# Design Documentation

Design documentation describes the product context, design principles, and maintained visual language for ISS.

- [Design Kickoff Package](design-kickoff-package.md)
- [Design Partner Charter](design-partner-charter.md)

## Future Platform Design Opportunities

These opportunities are recorded for future planning and are not part of the
current PRD-06 engineering brick.

### Shared Eyebrow Pattern

Evaluate a consistent contextual eyebrow for visible ISS applications, using
the current `ISS / PRD-06` treatment as the reference example. Define the
typography, spacing, contrast, and naming guidance once, while leaving the
contextual label owned by each application.

Recommended scope: a low-risk design-system guidance update that can be
adopted incrementally by the Shell, Interpretation Engine, and later apps.

### Theme Support

Plan a light and dark theme capability at the Design Tokens and Component
Kernel layers. The work should define semantic dark-theme mappings, contrast
requirements, system preference handling, user override behavior, and
application adoption without introducing application-specific palettes.

Recommended scope: a dedicated cross-cutting platform brick. Engineering
review is required because theme tokens and runtime behavior affect all
platform consumers.
