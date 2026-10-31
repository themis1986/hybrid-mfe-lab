import { cva } from 'class-variance-authority'

// The page frame, for the host app (not for use inside a microfrontend slot). Named grid areas, so any
// region can be left out: an empty `auto` row has no height. Without a sidebar, pass hasSidebar={false}.
// - The sidebar is sticky under the header and scrolls on its own (max height: the viewport minus the
//   header). Being content-sized, it can't draw the column's border and background itself, so the
//   ::before pseudo-element paints them across the whole sidebar area.
// - --t-app-shell-top is the sidebar's sticky offset: the header height, or 0 when there is no header.
// - The one viewport media query in the layout components (`max-md:`, below 48rem) stacks the regions
//   into one column. It is page-level, which a slot-level component must never assume.
export const tAppShellVariants = cva(
  [
    'box-border grid text-fg',
    'grid-cols-[var(--t-layout-sidebar-width)_minmax(0,1fr)] grid-rows-[auto_1fr_auto]',
    '[grid-template-areas:"header_header"_"sidebar_main"_"footer_footer"]',
    'before:border-e before:border-line before:bg-surface before:[grid-area:sidebar]',
    '[--t-app-shell-top:0px] has-[>[data-slot=app-shell-header]]:[--t-app-shell-top:var(--t-layout-header-height)]',
    'max-md:grid-cols-[minmax(0,1fr)] max-md:grid-rows-[auto_auto_1fr_auto]',
    'max-md:[grid-template-areas:"header"_"sidebar"_"main"_"footer"] max-md:before:hidden',
  ],
  {
    variants: {
      collapsed: { true: 'grid-cols-[var(--t-layout-sidebar-collapsed-width)_minmax(0,1fr)]' },
      hasSidebar: {
        true: '',
        false: 'grid-cols-[minmax(0,1fr)] [grid-template-areas:"header"_"main"_"footer"] before:hidden',
      },
      viewport: { true: 'min-h-dvh' },
    },
    defaultVariants: { hasSidebar: true },
  },
)

export const tAppShellHeaderClasses =
  'sticky top-0 z-10 box-border flex h-(--t-layout-header-height) items-center gap-3 border-b border-line bg-canvas px-4 [grid-area:header]'
export const tAppShellSidebarClasses = [
  'sticky top-(--t-app-shell-top) box-border max-h-[calc(100dvh-var(--t-app-shell-top))] self-start',
  'overflow-x-hidden overflow-y-auto overscroll-contain p-3 [scrollbar-width:thin] [grid-area:sidebar]',
  'max-md:static max-md:max-h-none max-md:self-stretch max-md:border-b max-md:border-line max-md:bg-surface',
].join(' ')
export const tAppShellMainClasses = 'min-w-0 [grid-area:main]'
export const tAppShellFooterClasses = 'box-border border-t border-line px-4 py-3 [grid-area:footer]'
