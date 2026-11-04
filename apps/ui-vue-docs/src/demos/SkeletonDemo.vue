<script setup lang="ts">
import { TCluster, TSkeleton, TStack } from '@repo/ui-vue'
</script>

<template>
  <TCluster :gap="4" align="center">
    <TSkeleton shape="circle" />
    <TStack :gap="2" class="w-48">
      <TSkeleton />
      <TSkeleton class="w-2/3" />
    </TStack>
    <div class="h-16 w-32"><TSkeleton shape="block" /></div>
  </TCluster>
</template>
