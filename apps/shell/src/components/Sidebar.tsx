import { TStack } from '@repo/ui'
import { NavLink } from 'react-router'
import { useSession } from '../lib/auth'
import { getAccessibleItems, NAV_GROUPS } from '../lib/navigation'
import { TechTag } from './TechTag'

export function Sidebar() {
  const navItems = getAccessibleItems(useSession())

  return (
    <nav aria-label="Main">
      <TStack gap={5}>
        {NAV_GROUPS.map((group) => {
          const items = navItems.filter((item) => item.group === group.id)
          if (items.length === 0) return null

          return (
            <TStack key={group.id} gap={1}>
              <p className="m-0 px-2 text-xs font-semibold tracking-wider text-fg-muted uppercase">
                {group.label}
              </p>
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {items.map((item) => (
                  <li key={item.to}>
                    {/* NavLink sets aria-current="page" on the active item (also on its nested routes). */}
                    <NavLink
                      to={item.to}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-fg no-underline transition-colors duration-150 hover:bg-accent-subtle aria-[current=page]:bg-accent-subtle aria-[current=page]:font-medium aria-[current=page]:text-accent-fg"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                      <TechTag tech={item.tech} />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </TStack>
          )
        })}
      </TStack>
    </nav>
  )
}
