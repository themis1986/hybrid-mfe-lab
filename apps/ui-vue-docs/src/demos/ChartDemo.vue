<script setup lang="ts">
import { TButton, TCluster, TGrid, TStack } from '@repo/ui-vue'
import { type ChartPointEvent, TChart, TPieChart } from '@repo/ui-vue/charts'
import { computed, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { months, regions, sales, share, traffic } from './chartData'

// The chart demo: loaded on its own (defineAsyncComponent), so the chart engine downloads only with it.
// Every button changes props of the same three charts: the "created" count only moves when a chart is
// re-created.
type Stacking = 'normal' | 'percent' | 'off'

const stackings: Stacking[] = ['normal', 'percent', 'off']
const lineChart = useTemplateRef<InstanceType<typeof TChart>>('lineChart')
const visitsData = ref(traffic())
const salesData = ref(sales())
const shareData = ref(share())
const area = ref(false)
const stacking = ref<Stacking>('normal')
const loading = ref(false)
const empty = ref(false)
const live = ref(false)
const picked = ref('Click a point, a bar or a slice.')
const created = ref(0)

const shownSales = computed(() =>
  empty.value
    ? salesData.value.map((series) => ({ ...series, data: [] }))
    : salesData.value,
)

function refresh() {
  visitsData.value = traffic()
  salesData.value = sales()
  shareData.value = share()
}

let timer: ReturnType<typeof setInterval> | undefined
watch(live, (on) => {
  clearInterval(timer)
  if (on) timer = setInterval(refresh, 2000)
})
onUnmounted(() => clearInterval(timer))

function nextStacking() {
  stacking.value =
    stackings[(stackings.indexOf(stacking.value) + 1) % stackings.length]
}
const visits = (value: number) => value.toLocaleString('en')
function onPointClick(event: ChartPointEvent) {
  picked.value = `${event.series.name} · ${event.category}: ${event.value}`
}
function onLoad() {
  created.value++
}
// The escape hatch: the engine's chart.
function logSeries() {
  console.info(lineChart.value?.getChart()?.series.length)
}
</script>

<template>
  <TStack :gap="3">
    <TCluster :gap="2">
      <TButton size="sm" variant="outline" @click="refresh"
        >Update data</TButton
      >
      <TButton
        size="sm"
        :variant="live ? 'soft' : 'outline'"
        :aria-pressed="live"
        @click="live = !live"
      >
        Every 2 s
      </TButton>
      <TButton
        size="sm"
        :variant="area ? 'soft' : 'outline'"
        :aria-pressed="area"
        @click="area = !area"
      >
        Area
      </TButton>
      <TButton size="sm" variant="outline" @click="nextStacking">
        Stacking: {{ stacking }}
      </TButton>
      <TButton
        size="sm"
        :variant="loading ? 'soft' : 'outline'"
        :aria-pressed="loading"
        @click="loading = !loading"
      >
        Loading
      </TButton>
      <TButton
        size="sm"
        :variant="empty ? 'soft' : 'outline'"
        :aria-pressed="empty"
        @click="empty = !empty"
      >
        Empty sales
      </TButton>
      <TButton size="sm" variant="ghost" @click="logSeries">
        Log series count
      </TButton>
    </TCluster>

    <TGrid min-child-width="18rem" :gap="4">
      <div class="h-72">
        <TChart
          ref="lineChart"
          :type="area ? 'area' : 'line'"
          title="Monthly visits"
          :categories="months"
          :series="visitsData"
          :value-format="visits"
          :loading="loading"
          @point-click="onPointClick"
          @load="onLoad"
        />
      </div>
      <div class="h-72">
        <TChart
          type="column"
          title="Sales by region"
          caption="Units sold per product line."
          :categories="regions"
          :series="shownSales"
          :stacking="stacking === 'off' ? undefined : stacking"
          empty-label="No sales yet"
          :loading="loading"
          @point-click="onPointClick"
          @load="onLoad"
        />
      </div>
      <div class="h-72">
        <TPieChart
          title="Share by region"
          :categories="regions"
          :series="shareData"
          :loading="loading"
          @point-click="onPointClick"
          @load="onLoad"
        />
      </div>
    </TGrid>

    <p class="m-0 text-sm text-fg-muted" aria-live="polite">
      {{ picked }} · Charts created: {{ created }}. Switch the page theme: the
      charts follow it without being re-created.
    </p>
  </TStack>
</template>
