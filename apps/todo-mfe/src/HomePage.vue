<script setup lang="ts">
import { ref } from 'vue'

const clicks = ref(0)
</script>

<template>
  <h1>Todo MFE</h1>
  <ui-button label="Vue click" @click="clicks++"></ui-button>
  <p>Clicked {{ clicks }} times</p>
</template>
