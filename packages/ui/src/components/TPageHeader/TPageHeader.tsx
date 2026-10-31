import { Slot, Slottable } from '@radix-ui/react-slot'
import { cn } from '../../lib/cn'
import {
  tPageHeaderActionsClasses,
  tPageHeaderClasses,
  tPageHeaderDescriptionClasses,
  tPageHeaderTextClasses,
  tPageHeaderTitleClasses,
} from './TPageHeader.variants'
import type { TPageHeaderProps } from './types'

export function TPageHeader({
  title,
  description,
  actions,
  headingLevel = 1,
  asChild = false,
  className,
  children,
  ...props
}: TPageHeaderProps) {
  const Comp = asChild ? Slot : 'header'
  const Heading = `h${headingLevel}` as const

  return (
    <Comp className={cn(tPageHeaderClasses, className)} {...props}>
      <Slottable child={children}>
        {(content) => (
          <div className={tPageHeaderTextClasses}>
            {title != null && <Heading className={tPageHeaderTitleClasses}>{title}</Heading>}
            {description != null && <p className={tPageHeaderDescriptionClasses}>{description}</p>}
            {content}
          </div>
        )}
      </Slottable>
      {actions != null && <div className={tPageHeaderActionsClasses}>{actions}</div>}
    </Comp>
  )
}
