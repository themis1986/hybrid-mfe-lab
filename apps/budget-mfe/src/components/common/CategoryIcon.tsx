import { TIcon } from '@repo/ui'
import { CATEGORIES } from '../../lib/categories'
import type { CategoryId } from '../../types'
import { CATEGORY_ICONS, CHART_TEXT_CLASSES } from './categoryIcons'

/** The category's icon in its chart colour, in a round badge. Decorative: the category's name is nearby. */
export function CategoryIcon({
  category,
  size = 'md',
}: {
  category: CategoryId
  size?: 'sm' | 'md'
}) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full border border-line bg-surface ${size === 'sm' ? 'size-6' : 'size-9'} ${CHART_TEXT_CLASSES[CATEGORIES[category].color]}`}
    >
      <TIcon icon={CATEGORY_ICONS[category]} size="sm" />
    </span>
  )
}
