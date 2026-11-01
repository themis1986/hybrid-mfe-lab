import { useEffect, useRef, useState } from 'react'
import { alarmStore, newAlarmId } from '../../lib/alarm'
import type { TAlarmProps } from './types'

// The declarative form of alarm.*(): while `open`, the alarm is in the page's alarm store, and the page's
// TAlarmHost renders it (this component renders nothing itself). When it closes on its own, onOpenChange
// gets false; setting `open` to false takes it away.
export function TAlarm({ open, onOpenChange, variant = 'info', title, description, position, duration }: TAlarmProps) {
  const [id] = useState(newAlarmId)
  const onOpenChangeRef = useRef(onOpenChange)
  onOpenChangeRef.current = onOpenChange

  // Updates the alarm in place while open, so a changed prop doesn't restart it.
  useEffect(() => {
    if (open) {
      alarmStore.set({ id, variant, title, description, position, duration, onClose: () => onOpenChangeRef.current?.(false) })
    }
  }, [open, id, variant, title, description, position, duration])

  useEffect(() => {
    if (open) return () => alarmStore.remove(id)
  }, [open, id])

  return null
}
