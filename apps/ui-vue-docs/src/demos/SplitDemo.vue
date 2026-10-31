<script setup lang="ts">
import { TSplit, TStack } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TStack :gap="3">
    <TSplit min-pane-width="10rem">
      <DemoBlock>1</DemoBlock>
      <DemoBlock>1</DemoBlock>
    </TSplit>
    <TSplit ratio="1-2" min-pane-width="8rem">
      <DemoBlock>1</DemoBlock>
      <DemoBlock>2</DemoBlock>
    </TSplit>
  </TStack>
</template>
