import { Skeleton } from '../common/Skeleton'

const CARD_COUNTS = [4, 3, 2, 3]

/** What the board looks like while it loads, so nothing jumps when it arrives. */
export function BoardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading the board"
      className="flex flex-col gap-3 p-4"
    >
      <Skeleton className="h-7 w-64" />
      <Skeleton className="h-8 max-w-xl" />
      <div className="flex gap-3 overflow-hidden">
        {CARD_COUNTS.map((count, column) => (
          <div
            key={column}
            className="box-border flex w-72 shrink-0 flex-col gap-2 rounded-lg border border-line bg-surface p-2"
          >
            <Skeleton className="h-6 w-28" />
            {Array.from({ length: count }, (_, card) => (
              <Skeleton key={card} className="h-20" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
