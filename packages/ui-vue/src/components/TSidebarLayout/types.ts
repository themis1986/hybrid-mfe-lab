import type { PrimitiveProps } from 'reka-ui'
import type { Space } from '../../lib/layout'

export interface TSidebarLayoutProps extends PrimitiveProps {
  /** The sidebar's side, whatever the DOM order. */
  side?: 'start' | 'end'
  /** The sidebar's width beside the content (any CSS length). Defaults to the layout sidebar token. */
  sidebarWidth?: string
  /** Narrow sidebar; wins over sidebarWidth. */
  collapsed?: boolean
  /** Space between items: steps 0–8 of the spacing scale (0–64px). */
  gap?: Space
}

export interface TSidebarLayoutSidebarProps extends PrimitiveProps {}
export interface TSidebarLayoutContentProps extends PrimitiveProps {}
