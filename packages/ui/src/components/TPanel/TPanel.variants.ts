import { cva } from 'class-variance-authority'
import { padVariants } from '../../lib/layout'

// Lighter than a card: a smaller radius and never a shadow.
export const tPanelVariants = cva('box-border flex flex-col gap-3 rounded-md border border-line text-fg', {
  variants: {
    tone: {
      neutral: 'bg-surface',
      accent: 'bg-accent-subtle',
    },
    padding: padVariants,
  },
  defaultVariants: { tone: 'neutral', padding: 4 },
})

export const tPanelTitleClasses = 'm-0 text-sm leading-tight font-semibold text-fg'
