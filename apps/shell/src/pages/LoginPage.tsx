import {
  TButton,
  TCard,
  TCardBody,
  TCardHeader,
  TField,
  TStack,
} from '@repo/ui'
import { type FormEvent, useState } from 'react'
import { type Location, Navigate, useLocation } from 'react-router'
import { Logo } from '../components/Logo'
import { signIn, useSession } from '../lib/auth'
import { canOpenPath } from '../lib/navigation'

// Rendered outside the app frame. Once the session is set, the redirect below takes the user back to the
// page RequireAuth sent them from, unless this user can't open it (it may be the previous user's page).
export function LoginPage() {
  const user = useSession()
  const location = useLocation()
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  if (user) {
    const from = (location.state as { from?: Location } | null)?.from
    const back =
      from && canOpenPath(user, from.pathname)
        ? `${from.pathname}${from.search}${from.hash}`
        : '/'
    return <Navigate to={back} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setError(undefined)
    try {
      await signIn(String(data.get('username')), String(data.get('password')))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.')
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-4 text-fg">
      <TCard variant="elevated" className="w-full max-w-sm">
        <TCardHeader>
          <Logo />
        </TCardHeader>
        <TCardBody>
          <form onSubmit={handleSubmit}>
            <TStack gap={4}>
              <h1 className="m-0 text-lg font-semibold">Sign in</h1>
              <TField
                label="Username"
                name="username"
                autoComplete="username"
                required
              />
              <TField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                error={error}
              />
              <TButton type="submit" disabled={pending}>
                Sign in
              </TButton>
            </TStack>
          </form>
        </TCardBody>
      </TCard>
    </main>
  )
}
