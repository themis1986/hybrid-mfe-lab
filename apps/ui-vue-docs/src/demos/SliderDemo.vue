<script setup lang="ts">
import { TSlider, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const volume = ref([40])
const price = ref([20, 80])
</script>

<template>
  <TStack :gap="6" class="max-w-md">
    <div class="flex flex-col gap-2 text-sm">
      <span>Volume: {{ volume[0] }}</span>
      <TSlider v-model="volume" thumb-label="Volume" />
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <span>Price range: {{ price[0] }}–{{ price[1] }} €</span>
      <TSlider v-model="price" :step="5" :min-steps-between-thumbs="2" :thumb-label="['Minimum price', 'Maximum price']" />
    </div>
    <TSlider :default-value="[30]" size="sm" thumb-label="Small" />
    <TSlider :default-value="[60]" disabled thumb-label="Disabled" />
  </TStack>
</template>
