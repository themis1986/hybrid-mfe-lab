<script setup lang="ts">
import { TButton, TSwitch } from '@repo/ui-vue'
import {
  parseTableState,
  serializeTableState,
  TDataTable,
  type TDataTableColumn,
  type TableState,
} from '@repo/ui-vue/table'
import { computed, ref, shallowRef, watch } from 'vue'
import { fetchPeople, type Person, STATUS_OPTIONS } from './tableData'

const columns: TDataTableColumn<Person>[] = [
  { accessorKey: 'name', title: 'Name', type: 'avatar', width: 240 },
  {
    accessorKey: 'status',
    title: 'Status',
    type: 'badge',
    badge: {
      tones: { active: 'success', away: 'warning', left: 'neutral' },
      labels: { active: 'Active', away: 'Away', left: 'Left' },
    },
    filter: { type: 'multiSelect', options: STATUS_OPTIONS },
  },
  { accessorKey: 'team', title: 'Team' },
  {
    accessorKey: 'salary',
    title: 'Salary',
    type: 'number',
    number: { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 },
  },
]

const getRowId = (person: Person) => person.id
const STORAGE_KEY = 't-docs-table-state'

function readStoredState(): Partial<TableState> {
  try {
    return parseTableState(localStorage.getItem(STORAGE_KEY), columns)
  } catch {
    return {}
  }
}

const state = shallowRef<Partial<TableState>>({
  pagination: { pageIndex: 0, pageSize: 10 },
  ...readStoredState(),
})
const result = shallowRef<{ rows: Person[]; total: number }>()
const fetching = ref(true)
const error = ref<unknown>()
const failNext = ref(false)
const attempt = ref(0)

const statuses = computed(
  () =>
    (state.value.columnFilters?.find((filter) => filter.id === 'status')
      ?.value as string[] | undefined) ?? [],
)

watch(
  [
    () => state.value.pagination,
    () => state.value.sorting,
    () => state.value.globalFilter,
    statuses,
    failNext,
    attempt,
  ],
  (_values, _old, onCleanup) => {
    let current = true
    onCleanup(() => {
      current = false
    })
    fetching.value = true
    fetchPeople(
      {
        pageIndex: state.value.pagination?.pageIndex ?? 0,
        pageSize: state.value.pagination?.pageSize ?? 10,
        sorting: state.value.sorting ?? [],
        search: state.value.globalFilter ?? '',
        statuses: statuses.value,
      },
      { fail: failNext.value },
    ).then(
      (next) => {
        if (!current) return
        result.value = next
        error.value = undefined
        fetching.value = false
      },
      (reason: unknown) => {
        if (!current) return
        error.value = reason
        fetching.value = false
      },
    )
  },
  { immediate: true },
)

const onStateChange = (next: TableState) => {
  try {
    localStorage.setItem(STORAGE_KEY, serializeTableState(next))
  } catch {
    // Private window: the state just isn't kept.
  }
}
const retry = () => {
  failNext.value = false
  attempt.value += 1
}
</script>

<template>
  <TDataTable
    v-model:state="state"
    aria-label="People on a server"
    mode="server"
    :data="result?.rows ?? []"
    :row-count="result?.total ?? 0"
    :columns="columns"
    :get-row-id="getRowId"
    selection="multiple"
    search
    :max-height="420"
    :loading="fetching && !result && !error"
    :refetching="fetching && Boolean(result)"
    :error="error"
    @state-change="onStateChange"
    @retry="retry"
  >
    <template #toolbar>
      <TSwitch v-model="failNext" aria-label="Fail the next request" />
      <TButton variant="outline" size="sm" @click="attempt += 1"
        >Refetch</TButton
      >
    </template>
  </TDataTable>
</template>
