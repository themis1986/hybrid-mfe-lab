import { onBeforeUnmount, type Ref, watch } from 'vue'
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

// The declarative alarms (TAlarm, TToast): while `open` is true, the item is in the page's alarm store,
// updated in place when a field changes (so it doesn't restart), and taken away when `open` turns false or
// the component unmounts. When the item closes itself (timeout, dismiss, swipe, its action), `open`
// becomes false.
export function useAlarmItem(
  open: Ref<boolean>,
  fields: () => AlarmItemFields,
  onAction: () => void,
) {
  const id = newAlarmId()

  watch(
    [open, fields],
    ([isOpen, { actionLabel, ...item }]) => {
      if (!isOpen) return alarmStore.remove(id)
      alarmStore.set({
        ...item,
        id,
        action: actionLabel
          ? { label: actionLabel, onClick: onAction }
          : undefined,
        onClose: () => (open.value = false),
      })
    },
    { immediate: true },
  )
  onBeforeUnmount(() => alarmStore.remove(id))
}
