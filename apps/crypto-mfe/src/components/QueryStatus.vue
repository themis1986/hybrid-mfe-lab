<script setup lang="ts">
import { TBadge, TButton } from '@repo/ui-vue'
import { computed } from 'vue'
import { type QueryLike, useQueryPhase } from '../hooks/useQueryPhase'
import ErrorPanel from './ErrorPanel.vue'

// One query's states, shown the same way everywhere. A first load shows the `loading` slot (skeletons), with a
// notice if it is waiting on a retry or the network. A failed first load shows an error panel, or `not-found`.
// Once there is data it stays on screen, with a badge if the latest update failed.
const props = defineProps<{
  query: QueryLike
  /** What couldn't be loaded, for the error panel: "Couldn't load {what}". */
  what: string
  /** The default slot is always shown (it renders its own empty values), and an error is a line above it. */
  inline?: boolean
}>()

const { phase, provider, notFound, description } = useQueryPhase(props.query)

const hasContent = computed(
  () => props.inline || phase.value === 'ready' || phase.value === 'stale',
)

function retry() {
  void props.query.refetch()
}
</script>

<template>
  <slot v-if="phase === 'error' && notFound" name="not-found" />
  <ErrorPanel
    v-else-if="phase === 'error' && !inline"
    :message="`Couldn’t load ${what}`"
    :description="description"
    @retry="retry"
  />
  <template v-else>
    <p
      v-if="phase === 'retrying'"
      role="status"
      class="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-muted"
    >
      {{ provider }} isn’t answering. It may be limiting requests, so this tries
      again by itself shortly.
      <TButton variant="ghost" size="sm" @click="retry">Try now</TButton>
    </p>
    <p
      v-else-if="phase === 'offline'"
      role="status"
      class="m-0 text-sm text-fg-muted"
    >
      You’re offline. This loads by itself once you’re back.
    </p>
    <p
      v-else-if="phase === 'error'"
      role="alert"
      class="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-muted"
    >
      Couldn’t load {{ what }}.
      <TButton variant="ghost" size="sm" @click="retry">Try again</TButton>
    </p>
    <p
      v-else-if="phase === 'stale'"
      role="status"
      class="m-0 flex flex-wrap items-center gap-2 text-sm text-fg-muted"
    >
      <TBadge tone="warning">May be out of date</TBadge>
      The latest update from {{ provider }} failed.
      <TButton variant="ghost" size="sm" @click="retry">Try now</TButton>
    </p>
    <slot v-if="hasContent" />
    <slot v-else name="loading" />
  </template>
</template>
