type Remote = { entry?: string }
type InitArgs = { userOptions: { remotes?: Remote[] } }

/**
 * A remote entry on `localhost` is on the machine serving this page, which for another device on the
 * network is not its own `localhost`. So those entries use the host the page was opened through.
 * An entry on any other host (a deployed remote) stays as configured.
 */
export default function sameHostRemotes() {
  return {
    name: 'same-host-remotes',
    beforeInit<Args extends InitArgs>(args: Args): Args {
      for (const remote of args.userOptions.remotes ?? []) {
        if (!remote.entry) continue
        const url = new URL(remote.entry)
        if (url.hostname !== 'localhost') continue
        url.hostname = window.location.hostname
        remote.entry = url.href
      }
      return args
    },
  }
}
