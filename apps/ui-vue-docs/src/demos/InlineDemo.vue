<script setup lang="ts">
import { TInline, TSpacer } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TInline :gap="2" wrap>
    <DemoBlock>Left</DemoBlock>
    <DemoBlock>Middle</DemoBlock>
    <TSpacer />
    <DemoBlock>Pushed right by a spacer</DemoBlock>
  </TInline>
</template>
