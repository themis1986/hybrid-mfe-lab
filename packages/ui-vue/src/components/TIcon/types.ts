import type { Component } from 'vue'

export interface TIconProps {
  /** The icon to render, imported from '@repo/ui-vue/icons'. */
  icon: Component
  /** Rendered size. */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible name. Without one the icon is decorative and hidden from assistive technology. */
  label?: string
}
