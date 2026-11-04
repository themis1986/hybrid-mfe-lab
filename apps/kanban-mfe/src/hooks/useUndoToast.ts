import { alarm, toast } from '@repo/ui'
import { useEffect } from 'react'
import { describeUndoable } from '../lib/describe'
import { useBoardStore } from '../state/StoreContext'

/**
 * Shows the Undo toast for moves and destructive actions. Only the latest change can be undone from a toast,
 * so any new change, undo or redo dismisses the open one: its Undo would revert something else. The shell's
 * alarm host renders it and outlives this remote, so unmounting dismisses it too.
 */
export function useUndoToast() {
  const store = useBoardStore()

  useEffect(() => {
    let openId: string | null = null
    const dismiss = () => {
      if (openId) alarm.dismiss(openId)
      openId = null
    }

    const unsubscribe = store.onChange((change) => {
      dismiss()
      if (change.kind !== 'action') return
      const message = describeUndoable(change.action, change.before)
      if (!message) return
      const id = toast(message, {
        action: { label: 'Undo', onClick: () => store.undo() },
        onClose: () => {
          if (openId === id) openId = null
        },
      })
      openId = id
    })

    return () => {
      unsubscribe()
      dismiss()
    }
  }, [store])
}
