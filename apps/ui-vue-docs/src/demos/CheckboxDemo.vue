<script setup lang="ts">
import { TCheckbox, TCluster } from '@repo/ui-vue'
import { ref } from 'vue'

const checked = ref<boolean | 'indeterminate'>(true)
</script>

<template>
  <TCluster :gap="6">
    <label class="inline-flex items-center gap-2 text-sm">
      <TCheckbox v-model="checked" />
      v-model: {{ checked }}
    </label>
    <label class="inline-flex items-center gap-2 text-sm">
      <TCheckbox :default-value="'indeterminate'" />
      Indeterminate
    </label>
    <label class="inline-flex items-center gap-2 text-sm">
      <TCheckbox size="sm" />
      Small, uncontrolled
    </label>
    <label class="inline-flex items-center gap-2 text-sm text-fg-muted">
      <TCheckbox disabled :default-value="true" />
      Disabled
    </label>
  </TCluster>
</template>
