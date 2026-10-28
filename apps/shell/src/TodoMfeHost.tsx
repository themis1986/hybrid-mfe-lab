import { lazy, Suspense, useEffect, useRef } from 'react'
import { ErrorBoundary } from './ErrorBoundary'

export const TODO_BASE_PATH = '/todo-app'

type MountFn = (typeof import('todo/mount'))['mount']

// Renders an empty container and hands it to the remote. The remote owns everything inside it.
function MountPoint({ mount }: { mount: MountFn }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Under StrictMode this runs mount → unmount → mount in dev; unmount fully tears the app down.
    const unmount = mount(containerRef.current!, { basePath: TODO_BASE_PATH })
    return unmount
  }, [mount])

  return <div ref={containerRef} />
}

// The remote module is fetched from the todo-mfe server the first time this route renders.
const RemoteTodoApp = lazy(async () => {
  const { mount } = await import('todo/mount')
  return { default: () => <MountPoint mount={mount} /> }
})

export function TodoMfeHost() {
  return (
    <ErrorBoundary fallback={<p>The Todo app failed to load. Is the todo-mfe server running?</p>}>
      <Suspense fallback={<p>Loading Todo app…</p>}>
        <RemoteTodoApp />
      </Suspense>
    </ErrorBoundary>
  )
}
