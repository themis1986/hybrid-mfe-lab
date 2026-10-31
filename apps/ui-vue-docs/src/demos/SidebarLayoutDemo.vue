<script setup lang="ts">
import { TSidebarLayout, TSidebarLayoutContent, TSidebarLayoutSidebar, TStack } from '@repo/ui-vue'
import { ref } from 'vue'
import DemoBlock from '../components/DemoBlock.vue'

// The library holds no state: the caller owns `collapsed`.
const collapsed = ref(true)
</script>

<template>
  <TStack :gap="3">
    <TSidebarLayout sidebar-width="10rem">
      <TSidebarLayoutSidebar>
        <DemoBlock class="h-full">Sidebar</DemoBlock>
      </TSidebarLayoutSidebar>
      <TSidebarLayoutContent>
        <DemoBlock>Content takes the rest</DemoBlock>
      </TSidebarLayoutContent>
    </TSidebarLayout>
    <TSidebarLayout side="end" :collapsed="collapsed">
      <TSidebarLayoutSidebar>
        <DemoBlock class="h-full">{{ collapsed ? 'S' : 'Sidebar' }}</DemoBlock>
      </TSidebarLayoutSidebar>
      <TSidebarLayoutContent>
        <button type="button" class="cursor-pointer border-0 bg-transparent p-0 text-left" @click="collapsed = !collapsed">
          <DemoBlock>side="end", collapsed={{ collapsed }} (click to toggle)</DemoBlock>
        </button>
      </TSidebarLayoutContent>
    </TSidebarLayout>
  </TStack>
</template>
