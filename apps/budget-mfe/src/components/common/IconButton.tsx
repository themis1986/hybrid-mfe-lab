import { TButton, type TButtonProps, TIcon } from '@repo/ui'
import type { LucideIcon } from '@repo/ui/icons'

// The library's pattern for a button with only an icon: a square ghost TButton with an accessible name.
export function IconButton({
  icon,
  label,
  className = '',
  ...props
}: Omit<TButtonProps, 'label' | 'children'> & {
  icon: LucideIcon
  label: string
}) {
  return (
    <TButton
      variant="ghost"
      size="sm"
      aria-label={label}
      className={`w-8 px-0 ${className}`}
      {...props}
    >
      <TIcon icon={icon} size="sm" />
    </TButton>
  )
}
