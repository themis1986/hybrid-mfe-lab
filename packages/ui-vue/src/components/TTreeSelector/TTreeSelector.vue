<script setup lang="ts">
import { Check, ChevronDown, ChevronRight, Minus } from '@lucide/vue'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TreeItem,
  type TreeItemSelectEvent,
  type TreeItemToggleEvent,
  TreeRoot,
} from 'reka-ui'
import { computed, nextTick, ref, useAttrs, useId, useTemplateRef } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import {
  ancestorsOf,
  indexTree,
  isTreeParent,
  nodeState,
  type TTreeNode,
  toggleSubtree,
  toLeaves,
  toValue,
} from '../../lib/tree'
import {
  tCheckboxIconClasses,
  tCheckboxIndeterminateIconClasses,
  tCheckboxIndicatorClasses,
  tCheckboxVariants,
} from '../TCheckbox/TCheckbox.variants'
import { TIcon } from '../TIcon'
import { tInputVariants } from '../TInput/TInput.variants'
import { tRadioIndicatorClasses, tRadioVariants } from '../TRadioGroup/TRadioGroup.variants'
import {
  tSelectChevronClasses,
  tSelectContentClasses,
  tSelectIndicatorClasses,
  tSelectTriggerClasses,
  tSelectValueClasses,
  tSelectViewportClasses,
} from '../TSelect/TSelect.variants'
import {
  tTreeChevronClasses,
  tTreeChevronSpacerClasses,
  tTreeItemClasses,
  tTreeLabelClasses,
  tTreeParentLabelClasses,
} from './TTreeSelector.variants'
import type { TTreeSelectorProps } from './types'

// A select whose options are a tree (`options` nodes with `children`), in a Reka Popover with a Reka Tree.
// Single mode picks one leaf and closes; parents only expand. With `multiple`, each row has a checkbox, a
// parent selects or clears its whole subtree and shows a partial state, and `valueMode` decides whether a
// fully selected parent appears in the value as itself or as its leaves. Reka gives the tree its structure,
// focus and expansion; its selection events are prevented and handled by lib/tree.ts, shared with React.
// Name it with `aria-label` or a <label for> pointing at its `id`. The caller's attributes go on the trigger.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TTreeSelectorProps>(), { defaultValue: undefined, valueMode: 'leaves' })
const model = defineModel<string | string[] | undefined>({ default: undefined })
const attrs = useAttrs()
const trigger = useRootAttrs(() => cn(tInputVariants({ size: props.size }), tSelectTriggerClasses))
const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef')
const treeId = `${useId()}-tree`

const toArray = (value: string | string[] | undefined) => (value === undefined ? [] : Array.isArray(value) ? value : [value])

const index = computed(() => indexTree(props.options))
// Without a bound v-model, the selection lives here.
const local = ref(toArray(props.defaultValue))
const value = computed(() => (model.value === undefined ? local.value : toArray(model.value)))
const selected = computed(() => toLeaves(index.value, value.value))
// The value as displayed and submitted: in multiple mode, rewritten for the value mode.
const shown = computed(() =>
  props.multiple ? toValue(props.options, index.value, selected.value, props.valueMode) : value.value.slice(0, 1),
)
const labels = computed(() => shown.value.flatMap((v) => index.value.get(v)?.node.label ?? []))
// What Reka marks aria-selected: a leaf, or in multiple mode any node whose whole subtree is selected.
const treeModel = computed(() =>
  props.multiple
    ? [...index.value.values()].filter((entry) => nodeState(entry, selected.value) === 'checked').map((e) => e.node)
    : index.value.get(shown.value[0] ?? '')?.node,
)

const open = ref(false)
const expanded = ref<string[]>([])

const getKey = (node: TTreeNode) => node.value
const getChildren = (node: TTreeNode) => (isTreeParent(node) ? node.children : undefined)
const stateOf = (nodeValue: string) => nodeState(index.value.get(nodeValue)!, selected.value)

const contentStyle = {
  '--t-select-trigger-width': 'var(--reka-popover-trigger-width)',
  '--t-select-available-height': 'var(--reka-popover-content-available-height)',
}

// Opening also expands the parents of the selection, so it is visible.
function setOpen(next: boolean) {
  if (next) expanded.value = [...new Set([...expanded.value, ...ancestorsOf(index.value, shown.value)])]
  open.value = next
}

function toggleExpanded(nodeValue: string) {
  expanded.value = expanded.value.includes(nodeValue)
    ? expanded.value.filter((v) => v !== nodeValue)
    : [...expanded.value, nodeValue]
}

function commit(leaves: ReadonlySet<string>) {
  const next = toValue(props.options, index.value, leaves, props.multiple ? props.valueMode : 'leaves')
  local.value = next
  model.value = props.multiple ? next : next[0]
}

function onSelect(event: TreeItemSelectEvent<TTreeNode>, node: TTreeNode) {
  event.preventDefault()
  const entry = index.value.get(node.value)!
  if (entry.disabled) return
  if (props.multiple) {
    commit(toggleSubtree(index.value, entry, selected.value))
  } else if (isTreeParent(node)) {
    // A click toggles through Reka's toggle event as well; Enter and Space only select, so toggle here.
    if (event.detail.originalEvent.type !== 'click') toggleExpanded(node.value)
  } else {
    commit(new Set([node.value]))
    open.value = false
  }
}

// In multiple mode a click on a parent row selects its subtree; only its chevron expands it.
function onToggle(event: TreeItemToggleEvent<TTreeNode>) {
  if (props.multiple && event.detail.originalEvent.type === 'click') event.preventDefault()
}

// Opening focuses the first selected row, or the first enabled one.
async function onOpenAutoFocus(event: Event) {
  event.preventDefault()
  await nextTick()
  const tree = document.getElementById(treeId)
  const row =
    tree?.querySelector<HTMLElement>('[role=treeitem][aria-selected=true]:not([data-disabled])') ??
    tree?.querySelector<HTMLElement>('[role=treeitem]:not([data-disabled])')
  row?.focus({ preventScroll: true })
}

function onTriggerKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    setOpen(true)
  }
}
</script>

<template>
  <PopoverRoot :open="open" @update:open="setOpen">
    <PopoverTrigger as-child>
      <button
        ref="triggerRef"
        v-bind="trigger()"
        type="button"
        data-slot="select-trigger"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="open"
        :aria-controls="open ? treeId : undefined"
        :aria-invalid="invalid || undefined"
        :data-placeholder="labels.length ? undefined : ''"
        :disabled="disabled"
        @keydown="onTriggerKeyDown"
      >
        <span :class="tSelectValueClasses">{{ labels.length ? labels.join(', ') : placeholder }}</span>
        <TIcon :icon="ChevronDown" :class="tSelectChevronClasses" />
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        data-slot="select-content"
        side="bottom"
        align="start"
        :side-offset="4"
        :class="tSelectContentClasses"
        :style="contentStyle"
        @open-auto-focus="onOpenAutoFocus"
      >
        <TreeRoot
          :id="treeId"
          v-slot="{ flattenItems }"
          v-model:expanded="expanded"
          as="div"
          :items="options"
          :get-key="getKey"
          :get-children="getChildren"
          :multiple="multiple"
          :model-value="treeModel"
          :aria-label="attrs['aria-label']"
          :aria-labelledby="attrs['aria-labelledby']"
          :class="tSelectViewportClasses"
          @keydown.tab.prevent
        >
          <TreeItem
            v-for="item in flattenItems"
            :key="item._id"
            v-bind="item.bind"
            as="div"
            data-slot="tree-item"
            :disabled="index.get(item._id)!.disabled"
            :class="tTreeItemClasses"
            :style="{ '--t-tree-level': item.level }"
            @select="onSelect($event, item.value)"
            @toggle="onToggle"
          >
            <TIcon
              v-if="item.hasChildren"
              :icon="ChevronRight"
              :class="tTreeChevronClasses"
              @click.stop="!index.get(item._id)!.disabled && toggleExpanded(item._id)"
            />
            <span v-else aria-hidden="true" :class="tTreeChevronSpacerClasses" />
            <span v-if="multiple" aria-hidden="true" :class="cn(tCheckboxVariants({ size: 'sm' }), tSelectIndicatorClasses)">
              <span v-if="stateOf(item._id) !== 'unchecked'" :data-state="stateOf(item._id)" :class="tCheckboxIndicatorClasses">
                <TIcon :icon="Check" :class="tCheckboxIconClasses" />
                <TIcon :icon="Minus" :class="tCheckboxIndeterminateIconClasses" />
              </span>
            </span>
            <span
              v-else-if="!item.hasChildren"
              aria-hidden="true"
              :class="cn(tRadioVariants({ size: 'sm' }), tSelectIndicatorClasses)"
            >
              <span v-if="stateOf(item._id) === 'checked'" :class="tRadioIndicatorClasses" />
            </span>
            <span :class="cn(tTreeLabelClasses, !multiple && item.hasChildren && tTreeParentLabelClasses)">{{ item.value.label }}</span>
          </TreeItem>
        </TreeRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
  <!-- Form submission and `required` validation, as TSelect's. Focusing it (an invalid form does) moves focus
       to the trigger. -->
  <select
    v-if="name !== undefined"
    :multiple="multiple"
    aria-hidden="true"
    tabindex="-1"
    :name="name"
    :required="required"
    :disabled="disabled"
    class="sr-only"
    @focus="triggerRef?.focus()"
  >
    <option v-if="!multiple" value="" :selected="!shown.length" />
    <option v-for="[nodeValue, entry] in index" :key="nodeValue" :value="nodeValue" :selected="shown.includes(nodeValue)">
      {{ entry.node.label }}
    </option>
  </select>
</template>
