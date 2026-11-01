<script setup lang="ts">
import { Maximize2 } from '@lucide/vue'
import { TButton } from '../TButton'
import { TCard, TCardBody, TCardHeader } from '../TCard'
import { TDialog, TDialogBody, TDialogContent, TDialogHeader, TDialogTitle, TDialogTrigger } from '../TDialog'
import { TIcon } from '../TIcon'
import { tWidgetExpandClasses, tWidgetExpandedHeaderClasses, tWidgetHeaderClasses } from './TWidget.variants'
import type { TWidgetProps } from './types'

// The root, TDialog, renders no element: the caller's attributes go on the card, which merges the class.
defineOptions({ inheritAttrs: false })
// Explicit undefined, as in TDialog: an absent boolean would otherwise cast to `false`.
withDefaults(defineProps<TWidgetProps>(), {
  defaultExpanded: undefined,
  expandedSize: 'full',
  expandLabel: 'Expand',
  headingLevel: 3,
})
const expanded = defineModel<boolean | undefined>('expanded', { default: undefined })
</script>

<!--
  A card whose expand button opens an expanded view in a dialog (full screen by default). The expanded
  slots fall back to the normal ones. The dialog is always named by the title: with a custom header, the
  title stays there for assistive technology only.
-->
<template>
  <TDialog v-model:open="expanded" :default-open="defaultExpanded">
    <TCard data-slot="widget" v-bind="$attrs" :variant="variant" :padding="padding" :as="as">
      <TCardHeader>
        <div :class="tWidgetHeaderClasses">
          <slot name="header">
            <component :is="`h${headingLevel}`">{{ title }}</component>
          </slot>
        </div>
        <TDialogTrigger as-child>
          <TButton variant="ghost" size="sm" :aria-label="`${expandLabel} ${title}`" :class="tWidgetExpandClasses">
            <TIcon :icon="Maximize2" size="sm" />
          </TButton>
        </TDialogTrigger>
      </TCardHeader>
      <TCardBody>
        <slot />
      </TCardBody>
    </TCard>
    <TDialogContent :size="expandedSize">
      <TDialogHeader>
        <template v-if="$slots['expanded-header'] || $slots.header">
          <TDialogTitle class="sr-only">{{ title }}</TDialogTitle>
          <div :class="tWidgetExpandedHeaderClasses">
            <slot name="expanded-header">
              <slot name="header" />
            </slot>
          </div>
        </template>
        <TDialogTitle v-else>{{ title }}</TDialogTitle>
      </TDialogHeader>
      <TDialogBody>
        <slot name="expanded-content">
          <slot />
        </slot>
      </TDialogBody>
    </TDialogContent>
  </TDialog>
</template>
