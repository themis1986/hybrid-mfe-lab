<script setup lang="ts">
import { TInline, TSpacer } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TInline :gap="2">
    <DemoBlock>Start</DemoBlock>
    <TSpacer />
    <DemoBlock>End</DemoBlock>
  </TInline>
</template>
