import { TIcon } from '@repo/ui'
import type { LucideIcon } from '@repo/ui/icons'
import type { ReactNode } from 'react'

/** A centred message for a page or a section: loading failures and empty states. */
export function Message({
  icon,
  title,
  children,
  action,
  tone = 'neutral',
}: {
  icon: LucideIcon
  title: string
  children?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'danger'
}) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-6 py-10 text-center"
    >
      <span
        className={
          tone === 'danger'
            ? 'flex size-10 items-center justify-center rounded-full bg-danger-subtle text-danger-fg'
            : 'flex size-10 items-center justify-center rounded-full bg-accent-subtle text-accent-fg'
        }
      >
        <TIcon icon={icon} />
      </span>
      <div className="flex max-w-md flex-col gap-1">
        <p className="m-0 font-semibold text-fg">{title}</p>
        {children && <p className="m-0 text-sm text-fg-muted">{children}</p>}
      </div>
      {action}
    </div>
  )
}
