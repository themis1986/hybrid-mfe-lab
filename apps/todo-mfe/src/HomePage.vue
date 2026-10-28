<script setup lang="ts">
import { ref } from 'vue'

const variants = ['solid', 'soft', 'outline', 'ghost', 'danger']
const clicks = ref(0)
</script>

<template>
  <h1>Todo MFE</h1>
  <div style="display: flex; flex-wrap: wrap; gap: 8px">
    <t-button
      v-for="variant in variants"
      :key="variant"
      :label="`Vue ${variant}`"
      :variant="variant"
      @click="clicks++"
    ></t-button>
    <!-- Booleans must be bound (:disabled="true"): a bare `disabled` is an empty string, which r2wc reads as false. -->
    <t-button label="Vue disabled" :disabled="true" @click="clicks++"></t-button>
  </div>
  <p>Clicked {{ clicks }} times</p>
</template>
