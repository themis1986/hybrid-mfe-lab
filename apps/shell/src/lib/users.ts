import type { AccessGrant } from './access'
import { NAV_ITEMS, TECHS } from './navigation'

// A stand-in for an identity provider: the accounts come from VITE_MOCK_ACCOUNTS (a JSON array, set in
// apps/shell/.env.local; see .env.example), passwords in plain text. Vite inlines the value into the
// shell's bundle, so this keeps the accounts out of git, not out of the browser. Dev only. A real setup
// checks credentials on a server and gets each user's grants from it (claims, roles); only auth.ts calls
// these functions, so that swap stays there.
export interface User {
  id: string
  name: string
  grants: AccessGrant[]
}

interface Account extends User {
  username: string
  password: string
}

let accounts: Account[] | undefined

// Parsed on first use, so a missing or broken value fails the sign-in with its message, not the whole page.
function getAccounts(): Account[] {
  accounts ??= parseAccounts(import.meta.env.VITE_MOCK_ACCOUNTS)
  return accounts
}

function parseAccounts(json: string | undefined): Account[] {
  if (!json) throw new Error('No accounts: set VITE_MOCK_ACCOUNTS in apps/shell/.env.local (see .env.example).')

  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw new Error('VITE_MOCK_ACCOUNTS is not valid JSON.')
  }
  if (!Array.isArray(value)) throw new Error('VITE_MOCK_ACCOUNTS must be a JSON array of accounts.')

  const invalid = value.findIndex((account) => !isAccount(account))
  if (invalid !== -1) throw new Error(`VITE_MOCK_ACCOUNTS: account ${invalid} is invalid (see .env.example).`)
  return value
}

function isAccount(value: unknown): value is Account {
  if (typeof value !== 'object' || value === null) return false
  const account = value as Record<string, unknown>
  return (
    ['id', 'username', 'password', 'name'].every((key) => typeof account[key] === 'string') &&
    Array.isArray(account.grants) &&
    account.grants.every(isGrant)
  )
}

// Unknown techs and app ids are rejected: a typo would otherwise grant nothing, silently.
function isGrant(value: unknown): value is AccessGrant {
  if (typeof value !== 'object' || value === null) return false
  const grant = value as Record<string, unknown>
  switch (grant.kind) {
    case 'all':
      return true
    case 'tech':
      return TECHS.some((tech) => tech === grant.tech)
    case 'apps':
      return Array.isArray(grant.apps) && grant.apps.every((id) => NAV_ITEMS.some((item) => item.id === id))
    default:
      return false
  }
}

function toUser({ id, name, grants }: Account): User {
  return { id, name, grants }
}

export function findUserByCredentials(username: string, password: string): User | null {
  const account = getAccounts().find((a) => a.username === username.trim() && a.password === password)
  return account ? toUser(account) : null
}

export function findUserById(id: string): User | null {
  const account = getAccounts().find((a) => a.id === id)
  return account ? toUser(account) : null
}
