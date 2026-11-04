import { networkInterfaces } from 'node:os'

const PRIVATE_IPV4 = /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/

// Vite's default (localhost only) plus the private IPv4 ranges, so a page opened through the machine's
// network address may load the remotes. Never `cors: true`: any website could then read the dev servers.
const LOCAL_ORIGIN =
  /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)(?::\d+)?$/

/** Reachable from other devices on the network. For both `server` and `preview`. */
export function networkServer(port) {
  return { port, strictPort: true, host: true, cors: { origin: LOCAL_ORIGIN } }
}

/** A remote's `server.origin`: the machine's network address, or localhost when it has none. */
export function networkOrigin(port) {
  const address = Object.values(networkInterfaces())
    .flat()
    .find(
      (entry) =>
        entry?.family === 'IPv4' &&
        !entry.internal &&
        PRIVATE_IPV4.test(entry.address),
    )?.address
  return `http://${address ?? 'localhost'}:${port}`
}
