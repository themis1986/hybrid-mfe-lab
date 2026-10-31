<script setup lang="ts">
import { TField, TGrid } from '@repo/ui-vue'
import { computed, ref } from 'vue'

const username = ref('taken')
const error = computed(() => (username.value === 'taken' ? 'That username is taken.' : undefined))
</script>

<template>
  <TGrid min-child-width="14rem" :gap="4">
    <TField label="Email" placeholder="you@example.com" description="We never share it." />
    <TField v-model="username" label="Username" :error="error" />
  </TGrid>
</template>
