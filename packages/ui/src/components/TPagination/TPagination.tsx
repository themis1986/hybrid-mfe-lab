import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import {
  clampPage,
  getPageCount,
  getPaginationItems,
  T_PAGINATION_LABELS,
} from '../../lib/pagination'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tPaginationButtonVariants,
  tPaginationClasses,
  tPaginationEllipsisVariants,
  tPaginationListClasses,
  tPaginationListItemClasses,
} from './TPagination.variants'
import type { TPaginationProps } from './types'

// Page navigation: `page` + `onPageChange`, or `defaultPage`. Radix has no pagination primitive, so this
// reproduces the DOM, roles and data attributes of the Reka parts behind @repo/ui-vue's TPagination.
export function TPagination({
  page,
  defaultPage = 1,
  onPageChange,
  total,
  itemsPerPage,
  siblingCount = 1,
  showEdges = true,
  showFirstLast = false,
  size,
  disabled = false,
  labels,
  className,
  'aria-label': ariaLabel = 'Pagination',
  ...props
}: TPaginationProps) {
  const [innerPage, setInnerPage] = useState(defaultPage)
  const requested = page ?? innerPage
  const pageCount = getPageCount(total, itemsPerPage)
  const current = clampPage(requested, pageCount)
  const names = { ...T_PAGINATION_LABELS, ...labels }
  const buttonClasses = tPaginationButtonVariants({ size })

  // Against the requested page, not the shown one: picking the last page while `page` is past the end
  // reports the correction.
  const goTo = (next: number) => {
    if (next === requested) return
    setInnerPage(next)
    onPageChange?.(next)
  }

  const step = (
    slot: string,
    label: string,
    icon: LucideIcon,
    target: number,
    atLimit: boolean,
  ) => (
    <li className={tPaginationListItemClasses}>
      <TButton
        data-slot={`pagination-${slot}`}
        variant="ghost"
        size={size}
        className={buttonClasses}
        aria-label={label}
        disabled={disabled || atLimit}
        onClick={() => goTo(target)}
      >
        <TIcon icon={icon} />
      </TButton>
    </li>
  )

  return (
    <nav
      data-slot="pagination"
      className={cn(tPaginationClasses, className)}
      aria-label={ariaLabel}
      {...props}
    >
      <ul className={tPaginationListClasses}>
        {showFirstLast &&
          step('first', names.first, ChevronsLeft, 1, current === 1)}
        {step(
          'previous',
          names.previous,
          ChevronLeft,
          current - 1,
          current === 1,
        )}
        {getPaginationItems(current, pageCount, siblingCount, showEdges).map(
          (item, index) =>
            item.type === 'page' ? (
              <li key={item.value} className={tPaginationListItemClasses}>
                <TButton
                  data-slot="pagination-page"
                  data-type="page"
                  data-selected={item.value === current ? 'true' : undefined}
                  aria-current={item.value === current ? 'page' : undefined}
                  aria-label={names.page(item.value)}
                  variant={item.value === current ? 'solid' : 'ghost'}
                  size={size}
                  className={buttonClasses}
                  disabled={disabled}
                  onClick={() => goTo(item.value)}
                >
                  {item.value}
                </TButton>
              </li>
            ) : (
              <li
                key={`ellipsis-${index}`}
                className={tPaginationListItemClasses}
              >
                <span
                  data-slot="pagination-ellipsis"
                  data-type="ellipsis"
                  aria-hidden="true"
                  className={tPaginationEllipsisVariants({ size })}
                >
                  …
                </span>
              </li>
            ),
        )}
        {step(
          'next',
          names.next,
          ChevronRight,
          current + 1,
          current === pageCount,
        )}
        {showFirstLast &&
          step(
            'last',
            names.last,
            ChevronsRight,
            pageCount,
            current === pageCount,
          )}
      </ul>
    </nav>
  )
}
