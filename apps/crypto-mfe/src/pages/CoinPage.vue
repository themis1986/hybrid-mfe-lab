<script setup lang="ts">
import { TButton, TSkeleton } from '@repo/ui-vue'
import { computed, defineAsyncComponent } from 'vue'
import ChartFallback from '../components/ChartFallback.vue'
import CoinAbout from '../components/CoinAbout.vue'
import CoinHeader from '../components/CoinHeader.vue'
import CoinStats from '../components/CoinStats.vue'
import ErrorPanel from '../components/ErrorPanel.vue'
import QueryStatus from '../components/QueryStatus.vue'
import { useCoinDetail } from '../hooks/useCoinDetail'

// The chart engine is heavy: it downloads only with its component.
const PriceChart = defineAsyncComponent({
  loader: () => import('../components/PriceChart.vue'),
  loadingComponent: ChartFallback,
})

const props = defineProps<{ id: string }>()

const query = useCoinDetail(() => props.id)
const coin = computed(() => query.data.value)
</script>

<template>
  <div class="flex flex-col gap-4">
    <QueryStatus :query="query" what="this coin">
      <template #not-found>
        <ErrorPanel
          message="That coin wasn’t found"
          description="The link may be out of date."
        >
          <TButton as-child variant="soft" size="sm">
            <RouterLink to="/">Back to the market</RouterLink>
          </TButton>
        </ErrorPanel>
      </template>
      <template #loading>
        <div class="flex flex-col gap-4" aria-hidden="true">
          <TSkeleton shape="block" class="h-12 w-72 max-w-full" />
          <TSkeleton shape="block" class="h-96 w-full" />
          <div
            class="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 @3xl:grid-cols-[repeat(3,minmax(0,1fr))]"
          >
            <TSkeleton v-for="n in 6" :key="n" shape="block" class="h-24" />
          </div>
        </div>
      </template>
      <template v-if="coin">
        <CoinHeader :coin="coin" />
        <!-- Starts after the coin loads, so an unknown id costs one call, and calls don't arrive in a burst. -->
        <PriceChart :id="id" :name="coin.name" />
        <CoinStats :coin="coin" />
        <CoinAbout :coin="coin" />
      </template>
    </QueryStatus>
  </div>
</template>
