<script setup lang="ts">
import { TabsList } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import { tTabsListVariants } from './TTabs.variants'
import type { TTabsListProps } from './types'

defineOptions({ inheritAttrs: false })
const props = defineProps<TTabsListProps>()
const root = useRootAttrs(() => tTabsListVariants({ variant: props.variant }))
</script>

<template>
  <TabsList data-slot="tabs-list" v-bind="root()" :as="as" :as-child="asChild">
    <slot />
  </TabsList>
</template>
