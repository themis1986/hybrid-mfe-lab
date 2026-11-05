import {
  TDialog,
  TDialogBody,
  TDialogContent,
  TDialogHeader,
  TDialogTitle,
} from '@repo/ui'
import { useDialogs } from '../../hooks/useDialogs'

export const SHORTCUTS: [string, string][] = [
  ['N', 'Add a transaction'],
  ['/', 'Search the transactions'],
  ['⌘/Ctrl Z', 'Undo'],
  ['⇧ ⌘/Ctrl Z', 'Redo'],
  ['?', 'This list'],
]

/** The keyboard shortcuts. They work anywhere in the app, except while typing or with a dialog open. */
export function ShortcutsDialog() {
  const { dialog, closeDialog } = useDialogs()

  return (
    <TDialog
      open={dialog?.kind === 'shortcuts'}
      onOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      <TDialogContent size="sm">
        <TDialogHeader>
          <TDialogTitle>Keyboard shortcuts</TDialogTitle>
        </TDialogHeader>
        <TDialogBody>
          <dl className="m-0 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
            {SHORTCUTS.map(([keys, action]) => (
              <div key={keys} className="contents">
                <dt>
                  <kbd className="rounded-sm border border-line bg-surface px-1.5 py-0.5 font-mono text-xs text-fg">
                    {keys}
                  </kbd>
                </dt>
                <dd className="m-0 text-fg-muted">{action}</dd>
              </div>
            ))}
          </dl>
        </TDialogBody>
      </TDialogContent>
    </TDialog>
  )
}
