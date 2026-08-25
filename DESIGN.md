# Design Standards

## Mobile Dialog Pattern

All dialogs must be mobile friendly.

- On mobile, dialogs should open as a bottom slider sheet (anchored to bottom), not full-screen by default.
- Reuse this class pattern for `DialogContent` in mobile contexts:
  - `max-sm:max-w-none max-sm:w-full max-sm:h-auto`
  - `max-sm:max-h-[85dvh] max-sm:rounded-t-2xl max-sm:rounded-b-none`
  - `max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:bottom-0`
  - `max-sm:translate-x-0 max-sm:translate-y-0`
- Keep desktop dialog layouts unchanged unless product design requires otherwise.

## Dark and Light Mode Rule

Before creating or updating any component styles:

- Review `app/globals.css` tokens first.
- Use design tokens (`bg-card`, `text-foreground`, `border-border`, `bg-muted`, etc.) instead of hardcoded colors.
- Ensure component visuals are readable and consistent in both light and dark themes.

## Form and Data Conventions

- Use shared common fields from `components/common/fields`.
- Use `react-hook-form` for form state and validation handling.
- Use React Query hooks for API fetch/mutation flows.

## Component Architecture

- Keep components small and focused.
- Keep reusable pure logic in `utils.ts` files.
- Prefer composition over large monolithic components.
