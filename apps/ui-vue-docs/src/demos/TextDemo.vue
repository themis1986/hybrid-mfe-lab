<script setup lang="ts">
import { TGrid, TText } from '@repo/ui-vue'
import { computed, ref } from 'vue'

const bio = ref('')
const note = ref('Grows as you type.\nTry adding lines.')
const feedback = ref('Too short')
const feedbackError = computed(() => (feedback.value.length < 20 ? 'Write at least 20 characters.' : undefined))
</script>

<template>
  <TGrid min-child-width="16rem" :gap="4">
    <TText v-model="bio" label="Bio" description="A few words about you." :max-length="160" />
    <TText v-model="note" label="Auto-resizing" auto-resize :rows="2" :max-rows="6" />
    <TText v-model="feedback" label="Feedback" :error="feedbackError" />
    <TText label="Disabled" disabled model-value="Read-only text" />
  </TGrid>
</template>
