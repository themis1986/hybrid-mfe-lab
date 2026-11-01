<script setup lang="ts">
import { TGrid, type TTreeNode, TTreeSelector } from '@repo/ui-vue'
import { ref } from 'vue'

const regions: TTreeNode[] = [
  {
    value: 'europe',
    label: 'Europe',
    children: [
      {
        value: 'western-europe',
        label: 'Western Europe',
        children: [
          { value: 'fr', label: 'France' },
          { value: 'es', label: 'Spain' },
          { value: 'pt', label: 'Portugal' },
        ],
      },
      { value: 'it', label: 'Italy' },
      { value: 'gr', label: 'Greece' },
      { value: 'ch', label: 'Switzerland', disabled: true },
    ],
  },
  {
    value: 'asia',
    label: 'Asia',
    children: [
      { value: 'jp', label: 'Japan' },
      { value: 'kr', label: 'South Korea' },
      { value: 'in', label: 'India' },
    ],
  },
  { value: 'aq', label: 'Antarctica' },
]

const country = ref<string>()
const leaves = ref<string[]>(['fr', 'es'])
const parents = ref<string[]>(['asia'])
</script>

<template>
  <TGrid min-child-width="14rem" :gap="4">
    <div class="flex flex-col gap-1.5">
      <label for="tree-demo-single" class="text-sm font-medium">Single</label>
      <TTreeSelector id="tree-demo-single" v-model="country" :options="regions" placeholder="Pick a country" />
      <span class="text-sm text-fg-muted">v-model: {{ country ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="tree-demo-leaves" class="text-sm font-medium">Multiple, value mode leaves</label>
      <TTreeSelector id="tree-demo-leaves" v-model="leaves" multiple :options="regions" placeholder="Pick countries" />
      <span class="text-sm text-fg-muted">v-model: {{ leaves.join(', ') || '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="tree-demo-parents" class="text-sm font-medium">Multiple, value mode parents</label>
      <TTreeSelector
        id="tree-demo-parents"
        v-model="parents"
        multiple
        value-mode="parents"
        :options="regions"
        placeholder="Pick regions"
      />
      <span class="text-sm text-fg-muted">v-model: {{ parents.join(', ') || '—' }}</span>
    </div>
  </TGrid>
</template>
