// Page logic of TPagination, identical in @repo/ui and @repo/ui-vue: change it in both.
// The range follows Reka's PaginationList, which doesn't export it, so both libraries list the same pages.

/** Accessible names of the buttons. */
export interface TPaginationLabels {
  first: string
  previous: string
  next: string
  last: string
  page: (page: number) => string
}

export const T_PAGINATION_LABELS: TPaginationLabels = {
  first: 'First page',
  previous: 'Previous page',
  next: 'Next page',
  last: 'Last page',
  page: (page) => `Page ${page}`,
}

export type TPaginationItem =
  { type: 'page'; value: number } | { type: 'ellipsis' }

/** At least 1: an empty list still has a page to show. */
export function getPageCount(total: number, itemsPerPage: number) {
  return Math.max(1, Math.ceil(total / (itemsPerPage || 1)))
}

export function clampPage(page: number, pageCount: number) {
  return Math.min(Math.max(page, 1), pageCount)
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function withEdges(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const left = Math.max(page - siblingCount, 1)
  const right = Math.min(page + siblingCount, pageCount)
  // Siblings, the current page, both edges and both ellipses; the two edges aren't part of the window.
  const windowSize = Math.min(2 * siblingCount + 5, pageCount) - 2

  // An ellipsis must hide more than one page, or the page itself takes less room.
  const leftGap =
    left > 3 && Math.abs(pageCount - windowSize) > 2 && Math.abs(left - 1) > 2
  const rightGap =
    right < pageCount - 2 &&
    Math.abs(pageCount - windowSize) > 2 &&
    Math.abs(pageCount - right) > 2

  if (leftGap && rightGap)
    return [1, 'ellipsis', ...range(left, right), 'ellipsis', pageCount]
  if (rightGap) return [...range(1, windowSize), 'ellipsis', pageCount]
  if (leftGap)
    return [1, 'ellipsis', ...range(pageCount - windowSize + 1, pageCount)]
  return range(1, pageCount)
}

function withoutEdges(
  page: number,
  pageCount: number,
  siblingCount: number,
): number[] {
  const windowSize = 2 * siblingCount + 1
  if (pageCount < windowSize) return range(1, pageCount)
  if (page <= siblingCount + 1) return range(1, windowSize)
  if (pageCount - page <= siblingCount)
    return range(pageCount - windowSize + 1, pageCount)
  return range(page - siblingCount, page + siblingCount)
}

/** The buttons to show for a page already within 1…pageCount (see clampPage). */
export function getPaginationItems(
  page: number,
  pageCount: number,
  siblingCount: number,
  showEdges: boolean,
): TPaginationItem[] {
  const siblings = Math.max(0, Math.floor(siblingCount))
  const items = showEdges
    ? withEdges(page, pageCount, siblings)
    : withoutEdges(page, pageCount, siblings)

  return items.map((item) =>
    item === 'ellipsis' ? { type: 'ellipsis' } : { type: 'page', value: item },
  )
}
