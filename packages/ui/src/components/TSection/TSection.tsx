import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import {
  tSectionBodyVariants,
  tSectionDescriptionClasses,
  tSectionHeadingClasses,
  tSectionVariants,
} from './TSection.variants'
import type { TSectionProps } from './types'

export function TSection({
  title,
  description,
  headingLevel = 2,
  gap,
  spacing,
  asChild = false,
  className,
  children,
  ...props
}: TSectionProps) {
  const Comp = asChild ? Slot : 'section'
  const Heading = `h${headingLevel}` as const

  // Slottable's render form wraps the content in the body either way: `children` without asChild,
  // or the slotted element's own children with it.
  return (
    <Comp className={cn(tSectionVariants({ spacing }), className)} {...props}>
      {title != null && <Heading className={tSectionHeadingClasses}>{title}</Heading>}
      {description != null && <p className={tSectionDescriptionClasses}>{description}</p>}
      <Slottable child={children}>
        {(content) => <div className={tSectionBodyVariants({ gap })}>{content}</div>}
      </Slottable>
    </Comp>
  )
}
