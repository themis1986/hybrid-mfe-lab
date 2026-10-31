<script setup lang="ts">
import { TSection } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <TSection title="Section title" description="A short description of the section." :heading-level="4">
    <DemoBlock>Body item</DemoBlock>
    <DemoBlock>Body item</DemoBlock>
  </TSection>
</template>
