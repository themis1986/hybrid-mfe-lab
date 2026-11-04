import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CardId, ColumnId } from '../types'

export type OpenDialog =
  | { kind: 'card'; cardId: CardId }
  | { kind: 'new-card'; columnId?: ColumnId }
  | { kind: 'delete-column'; columnId: ColumnId }
  | { kind: 'wip-limit'; columnId: ColumnId }
  | null

interface DialogsValue {
  dialog: OpenDialog
  openDialog(dialog: OpenDialog): void
  closeDialog(): void
}

const DialogsContext = createContext<DialogsValue | null>(null)

// Which dialog is open. One at a time, so one piece of state; it isn't part of the board.
export function DialogsProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<OpenDialog>(null)
  const value = useMemo<DialogsValue>(
    () => ({
      dialog,
      openDialog: setDialog,
      closeDialog: () => setDialog(null),
    }),
    [dialog],
  )
  return (
    <DialogsContext.Provider value={value}>{children}</DialogsContext.Provider>
  )
}

export function useDialogs(): DialogsValue {
  const value = useContext(DialogsContext)
  if (!value) throw new Error('useDialogs needs a DialogsProvider.')
  return value
}
