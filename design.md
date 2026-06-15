# TraxJob — Design System Reference

This document is the source of truth for the visual language of Job Tracker. It
follows the **Material You (Material Design 3)** structure with the **TraxJob
palette** — teal primary (`#0F6E56`), warm-neutral surfaces, and an earthy
orange accent. Read this before adding or restyling any UI so the app stays
visually consistent.

## Tech & architecture constraints

- **Stack**: Vite + React + TypeScript + Tailwind CSS v4. Components live in
  `src/components/`, domain logic in `src/jobs/`, persistence in `src/storage/`.
  Run `npm run dev`. (The pre-React single-file version is preserved as
  `index.html.bak`.)
- **Styling approach**: **Tailwind v4 utilities driven by the MD3 tokens**. The
  raw token values live as CSS variables in `src/styles/theme.css` (on `:root`
  and `.dark`) and are exposed to Tailwind via an `@theme inline { ... }` block.
  So `--md-primary` becomes the utility `bg-md-primary` / `text-md-primary`,
  `--radius-md-lg` becomes `rounded-md-lg`, `--shadow-elev-1` becomes
  `shadow-elev-1`, and `--ease-md` becomes `ease-md`. **Write Tailwind classes
  in components; never hard-code a hex value.** Need a new color/size? Add the
  raw var (light **and** `.dark`) in `theme.css` and map it in `@theme`.
- **Theming**: light is the default (`:root`). Dark mode is the `.dark` class on
  `<html>` (managed by `useTheme`), persisted in `localStorage`
  (`jobTracker.theme`). Because the `@theme` mapping uses `inline` + `var()`,
  every `md-*` utility re-resolves automatically under `.dark`.
- **Data**: job records persist via the `JobsRepository` interface
  (`src/storage/`); the current implementation is `LocalStorageRepository`
  (`jobTracker.v1`). A future cloud backend implements the same interface — the
  `useJobs` hook and all components stay unchanged. Design/UI work never touches
  this layer.
- **Token reference**: the tables below list the canonical hex values for both
  themes. They are the source of truth; `theme.css` mirrors them.

## Component libraries: shadcn/ui + ReUI

This project uses **shadcn/ui** and **ReUI** on top of the MD3 system. They are
not separate themes — their semantic tokens are remapped onto the MD3 palette so
their components inherit the Material You look automatically.

- **Config**: `components.json` (style `new-york`, Tailwind v4, CSS variables,
  alias `@/* → src/*`). The ReUI registry is registered there as
  `"@reui": "https://reui.io/r/{style}/{name}.json"`.
- **Where components land**: shadcn → `src/components/ui/`, ReUI →
  `src/components/reui/`. Shared `cn` helper lives in `src/lib/utils.ts`
  (`src/lib/cn.ts` re-exports it).
- **Add components**:
  - shadcn: `npx shadcn@latest add <name> -y`
  - ReUI: `npx shadcn@latest add @reui/<name> -y`
- **Token bridge (the important part)**: in `theme.css`, shadcn/ReUI roles point
  at MD3 vars — e.g. `--primary: var(--md-primary)`, `--background:
  var(--md-bg)`, `--card: var(--md-surface-container)`, `--muted:
  var(--md-surface-low)`, `--ring: var(--md-primary)`. They re-resolve under
  `.dark` automatically (only `--destructive` is tuned per theme). ReUI also adds
  `--success/--info/--warning/--invert` (mapped to Tailwind palette colors).
  **To restyle a shadcn/ReUI component globally, change the MD3 token it maps to
  — never hard-code a hex inside the component.** `--radius` is `0.75rem`
  (shadcn's `rounded-sm/md/lg/xl` derive from it); MD3's own `rounded-md-lg`
  etc. are unaffected.
- **MCP**: the shadcn/ReUI registry MCP server is configured **project-scoped**
  in `.mcp.json` (`{ "mcpServers": { "shadcn": { "command": "npx", "args":
  ["shadcn@latest", "mcp"] } } }`). Restart Claude Code, then `/mcp` to confirm
  it's connected; you can then ask it to browse/add shadcn & ReUI components.
- **Current usage**: the app UI is built on these components —
  - shadcn: `Button` (in Header/Dialog/menus), `Card` (stats), `Table` (job
    list), `Dialog` + `Input`/`Textarea`/`Select`/`Label` (the add/edit modal),
    `DropdownMenu` (per-row actions).
  - ReUI: `Badge` (status pills, colored from the MD3 status-container tokens).
  - The shadcn `Button` was customized to MD3: **base radius is `rounded-full`
    (pill) + `active:scale-95`** for tactile press. Keep buttons pill-shaped.
  - Form fields use shadcn's default outlined style (it already reads the MD3
    tokens — `border-input`, `ring`, etc.). The toolbar search/filters are
    restyled to MD3 pills via `className`.
- **Feature parity preserved**: `App.tsx` and the domain layer (`useJobs`,
  selectors) were untouched by this refactor — only component internals changed.
  Radix now provides focus-trap / Escape / scrim-dismiss for the dialog.

## Design tokens (the DNA)

All tokens are CSS variables. Add new values here rather than inventing one-offs.

### Color — light (`:root`)

| Token | Value | Role |
|---|---|---|
| `--md-bg` | `#F1EFE8` | Surface / page background (warm off-white — **never pure white**) |
| `--md-surface-container` | `#FBFAF6` | Cards, table, modal (lighter than bg for lift) |
| `--md-surface-low` | `#E8E5DB` | Inputs, recessed surfaces |
| `--md-primary` | `#0F6E56` | Teal — CTAs, focus, links, active state |
| `--md-primary-hover` | `#085041` | Dark teal — primary button hover (`hover:bg-primary-hover`) |
| `--md-on-primary` | `#FFFFFF` | Text/icon on primary |
| `--md-secondary-container` | `#E1F5EE` | Light teal tint — tonal buttons, chips |
| `--md-on-secondary-container` | `#073F31` | Text on secondary container |
| `--md-tertiary` | `#D85A30` | Orange accent / FAB / decorative blobs |
| `--md-text` | `#2C2C2A` | On Surface (primary body text) |
| `--md-muted` | `#5F5E5A` | On Surface Variant (secondary text/icons) |
| `--md-outline` | `#A8A596` | Borders, input outlines |
| `--md-border` | `#D3D1C7` | Subtle dividers |

### Color — dark (`.dark`)

Same token names, retuned for a warm-dark theme: `--md-bg #1A1A17`,
`--md-surface-container #232320`, `--md-surface-low #1E1E1B`,
`--md-primary #5FD3B2` (lightened teal), `--md-primary-hover #7BDDC0`,
`--md-on-primary #00382B`, `--md-secondary-container #224E41`,
`--md-tertiary #F2A074`, `--md-text #ECEAE0`, `--md-muted #BDBBB0`,
`--md-outline #8A887C`, `--md-border #3A3A34`.

### Status colors (tonal container + on-container pairs)

Each status has a **solid** color (`--md-<status>`, for stat numbers) and a
**container / on-container** pair (`--md-<status>-container` /
`--md-on-<status>-container`, for badges). Defined for both themes; light values:

| Status | Solid | Container bg | On-container fg |
|---|---|---|---|
| Applied | `#185FA5` (Blue) | `#DCE9F6` | `#0A2E54` |
| Interview | `#BA7517` (Orange-brown) | `#F6E7CC` | `#4A2E05` |
| Offer | `#3B6D11` (Green) | `#DEEFC8` | `#1B3406` |
| Rejected | `#A32D2D` (Red) | `#F5DAD8` | `#4E1010` |
| Wishlist | `#5F5E5A` (Neutral) | `#E7E4DA` | `#44433F` |

`Stats.tsx` reads the solid tokens via `text-md-<status>`; `StatusBadge.tsx`
(ReUI Badge) reads the pair via `bg-md-<status>-container
text-md-on-<status>-container`. Status keys come from the data
(`wishlist|applied|interview|offer|rejected`) — keep these in sync.

### Typography

- **Font**: Inter Tight (Google Fonts), weights 400 / 500 / 700, with
  `system-ui, sans-serif` fallback. Set via the `--font-sans` token in
  `theme.css` and loaded in `index.html`. **500 (Medium)** is the default for
  headings and labels — it carries the friendly MD3 feel.
- **Scale used here**: Title Large `1.5rem` (h1, modal h2), Body `0.95–1rem`,
  Label Medium `0.875rem` (buttons), Label Small `0.75rem` (stat labels, badges,
  captions). Stat numbers are `2rem`.
- Headings: weight 500, letter-spacing `-0.01em`. Labels/buttons:
  letter-spacing `0.01em`. Body line-height `1.5`.

### Shape (radius tokens)

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `12px` | Input top corners |
| `--r-md` | `16px` | (reserved) |
| `--r-lg` | `24px` | Cards, table, stat cards |
| `--r-xl` | `28px` | Modal |
| `--r-xxl` | `48px` | Hero / large containers (reserved) |
| — | `9999px` | **All buttons, chips, badges, search bar** (pill) |

### Motion & elevation

- **Easing**: `--ease: cubic-bezier(0.2, 0, 0, 1)` — MD3 "emphasized
  decelerate". Use it on every transition.
- **Duration**: micro-interactions `200ms`, standard `300ms`, press `120ms`.
- **Elevation**: `--elev-1` (cards at rest) → `--elev-2` (hover/raised) →
  `--elev-3` (modal). Soft, low-opacity shadows — depth comes from tonal
  surfaces first, shadow second.

## Component rules

- **Buttons** — always pill (`border-radius: 9999px`), min-height 40px.
  Interaction is a **state layer**: a `::before` overlay of `currentColor` at
  `0 → 8% (hover) → 12% (active)` opacity. Do **not** swap background colors on
  hover. `:active` adds `transform: scale(.95)` for tactile press.
  - `.primary` = filled (primary bg / on-primary text), gains `--elev-2` on hover.
  - `.ghost` = text button (transparent, primary text) — used in the header.
  - default = tonal (secondary-container).
  - `.danger` = error-colored text.
- **Inputs** — Material 3 filled text field: `surface-container-low` fill,
  rounded **top** corners only (`--r-sm --r-sm 0 0`), flat `2px` bottom border in
  `--outline` that turns `--primary` on focus. Exception: the toolbar search is a
  full pill.
- **Cards / table / stats** — `surface-container` background, `--r-lg` radius,
  `--elev-1` at rest, lift to `--elev-2` on hover (stat cards also
  `translateY(-2px)`). No borders for separation — use tonal surface + shadow.
  Table rows hover with a 7% primary state layer (`color-mix`).
- **Badges & source chips** — pill, weight 500, tonal container/on-container pair.
- **Modal** — `surface-container`, `--r-xl` radius, `--elev-3`, entrance
  animation (fade + rise). Overlay is a translucent scrim with `backdrop-filter`.
- **Header** — sticky, translucent (`color-mix` bg) with `backdrop-filter: blur`
  and a bottom border.

## Signature "bold factor" elements (keep these)

1. **Organic blur shapes** — three blurred (`blur(80px)`) colored blobs in
   `.backdrop` (fixed, `aria-hidden`, `pointer-events:none`, `z-index:0`), using
   primary/tertiary/secondary tones with `mix-blend-mode` (multiply in light,
   screen in dark). Real content sits at `z-index:1`.
2. **Tonal surface system** — never pure white; layer
   bg → surface-container → surface-container-low for depth.
3. **Pill everything** interactive; large organic radii on containers.
4. **State-layer interactions** with `--ease`, plus scale/shadow micro-feedback.

## Accessibility

- Focus: `outline: 2px solid var(--primary); outline-offset: 2px` on all
  interactive elements (`:focus-visible`).
- Decorative blobs are `aria-hidden="true"`.
- `prefers-reduced-motion`: transitions/animations collapse to ~0ms and
  transforms are disabled.
- Maintain ≥4.5:1 text contrast; status is conveyed by label text, not color
  alone.

## Anti-patterns (don't)

- ❌ Pure white backgrounds, rectangular/lightly-rounded buttons, heavy drop
  shadows, hover **color** changes (use state layers), hard-coded hex in rules
  (add a token), borders as the primary separator, sharp corners on big
  containers.

## When adding UI

1. Reuse existing `md-*` Tailwind utilities. If a new color/size is genuinely
   needed, add the raw var in **both** `:root` and `.dark` in `theme.css`, then
   map it in the `@theme inline` block.
2. Match the nearest existing component (e.g. `Button.tsx`, `JobModal.tsx`):
   reuse `Button` for anything clickable and the shared filled-field classes for
   inputs rather than re-styling from scratch.
3. Pill + state layer for clickables (handled by `Button`); filled field style
   (`rounded-t-md-sm` + `border-b-2`) for inputs.
4. Verify both light and dark themes, keyboard focus, and reduced-motion.
5. Keep persistence behind `JobsRepository` — don't reach into `localStorage`
   from components.
