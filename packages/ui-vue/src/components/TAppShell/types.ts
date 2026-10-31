import type { PrimitiveProps } from 'reka-ui'

export interface TAppShellProps extends PrimitiveProps {
  /** Narrow sidebar column; the caller decides what the sidebar shows. */
  collapsed?: boolean
  /** Set false when there is no sidebar region. */
  hasSidebar?: boolean
  /** At least the viewport height. */
  viewport?: boolean
}

export interface TAppShellHeaderProps extends PrimitiveProps {}
export interface TAppShellSidebarProps extends PrimitiveProps {}
export interface TAppShellMainProps extends PrimitiveProps {}
export interface TAppShellFooterProps extends PrimitiveProps {}
