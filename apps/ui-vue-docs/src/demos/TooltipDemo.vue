<script setup lang="ts">
import { TButton, TCluster, TIcon, TStack, TTooltip } from '@repo/ui-vue'
import { Settings } from '@repo/ui-vue/icons'

const sides = ['top', 'right', 'bottom', 'left'] as const
</script>

<template>
  <TStack :gap="4">
    <TCluster :gap="3">
      <TTooltip
        v-for="side in sides"
        :key="side"
        :content="`Shown on the ${side}`"
        :side="side"
      >
        <TButton variant="outline" :label="side" />
      </TTooltip>
    </TCluster>
    <TCluster :gap="3">
      <TTooltip content="Aligned to the start" side="bottom" align="start">
        <TButton variant="soft" label="Align start" />
      </TTooltip>
      <TTooltip content="Aligned to the end" side="bottom" align="end">
        <TButton variant="soft" label="Align end" />
      </TTooltip>
      <TTooltip content="Settings">
        <TButton variant="ghost" size="sm" aria-label="Settings">
          <TIcon :icon="Settings" size="sm" />
        </TButton>
      </TTooltip>
      <TTooltip side="right">
        <TButton variant="outline" label="Rich content" />
        <template #content><strong>Save</strong> · ⌘S</template>
      </TTooltip>
      <!-- A disabled button fires no pointer events: a focusable wrapper is the trigger instead. -->
      <TTooltip content="Saving is disabled while offline">
        <span tabindex="0" class="inline-flex rounded-md">
          <TButton label="Save" disabled class="pointer-events-none" />
        </span>
      </TTooltip>
    </TCluster>
  </TStack>
</template>
