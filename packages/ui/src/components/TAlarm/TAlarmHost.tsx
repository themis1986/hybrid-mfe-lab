import * as Toast from '@radix-ui/react-toast'
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react'
import { type CSSProperties, useEffect, useState, useSyncExternalStore } from 'react'
import { alarmStore, alarmSwipeDirection, alarmUrgency, groupAlarms, type TAlarmItem } from '../../lib/alarm'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tAlarmBodyClasses,
  tAlarmCloseClasses,
  tAlarmDescriptionClasses,
  tAlarmIconVariants,
  tAlarmTitleClasses,
  tAlarmVariants,
  tAlarmViewportVariants,
} from './TAlarm.variants'
import type { TAlarmHostProps } from './types'

const ICONS = { success: CircleCheck, error: CircleX, info: Info, warning: TriangleAlert }

const swipeStyle = {
  '--t-alarm-swipe-x': 'var(--radix-toast-swipe-move-x)',
  '--t-alarm-swipe-y': 'var(--radix-toast-swipe-move-y)',
} as CSSProperties

// Renders the page's alarms (lib/alarm.ts), raised with alarm.success(…) and the like or by an open
// <TAlarm>. Mount one per app, at its root. Only the first host mounted on the page renders, so inside the
// shell the shell's host shows the microfrontends' alarms too. Each position in use gets its own Radix
// Toast provider and viewport; the host's own one answers F8.
export function TAlarmHost({ position = 'bottom-right', duration = 5000, label = 'Notifications' }: TAlarmHostProps) {
  const [host] = useState(() => Symbol('TAlarmHost'))
  const state = useSyncExternalStore(alarmStore.subscribe, alarmStore.getState)

  useEffect(() => alarmStore.registerHost(host), [host])

  if (state.host !== host) return null

  return [...groupAlarms(state.items, position)].map(([groupPosition, items]) => {
    const isOwn = groupPosition === position

    return (
      <Toast.Provider key={groupPosition} duration={duration} swipeDirection={alarmSwipeDirection(groupPosition)} label={label}>
        {items.map((item) => (
          <Alarm key={item.id} item={item} />
        ))}
        <Toast.Viewport
          data-slot="alarm-viewport"
          hotkey={isOwn ? undefined : []}
          label={isOwn ? `${label} ({hotkey})` : label}
          className={tAlarmViewportVariants({ position: groupPosition })}
        />
      </Toast.Provider>
    )
  })
}

function Alarm({ item }: { item: TAlarmItem }) {
  const { variant } = item

  return (
    <Toast.Root
      data-slot="alarm"
      data-variant={variant}
      type={alarmUrgency(variant)}
      duration={item.duration}
      onOpenChange={(open) => !open && alarmStore.dismiss(item.id)}
      className={tAlarmVariants({ variant })}
      style={swipeStyle}
    >
      <TIcon icon={ICONS[variant]} size="md" className={tAlarmIconVariants({ variant })} />
      <div className={tAlarmBodyClasses}>
        <Toast.Title className={tAlarmTitleClasses}>{item.title}</Toast.Title>
        {item.description && <Toast.Description className={tAlarmDescriptionClasses}>{item.description}</Toast.Description>}
      </div>
      <Toast.Close asChild>
        <TButton variant="ghost" size="sm" aria-label="Dismiss" className={tAlarmCloseClasses}>
          <TIcon icon={X} size="sm" />
        </TButton>
      </Toast.Close>
    </Toast.Root>
  )
}
