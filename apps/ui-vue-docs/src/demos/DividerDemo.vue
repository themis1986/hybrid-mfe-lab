<script setup lang="ts">
import { TDivider, TInline, TStack } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TStack :gap="3">
    <DemoBlock>Above</DemoBlock>
    <TDivider />
    <TInline :gap="3">
      <DemoBlock>Left</DemoBlock>
      <TDivider orientation="vertical" />
      <DemoBlock>Right</DemoBlock>
    </TInline>
  </TStack>
</template>
