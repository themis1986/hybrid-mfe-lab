import { TIcon } from '@repo/ui'
import {
  ArrowDownUp,
  LayoutDashboard,
  type LucideIcon,
  ReceiptText,
  Target,
} from '@repo/ui/icons'
import { NavLink } from 'react-router'
import { PATHS } from '../../paths'

const ITEMS: { to: string; label: string; icon: LucideIcon; end?: boolean }[] =
  [
    {
      to: PATHS.dashboard,
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    { to: PATHS.transactions, label: 'Transactions', icon: ReceiptText },
    { to: PATHS.budgets, label: 'Budgets', icon: Target },
    { to: PATHS.importExport, label: 'Import & export', icon: ArrowDownUp },
  ]

// The app's own pages. NavLink sets aria-current="page" on the active one. On a narrow screen the row
// scrolls sideways rather than wrapping.
export function MainNav() {
  return (
    <nav aria-label="Budget" className="-mx-4 overflow-x-auto px-4">
      <ul className="m-0 flex w-max list-none gap-1 border-b border-line p-0">
        {ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className="-mb-px flex items-center gap-2 border-b-2 border-transparent px-3 py-2 text-sm whitespace-nowrap text-fg-muted no-underline transition-colors duration-150 hover:text-fg focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus aria-[current=page]:border-accent aria-[current=page]:font-medium aria-[current=page]:text-fg"
            >
              <TIcon icon={item.icon} size="sm" className="shrink-0" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
