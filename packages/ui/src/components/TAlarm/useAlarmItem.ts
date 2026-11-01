import { useEffect, useRef, useState } from 'react'
import {
  alarmStore,
  newAlarmId,
  type TAlarmItemVariant,
  type TAlarmPosition,
} from '../../lib/alarm'

interface AlarmItemFields {
  variant: TAlarmItemVariant
  title: string
  description?: string
  position?: TAlarmPosition
  duration?: number
  actionLabel?: string
}

interface AlarmItemHandlers {
  /** The item closed itself: timed out, dismissed, swiped, or its action clicked. */
  onClose?: () => void
  onAction?: () => void
}

// The declarative alarms (TAlarm, TToast): while `open`, the item is in the page's alarm store, updated in
// place when a field changes (so it doesn't restart), and taken away when `open` turns false or the
// component unmounts. The handlers are read when called, so new callbacks don't update the item.
export function useAlarmItem(
  open: boolean,
  fields: AlarmItemFields,
  handlers: AlarmItemHandlers,
) {
  const [id] = useState(newAlarmId)
  const handlersRef = useRef(handlers)
  handlersRef.current = handlers
  const { variant, title, description, position, duration, actionLabel } =
    fields

  useEffect(() => {
    if (!open) return
    alarmStore.set({
      id,
      variant,
      title,
      description,
      position,
      duration,
      action: actionLabel
        ? {
            label: actionLabel,
            onClick: () => handlersRef.current.onAction?.(),
          }
        : undefined,
      onClose: () => handlersRef.current.onClose?.(),
    })
  }, [open, id, variant, title, description, position, duration, actionLabel])

  useEffect(() => {
    if (open) return () => alarmStore.remove(id)
  }, [open, id])
}
