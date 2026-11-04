<script setup lang="ts">
import { useRootAttrs } from '../../lib/attrs'
import { tSkeletonVariants } from './TSkeleton.variants'
import type { TSkeletonProps } from './types'

// A placeholder for content that is loading. It is decorative: announce the loading state elsewhere.
defineOptions({ inheritAttrs: false })
const props = defineProps<TSkeletonProps>()
const root = useRootAttrs(() => tSkeletonVariants({ shape: props.shape }))
</script>

<template>
  <span aria-hidden="true" data-slot="skeleton" v-bind="root()" />
</template>
