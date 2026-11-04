<script setup lang="ts">
import { TButton, TIcon } from '@repo/ui-vue'
import { Star } from '@repo/ui-vue/icons'
import { computed } from 'vue'
import { useCryptoState } from '../hooks/useCryptoState'

const props = defineProps<{ id: string; name: string }>()

const { isWatched, toggleWatched } = useCryptoState()
const watched = computed(() => isWatched(props.id))
</script>

<template>
  <!-- The filled star, not only its colour, shows the state. -->
  <TButton
    variant="ghost"
    size="sm"
    class="px-1"
    :aria-pressed="watched"
    :aria-label="`Watch ${name}`"
    @click="toggleWatched(id)"
  >
    <TIcon
      :icon="Star"
      size="sm"
      :class="watched ? 'fill-current text-accent-fg' : 'text-fg-muted'"
    />
  </TButton>
</template>
