<script setup lang="ts">
import { TContainer } from '@repo/ui-vue'
</script>

<template>
  <!-- The font and colour matter standalone, where nothing above this app sets them. -->
  <TContainer size="sm" class="py-8 font-sans text-fg">
    <RouterView />
  </TContainer>
</template>
