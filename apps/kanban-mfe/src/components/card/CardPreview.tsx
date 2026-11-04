import { useCard, useLabels, useMembers } from '../../hooks/useBoard'
import { today } from '../../lib/dates'
import type { CardId } from '../../types'
import { CARD_SHELL_CLASSES } from './BoardCard'
import { CardFace } from './CardFace'

/** The card under the pointer during a drag. */
export function CardPreview({ id }: { id: CardId }) {
  const card = useCard(id)
  const labels = useLabels()
  const members = useMembers()
  if (!card) return null

  return (
    <div
      className={`cursor-grabbing text-fg shadow-lg motion-safe:rotate-1 ${CARD_SHELL_CLASSES}`}
    >
      <CardFace
        card={card}
        labels={labels}
        members={members}
        now={today()}
        isDone={false}
      />
    </div>
  )
}
