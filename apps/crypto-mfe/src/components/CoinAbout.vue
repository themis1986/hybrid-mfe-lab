<script setup lang="ts">
import { TCard } from '@repo/ui-vue'
import type { CoinDetail } from '../types'

defineProps<{ coin: CoinDetail }>()
</script>

<template>
  <TCard variant="filled" :padding="4" as="section" class="min-w-0">
    <h2 class="m-0 text-base font-semibold tracking-tight">
      About {{ coin.name }}
    </h2>
    <!-- Plain text: the provider's markup is removed in src/api/ and is never rendered. -->
    <p class="m-0 mt-2 max-w-prose text-sm leading-relaxed">
      {{ coin.description || 'No description available.' }}
    </p>
    <ul
      v-if="coin.links.length"
      class="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-sm"
    >
      <li v-for="link in coin.links" :key="link.url">
        <a
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent-fg underline"
          >{{ link.label }}</a
        >
      </li>
    </ul>
  </TCard>
</template>
