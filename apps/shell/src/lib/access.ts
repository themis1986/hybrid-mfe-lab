import type { AppId, Tech } from './navigation'

// What a user may open. A user holds a list of grants and may open an app if any grant allows it, so
// grants combine (e.g. every React app plus one named app).
export type AccessGrant =
  | { kind: 'all' }
  | { kind: 'tech'; tech: Tech }
  | { kind: 'apps'; apps: AppId[] }

// The one access rule: the menu, the home page and the route guards all go through it.
export function canAccess(grants: readonly AccessGrant[], app: { id: AppId; tech: Tech }): boolean {
  return grants.some((grant) => {
    switch (grant.kind) {
      case 'all':
        return true
      case 'tech':
        return grant.tech === app.tech
      case 'apps':
        return grant.apps.includes(app.id)
    }
  })
}
