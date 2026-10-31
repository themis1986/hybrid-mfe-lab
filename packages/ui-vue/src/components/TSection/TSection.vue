<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import {
  tSectionBodyVariants,
  tSectionDescriptionClasses,
  tSectionHeadingClasses,
  tSectionVariants,
} from './TSection.variants'
import type { TSectionProps } from './types'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TSectionProps>(), { as: 'section', headingLevel: 2 })
const root = useRootAttrs(() => tSectionVariants({ spacing: props.spacing }))
</script>

<template>
  <Primitive v-bind="root()" :as="as">
    <component :is="`h${headingLevel}`" v-if="title || $slots.title" :class="tSectionHeadingClasses">
      <slot name="title">{{ title }}</slot>
    </component>
    <p v-if="description || $slots.description" :class="tSectionDescriptionClasses">
      <slot name="description">{{ description }}</slot>
    </p>
    <div :class="tSectionBodyVariants({ gap })">
      <slot />
    </div>
  </Primitive>
</template>
