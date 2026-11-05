import {
  TButton,
  TDropdownMenu,
  TDropdownMenuContent,
  TDropdownMenuItem,
  TDropdownMenuSeparator,
  TDropdownMenuTrigger,
  TIcon,
  TTooltip,
} from '@repo/ui'
import {
  Ellipsis,
  Eraser,
  Keyboard,
  Plus,
  Redo2,
  Undo2,
} from '@repo/ui/icons'
import { useDialogs } from '../../hooks/useDialogs'
import { useHistory } from '../../hooks/useHistory'
import { IconButton } from '../common/IconButton'
import { PeriodPicker } from './PeriodPicker'

/** The app-wide actions in the page header: undo and redo, add, and a menu for the rest. */
export function HeaderActions({ ready }: { ready: boolean }) {
  const { openDialog } = useDialogs()
  const { canUndo, canRedo, undo, redo } = useHistory()

  return (
    <>
      <PeriodPicker />
      <div className="flex items-center gap-1">
        <TTooltip content="Undo (⌘/Ctrl Z)">
          <IconButton icon={Undo2} label="Undo" disabled={!canUndo} onClick={undo} />
        </TTooltip>
        <TTooltip content="Redo (⇧ ⌘/Ctrl Z)">
          <IconButton icon={Redo2} label="Redo" disabled={!canRedo} onClick={redo} />
        </TTooltip>
      </div>
      <TButton
        disabled={!ready}
        onClick={() => openDialog({ kind: 'transaction', mode: 'new' })}
      >
        <TIcon icon={Plus} size="sm" />
        Add transaction
      </TButton>
      <TDropdownMenu>
        <TDropdownMenuTrigger asChild>
          <IconButton icon={Ellipsis} label="More actions" />
        </TDropdownMenuTrigger>
        <TDropdownMenuContent align="end">
          <TDropdownMenuItem onSelect={() => openDialog({ kind: 'shortcuts' })}>
            <TIcon icon={Keyboard} size="sm" />
            Keyboard shortcuts
          </TDropdownMenuItem>
          <TDropdownMenuSeparator />
          <TDropdownMenuItem
            tone="danger"
            disabled={!ready}
            onSelect={() => openDialog({ kind: 'confirm-clear' })}
          >
            <TIcon icon={Eraser} size="sm" />
            Clear data
          </TDropdownMenuItem>
        </TDropdownMenuContent>
      </TDropdownMenu>
    </>
  )
}
