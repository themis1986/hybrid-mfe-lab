<script setup lang="ts">
import {
  TAppShell,
  TAppShellFooter,
  TAppShellHeader,
  TAppShellMain,
  TAppShellSidebar,
  TButton,
  TSpacer,
  TStack,
} from '@repo/ui-vue'
import DemoBlock from '../components/DemoBlock.vue'
</script>

<template>
  <div class="h-64 overflow-auto rounded-md border border-line">
    <TAppShell>
      <TAppShellHeader>
        <strong>App</strong>
        <TSpacer />
        <TButton size="sm" variant="ghost" label="Profile" />
      </TAppShellHeader>
      <TAppShellSidebar>
        <TStack :gap="1" class="text-sm">
          <span v-for="n in 3" :key="n">Nav item</span>
        </TStack>
      </TAppShellSidebar>
      <TAppShellMain>
        <TStack :gap="2" class="p-4">
          <DemoBlock v-for="n in 8" :key="n">Main content {{ n }}</DemoBlock>
        </TStack>
      </TAppShellMain>
      <TAppShellFooter class="text-sm text-fg-muted">Footer</TAppShellFooter>
    </TAppShell>
  </div>
</template>
