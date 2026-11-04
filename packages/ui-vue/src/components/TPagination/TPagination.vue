<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from '@lucide/vue'
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot,
} from 'reka-ui'
import { computed } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import {
  clampPage,
  getPageCount,
  getPaginationItems,
  T_PAGINATION_LABELS,
} from '../../lib/pagination'
import { TButton } from '../TButton'
import { TIcon } from '../TIcon'
import {
  tPaginationButtonVariants,
  tPaginationClasses,
  tPaginationEllipsisVariants,
  tPaginationListClasses,
  tPaginationListItemClasses,
} from './TPagination.variants'
import type { TPaginationProps } from './types'

// Page navigation (Reka Pagination): v-model:page, or defaultPage. The page is clamped before it reaches
// Reka, whose `===` checks would leave Next enabled past the end. A page past the end shows as the last one;
// nothing is reported.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TPaginationProps>(), {
  defaultPage: 1,
  siblingCount: 1,
  showEdges: true,
  as: 'nav',
})
const model = defineModel<number>('page')
const root = useRootAttrs(() => tPaginationClasses)

const requested = computed(() => model.value ?? props.defaultPage)
const pageCount = computed(() => getPageCount(props.total, props.itemsPerPage))
const current = computed(() => clampPage(requested.value, pageCount.value))
const items = computed(() =>
  getPaginationItems(
    current.value,
    pageCount.value,
    props.siblingCount,
    props.showEdges,
  ),
)
const names = computed(() => ({ ...T_PAGINATION_LABELS, ...props.labels }))
const buttonClasses = computed(() =>
  tPaginationButtonVariants({ size: props.size }),
)

// Reka reports a click on the current page too. Against the requested page, not the shown one: picking the
// last page while v-model:page is past the end reports the correction.
function goTo(next: number) {
  if (next !== requested.value) model.value = next
}
</script>

<template>
  <PaginationRoot
    data-slot="pagination"
    aria-label="Pagination"
    v-bind="root()"
    :page="current"
    :total="total"
    :items-per-page="itemsPerPage"
    :disabled="disabled"
    :as="as"
    @update:page="goTo"
  >
    <ul :class="tPaginationListClasses">
      <li v-if="showFirstLast" :class="tPaginationListItemClasses">
        <PaginationFirst as-child :aria-label="names.first">
          <TButton
            data-slot="pagination-first"
            variant="ghost"
            :size="size"
            :class="buttonClasses"
          >
            <TIcon :icon="ChevronsLeft" />
          </TButton>
        </PaginationFirst>
      </li>
      <li :class="tPaginationListItemClasses">
        <PaginationPrev as-child :aria-label="names.previous">
          <TButton
            data-slot="pagination-previous"
            variant="ghost"
            :size="size"
            :class="buttonClasses"
          >
            <TIcon :icon="ChevronLeft" />
          </TButton>
        </PaginationPrev>
      </li>
      <li
        v-for="(item, index) in items"
        :key="item.type === 'page' ? item.value : `ellipsis-${index}`"
        :class="tPaginationListItemClasses"
      >
        <PaginationListItem
          v-if="item.type === 'page'"
          as-child
          :value="item.value"
          :aria-label="names.page(item.value)"
        >
          <TButton
            data-slot="pagination-page"
            :variant="item.value === current ? 'solid' : 'ghost'"
            :size="size"
            :class="buttonClasses"
          >
            {{ item.value }}
          </TButton>
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          as="span"
          data-slot="pagination-ellipsis"
          aria-hidden="true"
          :class="tPaginationEllipsisVariants({ size })"
        />
      </li>
      <li :class="tPaginationListItemClasses">
        <PaginationNext as-child :aria-label="names.next">
          <TButton
            data-slot="pagination-next"
            variant="ghost"
            :size="size"
            :class="buttonClasses"
          >
            <TIcon :icon="ChevronRight" />
          </TButton>
        </PaginationNext>
      </li>
      <li v-if="showFirstLast" :class="tPaginationListItemClasses">
        <PaginationLast as-child :aria-label="names.last">
          <TButton
            data-slot="pagination-last"
            variant="ghost"
            :size="size"
            :class="buttonClasses"
          >
            <TIcon :icon="ChevronsRight" />
          </TButton>
        </PaginationLast>
      </li>
    </ul>
  </PaginationRoot>
</template>
