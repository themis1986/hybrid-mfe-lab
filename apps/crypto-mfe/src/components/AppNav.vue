<script setup lang="ts">
import { TBadge, TButton } from '@repo/ui-vue'
import { useRoute } from 'vue-router'
import { useCryptoState } from '../hooks/useCryptoState'

const route = useRoute()
const { watchlist } = useCryptoState()
</script>

<template>
  <nav aria-label="Crypto market" class="flex flex-wrap items-center gap-1">
    <TButton
      as-child
      size="sm"
      :variant="route.path === '/' ? 'soft' : 'ghost'"
    >
      <RouterLink to="/">Market</RouterLink>
    </TButton>
    <TButton
      as-child
      size="sm"
      :variant="route.path === '/watchlist' ? 'soft' : 'ghost'"
    >
      <RouterLink to="/watchlist">
        Watchlist
        <TBadge v-if="watchlist.length" tone="accent">
          {{ watchlist.length }}
        </TBadge>
      </RouterLink>
    </TButton>
  </nav>
</template>
