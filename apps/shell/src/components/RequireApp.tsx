import type { ReactNode } from 'react'
import { canAccess } from '../lib/access'
import { useSession } from '../lib/auth'
import { type AppId, NAV_ITEMS } from '../lib/navigation'
import { ForbiddenPage } from '../pages/ForbiddenPage'

// Wraps a remote's route. Without access, the remote's host never renders, so its `mount` module and app
// code are never fetched (the federation runtime still fetches every remoteEntry.js at page start).
export function RequireApp({ id, children }: { id: AppId; children: ReactNode }) {
  const user = useSession()
  const app = NAV_ITEMS.find((item) => item.id === id)

  if (!user || !app || !canAccess(user.grants, app)) return <ForbiddenPage />
  return children
}
