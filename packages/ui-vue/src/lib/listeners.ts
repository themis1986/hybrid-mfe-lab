import { getCurrentInstance } from 'vue'

/**
 * Whether the parent listens to an event (`hasListener('onFeatureClick')`): a clickable layer or chart
 * shows a pointer cursor, and unhandled map errors are logged.
 */
export function useListeners() {
  const instance = getCurrentInstance()
  return (name: string) => Boolean(instance?.vnode.props?.[name])
}
