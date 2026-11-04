<script setup lang="ts">
import { TABLE_FULL_ROW_COLUMN } from '@repo/table-core'
import {
  tDataTableFullCellClasses,
  tDataTableRowClasses,
  tDataTableStateClasses,
} from './TDataTable.variants'

defineProps<{ rowKey: string }>()
</script>

<template>
  <tr
    role="row"
    aria-rowindex="2"
    :data-row-key="rowKey"
    :class="tDataTableRowClasses"
  >
    <td
      role="gridcell"
      tabindex="-1"
      :data-col="TABLE_FULL_ROW_COLUMN"
      :class="tDataTableFullCellClasses"
    >
      <div :class="tDataTableStateClasses"><slot /></div>
    </td>
  </tr>
</template>
