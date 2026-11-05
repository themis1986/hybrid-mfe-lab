import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { selectDialog } from '../state/selectors'
import { type DialogState, dialogClosed, dialogOpened } from '../state/ui'

export type { DialogState }

/** Which dialog is open, and the actions that open and close one. One at a time. */
export function useDialogs() {
  const dialog = useAppSelector(selectDialog)
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      dialog,
      openDialog: (next: DialogState) => {
        dispatch(dialogOpened(next))
      },
      closeDialog: () => {
        dispatch(dialogClosed())
      },
    }),
    [dialog, dispatch],
  )
}
