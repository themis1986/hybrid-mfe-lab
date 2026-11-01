<script setup lang="ts">
import { TabsContent } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tTabsContentClasses } from './TTabs.variants'
import type { TTabsContentProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TTabsContentProps>()
const root = useRootAttrs(() => tTabsContentClasses)
</script>

<template>
  <TabsContent
    data-slot="tabs-content"
    v-bind="root()"
    :value="value"
    :as="as"
    :as-child="asChild"
  >
    <slot />
  </TabsContent>
</template>
