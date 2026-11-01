<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tTabsTriggerClasses } from './TTabs.variants'
import type { TTabsTriggerProps } from './types'

defineOptions({ inheritAttrs: false })
defineProps<TTabsTriggerProps>()
const root = useRootAttrs(() => tTabsTriggerClasses)
</script>

<template>
  <TabsTrigger data-slot="tabs-trigger" v-bind="root()" :value="value" :disabled="disabled" :as="as" :as-child="asChild">
    <slot />
  </TabsTrigger>
</template>
