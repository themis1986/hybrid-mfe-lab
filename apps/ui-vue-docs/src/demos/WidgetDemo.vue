<script setup lang="ts">
import { TGrid, TStack, TWidget } from '@repo/ui-vue'
import { ref } from 'vue'
import DemoBlock from '../components/DemoBlock.vue'

const expanded = ref(false)
</script>

<template>
  <TGrid min-child-width="16rem" :gap="3">
    <TWidget title="Visitors">
      <span class="text-sm text-fg-muted"
        >Expanded, the same content renders again in the dialog.</span
      >
    </TWidget>
    <TWidget v-model:expanded="expanded" title="Sales" variant="elevated">
      <template #header>
        <h3>Sales</h3>
        <span
          class="rounded-full border border-accent-line px-2.5 py-0.5 text-xs text-accent-fg"
          >+12%</span
        >
      </template>
      <TStack :gap="2">
        <DemoBlock>Order 1</DemoBlock>
        <DemoBlock>Order 2</DemoBlock>
        <span class="text-sm text-fg-muted"
          >v-model:expanded: {{ expanded ? 'expanded' : 'collapsed' }}</span
        >
      </TStack>
      <template #expanded-content>
        <TStack :gap="2">
          <DemoBlock v-for="i in 30" :key="i">Order {{ i }}</DemoBlock>
        </TStack>
      </template>
    </TWidget>
  </TGrid>
</template>
