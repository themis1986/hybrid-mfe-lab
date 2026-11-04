import { LABEL_TONE_CLASSES } from '../../lib/presentation'
import type { Label } from '../../types'

export function LabelChip({ label }: { label: Label }) {
  return (
    <span
      className={`box-border inline-flex items-center rounded-full border px-1.5 text-[0.6875rem] leading-4 font-medium ${LABEL_TONE_CLASSES[label.tone]}`}
    >
      {label.name}
    </span>
  )
}
