<script setup lang="ts">
import { formatTableDate, formatTableNumber } from '@repo/table-core'
import { computed } from 'vue'
import { TAvatar } from '../TAvatar'
import { TBadge } from '../TBadge'
import { TProgress } from '../TProgress'
import ActionsMenu from './ActionsMenu.vue'
import { useDataTableContext } from './context'
import {
  tDataTableCellAvatarClasses,
  tDataTableCellNumberClasses,
  tDataTableCellProgressClasses,
  tDataTableCellProgressValueClasses,
  tDataTableCellTextClasses,
} from './TDataTable.variants'
import type { TDataTableColumn } from './types'

// What a cell shows for its `type`, when the table has no `#cell-<id>` slot for the column.
const props = defineProps<{
  spec: TDataTableColumn<any>
  value: unknown
  row: unknown
}>()
const { locale } = useDataTableContext()

const progressAmount = computed(() =>
  typeof props.value === 'number' ? props.value : Number(props.value ?? 0),
)
const progressMax = computed(() => props.spec.progress?.max ?? 100)
const progressPercent = computed(() =>
  Math.round((progressAmount.value / progressMax.value) * 100),
)
const avatarName = computed(
  () => props.spec.avatar?.name?.(props.row) ?? String(props.value ?? ''),
)
const badgeKey = computed(() => String(props.value))
</script>

<template>
  <span v-if="spec.type === 'number'" :class="tDataTableCellNumberClasses">{{
    formatTableNumber(value, locale, spec.number)
  }}</span>
  <span v-else-if="spec.type === 'date'" :class="tDataTableCellTextClasses">{{
    formatTableDate(value, locale, spec.date)
  }}</span>
  <template v-else-if="spec.type === 'badge'">
    <TBadge
      v-if="value !== null && value !== undefined"
      :tone="spec.badge?.tones?.[badgeKey] ?? 'neutral'"
    >
      {{ spec.badge?.labels?.[badgeKey] ?? badgeKey }}
    </TBadge>
  </template>
  <span
    v-else-if="spec.type === 'progress'"
    :class="tDataTableCellProgressClasses"
  >
    <TProgress
      :value="progressAmount"
      :max="progressMax"
      size="sm"
      :tone="spec.progress?.tone"
      :aria-label="`${spec.title}: ${progressPercent}%`"
    />
    <span :class="tDataTableCellProgressValueClasses"
      >{{ progressPercent }}%</span
    >
  </span>
  <span v-else-if="spec.type === 'avatar'" :class="tDataTableCellAvatarClasses">
    <TAvatar :name="avatarName" :src="spec.avatar?.src?.(row)" size="sm" />
    <span :class="tDataTableCellTextClasses">{{ avatarName }}</span>
  </span>
  <ActionsMenu v-else-if="spec.type === 'actions'" :spec="spec" :row="row" />
  <span v-else :class="tDataTableCellTextClasses">{{
    value === null || value === undefined ? '' : String(value)
  }}</span>
</template>
