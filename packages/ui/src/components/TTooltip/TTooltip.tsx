import * as Tooltip from '@radix-ui/react-tooltip'
import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import {
  tTooltipArrowClasses,
  tTooltipContentClasses,
} from './TTooltip.variants'
import type { TTooltipProps } from './types'

const contentStyle = {
  '--t-tooltip-transform-origin':
    'var(--radix-tooltip-content-transform-origin)',
} as CSSProperties

// A hint shown on hover (after `delayDuration`) and on keyboard focus (Radix Tooltip). The child is the
// trigger; it gets aria-describedby while the tooltip is open. Each tooltip brings its own Radix provider,
// so it needs no setup. A disabled button fires no pointer events: wrap it in a <span tabIndex={0}>.
export function TTooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  delayDuration = 300,
  arrow = true,
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
  style,
  ...props
}: TTooltipProps) {
  if (disabled) return children

  return (
    <Tooltip.Provider delayDuration={delayDuration}>
      <Tooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            data-slot="tooltip"
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={8}
            className={cn(tTooltipContentClasses, className)}
            style={{ ...contentStyle, ...style }}
            {...props}
          >
            {content}
            {arrow && (
              <Tooltip.Arrow
                data-slot="tooltip-arrow"
                width={10}
                height={5}
                className={tTooltipArrowClasses}
              />
            )}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
