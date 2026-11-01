import { TButton } from '@repo/ui'
import { signOut, useSession } from '../lib/auth'

export function UserMenu() {
  const user = useSession()
  if (!user) return null

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-sm text-fg max-sm:hidden">{user.name}</span>
      <TButton size="sm" variant="ghost" onClick={signOut}>
        Sign out
      </TButton>
    </span>
  )
}
