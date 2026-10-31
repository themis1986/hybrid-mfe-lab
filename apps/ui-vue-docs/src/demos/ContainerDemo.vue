<script setup lang="ts">
import { TContainer, TStack } from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'

const sizes = ['sm', 'md', 'lg', 'full'] as const
</script>

<template>
  <TStack :gap="2">
    <TContainer v-for="size in sizes" :key="size" :size="size" class="px-0">
      <DemoBlock>size="{{ size }}"</DemoBlock>
    </TContainer>
  </TStack>
</template>
