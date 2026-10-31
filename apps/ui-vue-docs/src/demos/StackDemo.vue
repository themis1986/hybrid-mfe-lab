<script setup lang="ts">
import { TStack } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TStack :gap="2">
    <DemoBlock>One</DemoBlock>
    <DemoBlock>Two</DemoBlock>
    <DemoBlock>Three</DemoBlock>
  </TStack>
</template>
