// The alarm store, identical in @repo/ui and @repo/ui-vue: change it in both.
//
// It is one store per page, kept on globalThis, so every app on the page (the shell and its microfrontends,
// whichever library they bundle) raises its alarms into the same list and they stack in one place. Items
// are plain data (text, no components), so a host of either framework can render any of them. Each app
// may mount a host; the first one mounted renders the alarms and the others stay idle, so inside the shell
// its host shows them all, and a microfrontend running on its own shows them with its own host.

export type TAlarmVariant = 'success' | 'error' | 'info' | 'warning'

export type TAlarmPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface TAlarmOptions {
  /** A second, quieter line under the title. */
  description?: string
  /** The corner or edge it appears at. The host's position when omitted. */
  position?: TAlarmPosition
  /** Milliseconds before it closes on its own; `Infinity` keeps it until dismissed. The host's when omitted. */
  duration?: number
  /** Called once it closes: dismissed, timed out or swiped away. */
  onClose?: () => void
}

export interface TAlarmItem extends TAlarmOptions {
  id: string
  variant: TAlarmVariant
  /** The message. */
  title: string
}

export interface TAlarmState {
  items: readonly TAlarmItem[]
  /** The host that renders the alarms. */
  host: symbol | undefined
}

export interface TAlarmStore {
  getState(): TAlarmState
  subscribe(listener: () => void): () => void
  /** Adds the alarm, or updates the one with the same id in place. */
  set(item: TAlarmItem): void
  /** Closes it and calls its onClose. */
  dismiss(id: string): void
  /** Takes it away without calling onClose, for an owner that closed it itself. */
  remove(id: string): void
  /** Registers a host; the first registered one renders. Returns the unregister function. */
  registerHost(host: symbol): () => void
}

function createAlarmStore(): TAlarmStore {
  let state: TAlarmState = { items: [], host: undefined }
  let hosts: symbol[] = []
  const listeners = new Set<() => void>()

  // A new state object on every change, so React's useSyncExternalStore sees it.
  const commit = (next: Partial<TAlarmState>) => {
    state = { ...state, ...next }
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    set(item) {
      const exists = state.items.some((i) => i.id === item.id)
      commit({ items: exists ? state.items.map((i) => (i.id === item.id ? item : i)) : [...state.items, item] })
    },
    dismiss(id) {
      const item = state.items.find((i) => i.id === id)
      if (!item) return
      commit({ items: state.items.filter((i) => i !== item) })
      item.onClose?.()
    },
    remove(id) {
      if (state.items.some((i) => i.id === id)) commit({ items: state.items.filter((i) => i.id !== id) })
    },
    registerHost(host) {
      hosts = [...hosts, host]
      commit({ host: hosts[0] })
      return () => {
        hosts = hosts.filter((h) => h !== host)
        commit({ host: hosts[0] })
      }
    },
  }
}

// Versioned, so a future incompatible store never picks up this one.
const STORE_KEY = '__tAlarmStore_v1'
const page = globalThis as typeof globalThis & { [STORE_KEY]?: TAlarmStore }
export const alarmStore: TAlarmStore = (page[STORE_KEY] ??= createAlarmStore())

export function newAlarmId() {
  return `alarm-${Math.random().toString(36).slice(2)}`
}

function show(variant: TAlarmVariant, title: string, options: TAlarmOptions = {}) {
  const id = newAlarmId()
  alarmStore.set({ ...options, id, variant, title })
  return id
}

/** Raises an alarm from anywhere; a TAlarmHost on the page shows it. Each call returns the alarm's id. */
export const alarm = {
  success: (title: string, options?: TAlarmOptions) => show('success', title, options),
  error: (title: string, options?: TAlarmOptions) => show('error', title, options),
  info: (title: string, options?: TAlarmOptions) => show('info', title, options),
  warning: (title: string, options?: TAlarmOptions) => show('warning', title, options),
  /** Closes an alarm early. */
  dismiss: (id: string) => alarmStore.dismiss(id),
}

/** The alarms per position, oldest first. The host's own position is always present (its viewport holds F8). */
export function groupAlarms(items: readonly TAlarmItem[], hostPosition: TAlarmPosition) {
  const groups = new Map<TAlarmPosition, TAlarmItem[]>([[hostPosition, []]])
  for (const item of items) {
    const position = item.position ?? hostPosition
    groups.set(position, [...(groups.get(position) ?? []), item])
  }
  return groups
}

/** Swiping an alarm towards the edge it sits on dismisses it. */
export function alarmSwipeDirection(position: TAlarmPosition) {
  if (position.endsWith('right')) return 'right'
  if (position.endsWith('left')) return 'left'
  return position.startsWith('top') ? 'up' : 'down'
}

/** Errors and warnings interrupt a screen reader (assertive); successes and infos wait (polite). */
export function alarmUrgency(variant: TAlarmVariant) {
  return variant === 'error' || variant === 'warning' ? 'foreground' : 'background'
}
