import { TCard, TGrid, TSkeleton } from '@repo/ui'

/**
 * The shape of the dashboard while the data loads: four tiles and two chart cards. Decorative; the status
 * text is what assistive technology announces.
 */
export function PageSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">Loading the budget data</span>
      <TGrid minChildWidth="15rem" gap={4}>
        {[0, 1, 2, 3].map((tile) => (
          <TCard key={tile} variant="elevated">
            <TSkeleton className="w-24" />
            <TSkeleton className="h-7 w-36" />
            <TSkeleton shape="block" className="h-12" />
          </TCard>
        ))}
      </TGrid>
      <TGrid minChildWidth="22rem" gap={4}>
        {[0, 1].map((card) => (
          <TCard key={card} variant="elevated">
            <TSkeleton className="w-40" />
            <TSkeleton shape="block" className="h-64" />
          </TCard>
        ))}
      </TGrid>
    </div>
  )
}
