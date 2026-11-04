export interface TBadgeProps {
  tone?: 'neutral' | 'accent' | 'success' | 'info' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  /** Text content, when the default slot is empty. */
  label?: string
}
