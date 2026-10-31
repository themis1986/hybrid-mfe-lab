<script setup lang="ts">
import { TCluster, TSwitch } from '@repo/ui-vue'
import { ref } from 'vue'

const on = ref(true)
</script>

<template>
  <TCluster :gap="6">
    <label class="inline-flex items-center gap-2 text-sm">
      <TSwitch v-model="on" />
      v-model: {{ on ? 'on' : 'off' }}
    </label>
    <label class="inline-flex items-center gap-2 text-sm">
      <TSwitch size="sm" />
      Small, uncontrolled
    </label>
    <label class="inline-flex items-center gap-2 text-sm text-fg-muted">
      <TSwitch disabled :default-value="true" />
      Disabled
    </label>
  </TCluster>
</template>
