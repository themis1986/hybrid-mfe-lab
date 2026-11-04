import { TIcon } from '@repo/ui'
import type { LucideIcon } from '@repo/ui/icons'
import type { ReactNode } from 'react'

/** A centred message with an optional action: the board's empty, no-results and failure states. */
export function Message({
  icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-8 text-center font-sans">
      <span className="text-fg-muted">
        <TIcon icon={icon} size="lg" />
      </span>
      <p className="m-0 text-sm font-medium text-fg">{title}</p>
      {children && (
        <p className="m-0 max-w-sm text-sm text-fg-muted">{children}</p>
      )}
      {action}
    </div>
  )
}
