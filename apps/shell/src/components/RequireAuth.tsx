import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useSession } from '../lib/auth'

// Renders its children only for a signed-in user. Anyone else goes to the login page, which sends them
// back to this URL once signed in.
export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useSession()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
