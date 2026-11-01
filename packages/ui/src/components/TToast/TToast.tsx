import { useAlarmItem } from '../TAlarm/useAlarmItem'
import type { TToastProps } from './types'

// The declarative form of toast(): an untinted message, typically with an action ('Message deleted' · Undo).
// While `open`, the page's TAlarmHost shows it in the same stack as the alarms; this renders nothing itself.
export function TToast({
  open,
  onOpenChange,
  onAction,
  ...fields
}: TToastProps) {
  useAlarmItem(
    open,
    { variant: 'neutral', ...fields },
    { onClose: () => onOpenChange?.(false), onAction },
  )
  return null
}
