import { alarm, toast } from '@repo/ui'
import { useEffect } from 'react'
import { describeChange } from '../lib/describe'
import { useAppDispatch } from '../state/hooks'
import { addAppListener } from '../state/store'
import { undo } from '../state/undo'

/**
 * Shows the Undo toast for destructive changes. Only the latest change can be undone from a toast, so any
 * change of the ledger (a new action, an undo, a redo) dismisses the open one: its Undo would revert
 * something else. The shell's alarm host renders it and outlives this remote, so unmounting dismisses it.
 */
export function useUndoToast() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let openId: string | null = null
    const dismiss = () => {
      if (openId) alarm.dismiss(openId)
      openId = null
    }

    // A listener on the store's actions: the toast needs the action and the ledger before it, which the
    // state alone doesn't keep. It lives exactly as long as this effect.
    const unsubscribe = dispatch(
      addAppListener({
        predicate: (_action, current, previous) =>
          current.ledger !== previous.ledger,
        effect: (action, api) => {
          dismiss()
          const message = describeChange(
            action,
            api.getOriginalState().ledger.present,
          )
          if (!message) return
          const id = toast(message, {
            action: { label: 'Undo', onClick: () => dispatch(undo()) },
            onClose: () => {
              if (openId === id) openId = null
            },
          })
          openId = id
        },
      }),
    )

    return () => {
      unsubscribe()
      dismiss()
    }
  }, [dispatch])
}
