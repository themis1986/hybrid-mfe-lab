import { type ComponentType, lazy, Suspense, useEffect, useRef } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

/** The federation contract every microfrontend exposes as `./mount` (typed per remote in remotes.d.ts). */
export type MountFn = (el: HTMLElement, props: { basePath: string }) => () => void

// Renders an empty container and hands it to the remote. The remote owns everything inside it.
function MountPoint({ mount, basePath }: { mount: MountFn; basePath: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Under StrictMode this runs mount → unmount → mount in dev; unmount fully tears the app down.
    const unmount = mount(containerRef.current!, { basePath })
    return unmount
  }, [mount, basePath])

  return <div ref={containerRef} />
}

/**
 * Creates the host component for one remote. The remote module is fetched from its server the first
 * time the component renders; the remote then runs under `basePath`.
 */
export function createRemoteHost(
  load: () => Promise<{ mount: MountFn }>,
  basePath: string,
  appName: string,
): ComponentType {
  const RemoteApp = lazy(async () => {
    const { mount } = await load()
    return { default: () => <MountPoint mount={mount} basePath={basePath} /> }
  })

  return function RemoteHost() {
    return (
      <ErrorBoundary fallback={<p>The {appName} failed to load. Is its server running?</p>}>
        <Suspense fallback={<p>Loading {appName}…</p>}>
          <RemoteApp />
        </Suspense>
      </ErrorBoundary>
    )
  }
}
