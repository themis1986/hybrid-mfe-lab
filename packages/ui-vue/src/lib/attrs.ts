import { type ClassValue } from 'clsx'
import { type StyleValue, useAttrs } from 'vue'
import { cn } from './cn'

/**
 * Bindings for a component's root, in components with `inheritAttrs: false`: the caller's attributes and
 * listeners, the component's classes merged with the caller's class (the caller wins conflicts, through
 * tailwind-merge), and the component's style before the caller's.
 *
 * Returns a function to call in the template (`v-bind="root()"`): `useAttrs()` isn't reactive, but the
 * template re-renders whenever the attributes change.
 */
export function useRootAttrs(classes: () => ClassValue, style?: () => StyleValue) {
  const attrs = useAttrs()

  return () => {
    const { class: callerClass, style: callerStyle, ...rest } = attrs
    return { ...rest, class: cn(classes(), callerClass as ClassValue), style: [style?.(), callerStyle as StyleValue] }
  }
}
