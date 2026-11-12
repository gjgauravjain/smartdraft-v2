# Architecture Guidelines

This codebase should follow these standards for maintainability and consistency.

## Forms

- Use `react-hook-form` for all non-trivial forms.
- Keep form schema, defaults, and value types in small form-specific files.
- Use common form fields from `components/common/fields`:
  - `FormTextField`
  - `FormSelectField`
  - `FormRadioGroup` (when needed)
- Keep validation close to the form schema and keep submit handlers minimal.

## API and Data Fetching

- Use React Query hooks for API reads and writes.
- Keep raw HTTP logic inside API layer hooks, not inside UI components.
- Handle success/error UI via consistent toasts and query invalidation patterns.

## Component Design

- Build small focused components with single responsibility.
- Keep container/orchestrator logic separate from presentational components.
- Pass only required props; avoid over-coupled interfaces.
- Declare React components and local helpers with **`const` arrow functions**, not `function` declarations.
  - Example: `export const PriorityPickFields = (props) => { ... }`
- Keep **orchestrator** files thin (modal shell, preview switch, main fields layout). They should mostly wire hooks, layout, and child components.
- When a file grows large, **split presentational UI** into sibling files in the same feature folder (e.g. `PriorityPickPreviewParts.tsx`, `PriorityPickFieldSections.tsx`). Reserve the top-level file for branching and composition only.
- Use **early returns** for conditional rendering instead of nested ternaries in JSX.

## Utilities

- Put reusable **pure functions** in the feature’s `util.ts` (or localized `utils.ts`), including:
  - Validation schemas and default form values
  - Request/display payload builders
  - Option builders for selects
  - Formatters and derived values
  - **CSS class helpers** that only depend on inputs (e.g. mobile vs desktop grid classes, chip styles)
- Do **not** leave pure helpers in `.tsx` files when they can live in `util.ts`.
- Keep business logic out of JSX when possible.
- Prefer small named helpers with early returns over inline complex expressions.
- Shared helpers used across multiple features belong in `lib/util`, not in a single component’s `util.ts`.

## Feature Folder Layout

For non-trivial flows (e.g. transaction modals), prefer this shape:

- `ComponentModal.tsx` — open/close, mobile sheet vs desktop dialog, form wrapper
- `hook.ts` — form state, queries, mutations, submit
- `type.ts` — local types and form value types
- `util.ts` — schemas, defaults, pure helpers
- `*Fields.tsx` — main form fields and preview slot
- Optional `*Parts.tsx` / `*Sections.tsx` — extracted sub-UI used by one parent

## Coding Quality

- Follow existing design tokens and theme-aware classes for dark/light mode.
- Keep files readable with clear naming and concise function boundaries.
- Reuse shared primitives first before creating one-off UI patterns.
