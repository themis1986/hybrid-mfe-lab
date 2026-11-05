import {
  Briefcase,
  Car,
  HeartPulse,
  House,
  Laptop,
  type LucideIcon,
  Package,
  PiggyBank,
  ShoppingCart,
  Ticket,
  UtensilsCrossed,
  Zap,
} from '@repo/ui/icons'
import type { ChartToken } from '../../lib/categories'
import type { CategoryId } from '../../types'

/** Each category's icon. Kept out of lib/categories.ts, so the schemas don't depend on React. */
export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  housing: House,
  groceries: ShoppingCart,
  dining: UtensilsCrossed,
  transport: Car,
  utilities: Zap,
  health: HeartPulse,
  leisure: Ticket,
  other: Package,
  salary: Briefcase,
  freelance: Laptop,
  'other-income': PiggyBank,
}

// The chart palette as text colours. Written out in full, so Tailwind finds each class in the source.
export const CHART_TEXT_CLASSES: Record<ChartToken, string> = {
  'chart-1': 'text-(--t-color-chart-1)',
  'chart-2': 'text-(--t-color-chart-2)',
  'chart-3': 'text-(--t-color-chart-3)',
  'chart-4': 'text-(--t-color-chart-4)',
  'chart-5': 'text-(--t-color-chart-5)',
  'chart-6': 'text-(--t-color-chart-6)',
  'chart-7': 'text-(--t-color-chart-7)',
  'chart-8': 'text-(--t-color-chart-8)',
}
