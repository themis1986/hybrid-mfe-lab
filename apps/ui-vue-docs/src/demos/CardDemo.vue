<script setup lang="ts">
import { TButton, TCard, TCardBody, TCardFooter, TCardHeader, TGrid } from '@repo/ui-vue'

const variants = ['outline', 'filled', 'elevated'] as const
</script>

<template>
  <TGrid min-child-width="12rem" :gap="3">
    <TCard v-for="variant in variants" :key="variant" :variant="variant">
      <TCardHeader>
        <h4>{{ variant }}</h4>
      </TCardHeader>
      <TCardBody class="text-sm">Body content.</TCardBody>
      <TCardFooter>
        <TButton size="sm" variant="soft" label="Action" />
      </TCardFooter>
    </TCard>
  </TGrid>
</template>
