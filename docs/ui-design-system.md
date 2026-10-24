# The Wild Oasis UI design system

The design system lives in `app/styles/globals.css`. Keep the existing alpine
palette and square-edged, quiet visual style when adding or updating screens.
Use the shared tokens and component classes below instead of repeating
component-specific colors and interaction states.

## Foundations

| Token | Purpose |
| --- | --- |
| `canvas` | Deepest page and inset-surface background |
| `surface` | Default raised content surface |
| `surface-raised` | Stronger separation for nested content |
| `border` | Default divider and surface border |
| `content` | Primary text |
| `content-muted` | Supporting text |
| `content-subtle` | Hints and tertiary text |
| `action` / `action-hover` | Warm accent and hover emphasis |
| `danger` | Destructive or validation feedback |

The original `primary-*` and `accent-*` color scales remain available for
specialized layouts and gradual migration. Panels and controls intentionally
have square corners; the spacing scale follows Tailwind's default 4px rhythm.

## Components

| Class | Use |
| --- | --- |
| `ui-page-title` | Primary page heading |
| `ui-eyebrow` | Short uppercase section label |
| `ui-card` / `ui-card--raised` | Standard and inset content panels |
| `ui-field` / `ui-field__label` | Form label and field caption |
| `ui-input` | Text, date, select, and textarea controls |
| `ui-button ui-button--primary` | Main action |
| `ui-button ui-button--secondary` | Neutral action |
| `ui-button ui-button--outline` | Accent outline action |
| `ui-button ui-button--ghost` | Low-emphasis action or navigation |
| `ui-link` | Inline text link |
| `ui-notice` with `ui-notice--error` or `ui-notice--success` | Feedback and status |

Layout and responsive utilities can be composed alongside these classes, for
example `className="ui-button ui-button--primary w-full"`. Keep labels
associated with their controls and preserve status semantics such as `role`,
`aria-busy`, and disabled states.
