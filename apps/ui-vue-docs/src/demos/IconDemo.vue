<script setup lang="ts">
import { TButton, TCluster, TIcon, TStack } from '@repo/ui-vue'
import { Bell, Check, Heart, Info, Search, Settings, Star, TriangleAlert } from '@repo/ui-vue/icons'

const gallery = { Search, Bell, Settings, Star, Heart, Check, Info }
</script>

<template>
  <TStack :gap="4">
    <TCluster :gap="4" class="text-fg">
      <TIcon v-for="(icon, name) in gallery" :key="name" :icon="icon" :label="name" />
    </TCluster>
    <TCluster :gap="4">
      <TIcon :icon="Star" size="sm" />
      <TIcon :icon="Star" size="md" />
      <TIcon :icon="Star" size="lg" />
      <TIcon :icon="TriangleAlert" class="text-danger" label="Warning" />
      <TIcon :icon="Heart" class="text-accent-fg" :stroke-width="2.5" />
      <TButton variant="soft">
        <TIcon :icon="Settings" size="sm" />
        Settings
      </TButton>
    </TCluster>
  </TStack>
</template>
