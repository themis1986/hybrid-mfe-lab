<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useRootAttrs } from '../../lib/attrs'
import {
  tPageHeaderActionsClasses,
  tPageHeaderClasses,
  tPageHeaderDescriptionClasses,
  tPageHeaderTextClasses,
  tPageHeaderTitleClasses,
} from './TPageHeader.variants'
import type { TPageHeaderProps } from './types'

defineOptions({ inheritAttrs: false })
withDefaults(defineProps<TPageHeaderProps>(), { as: 'header', headingLevel: 1 })
const root = useRootAttrs(() => tPageHeaderClasses)
</script>

<!-- Slots: `title`, `description`, `actions` (end of the row), and the default slot (under the description). -->
<template>
  <Primitive v-bind="root()" :as="as">
    <div :class="tPageHeaderTextClasses">
      <component :is="`h${headingLevel}`" v-if="title || $slots.title" :class="tPageHeaderTitleClasses">
        <slot name="title">{{ title }}</slot>
      </component>
      <p v-if="description || $slots.description" :class="tPageHeaderDescriptionClasses">
        <slot name="description">{{ description }}</slot>
      </p>
      <slot />
    </div>
    <div v-if="$slots.actions" :class="tPageHeaderActionsClasses">
      <slot name="actions" />
    </div>
  </Primitive>
</template>
