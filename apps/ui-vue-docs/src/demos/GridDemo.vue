<script setup lang="ts">
import { TGrid, TStack } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TStack :gap="3">
    <TGrid :cols="3" :gap="2">
      <DemoBlock v-for="n in 6" :key="n">cols=3 · {{ n }}</DemoBlock>
    </TGrid>
    <TGrid min-child-width="9rem" :gap="2">
      <DemoBlock v-for="n in 5" :key="n">min 9rem · {{ n }}</DemoBlock>
    </TGrid>
  </TStack>
</template>
