<script setup lang="ts">
import { TabsRoot } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tTabsClasses } from './TTabs.variants'
import type { TTabsProps } from './types'

// Tabbed panels (Reka Tabs): v-model, or defaultValue. Each TTabsTrigger and TTabsContent pair shares a
// `value`. Arrow keys move between the tabs, and a focused tab is selected.
defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TTabsProps>(), { defaultValue: undefined })
const model = defineModel<string | undefined>({ default: undefined })
const root = useRootAttrs(() => tTabsClasses)
</script>

<template>
  <TabsRoot
    v-model="model"
    data-slot="tabs"
    v-bind="root()"
    :default-value="defaultValue"
    :orientation="orientation"
    :activation-mode="activationMode"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </TabsRoot>
</template>
