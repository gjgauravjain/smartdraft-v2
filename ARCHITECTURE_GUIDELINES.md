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

## Utilities

- Put reusable pure functions in `util.ts` or localized `utils.ts` files.
- Keep business logic out of JSX when possible.
- Prefer small named helper functions over inline complex expressions.

## Coding Quality

- Follow existing design tokens and theme-aware classes for dark/light mode.
- Keep files readable with clear naming and concise function boundaries.
- Reuse shared primitives first before creating one-off UI patterns.
