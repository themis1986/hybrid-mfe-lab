<script setup lang="ts">
import { TAspectRatio, TGrid } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'

const ratios = ['square', '4-3', '3-2', '16-9', '21-9', 2.5] as const
</script>

<template>
  <TGrid min-child-width="7rem" :gap="2">
    <TAspectRatio v-for="ratio in ratios" :key="ratio" :ratio="ratio">
      <DemoBlock class="flex h-full items-center justify-center">{{ ratio }}</DemoBlock>
    </TAspectRatio>
  </TGrid>
</template>
