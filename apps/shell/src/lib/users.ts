import type { AccessGrant } from './access'

// A stand-in for an identity provider: the accounts live in the shell's bundle, passwords in plain text.
// Dev only. A real setup checks credentials on a server and gets each user's grants from it (claims,
// roles); only auth.ts calls these functions, so that swap stays there.
export interface User {
  id: string
  name: string
  grants: AccessGrant[]
}

interface Account extends User {
  username: string
  password: string
}

const ACCOUNTS: Account[] = [
  { id: 'u-admin', username: 'admin', password: 'admin', name: 'Ada Admin', grants: [{ kind: 'all' }] },
  { id: 'u-react', username: 'react', password: 'react', name: 'Remy React', grants: [{ kind: 'tech', tech: 'react' }] },
  { id: 'u-vue', username: 'vue', password: 'vue', name: 'Val Vue', grants: [{ kind: 'tech', tech: 'vue' }] },
  { id: 'u-todo', username: 'todo', password: 'todo', name: 'Tess Todo', grants: [{ kind: 'apps', apps: ['todo'] }] },
]

function toUser({ id, name, grants }: Account): User {
  return { id, name, grants }
}

export function findUserByCredentials(username: string, password: string): User | null {
  const account = ACCOUNTS.find((a) => a.username === username.trim() && a.password === password)
  return account ? toUser(account) : null
}

export function findUserById(id: string): User | null {
  const account = ACCOUNTS.find((a) => a.id === id)
  return account ? toUser(account) : null
}
