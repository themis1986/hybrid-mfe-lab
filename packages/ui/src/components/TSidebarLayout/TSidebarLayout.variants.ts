import { cva } from 'class-variance-authority'
import { gapVariants } from '../../lib/layout'

// Intrinsic sidebar layout, safe inside any container: the content keeps at least half the width, so
// when the sidebar can't fit beside it, the sidebar wraps onto its own row and both take the full width.
// The root places the sidebar through its direct children (data-slot), so `side` doesn't depend on DOM
// order, and nested layouts don't affect each other. `collapsed` overrides the sidebar's width from
// the root, so it also wins over `sidebarWidth`.
export const tSidebarLayoutVariants = cva('box-border flex flex-wrap', {
  variants: {
    side: {
      start: '[&>[data-slot=sidebar-layout-sidebar]]:order-first',
      end: '[&>[data-slot=sidebar-layout-sidebar]]:order-last',
    },
    collapsed: { true: '[&>[data-slot=sidebar-layout-sidebar]]:basis-(--t-layout-sidebar-collapsed-width)' },
    gap: gapVariants,
  },
  defaultVariants: { side: 'start', gap: 3 },
})

export const tSidebarLayoutSidebarClasses =
  'box-border min-w-0 grow basis-[var(--t-sidebar-width,var(--t-layout-sidebar-width))]'
export const tSidebarLayoutContentClasses = 'box-border min-w-[50%] grow-[999] basis-0'
