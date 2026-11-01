import { useSyncExternalStore } from 'react'
import { findUserByCredentials, findUserById, type User } from './users'

// The signed-in user, for the whole shell. Only the user's id is stored, in sessionStorage: a reload keeps
// the session, closing the tab ends it, and the grants are looked up again so they are never stale.
// Remotes know nothing about it: the shell decides which of them may mount.
export const SESSION_STORAGE_KEY = 'the-lab:session'

const listeners = new Set<() => void>()
let currentUser: User | null = restoreSession()

function restoreSession(): User | null {
  try {
    const id = sessionStorage.getItem(SESSION_STORAGE_KEY)
    return id ? findUserById(id) : null
  } catch {
    // Storage blocked (private mode, policy) or no valid accounts configured: start signed out.
    return null
  }
}

function setSession(user: User | null) {
  currentUser = user
  try {
    if (user) sessionStorage.setItem(SESSION_STORAGE_KEY, user.id)
    else sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // Storage blocked: the session lasts until reload.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Async like a real sign-in request. Rejects when the credentials don't match an account. */
export async function signIn(
  username: string,
  password: string,
): Promise<User> {
  const user = findUserByCredentials(username, password)
  if (!user) throw new Error('Wrong username or password.')
  setSession(user)
  return user
}

export function signOut() {
  setSession(null)
}

export function useSession(): User | null {
  return useSyncExternalStore(subscribe, () => currentUser)
}
