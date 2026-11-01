<script setup lang="ts">
import { TButton, TCard, TGrid, TIcon, TPageHeader, TStack } from '@repo/ui-vue'
import { ArrowRight, CircleCheckBig, ListTodo, Pencil, Sparkles } from '@repo/ui-vue/icons'

const FEATURES = [
  { icon: ListTodo, title: 'Jot it down', text: 'Type a task and press Enter. It lands at the top of your list.' },
  { icon: CircleCheckBig, title: 'Tick it off', text: 'Mark todos as done, and filter what is open or finished.' },
  { icon: Pencil, title: 'Change your mind', text: 'Rename or remove any todo whenever plans change.' },
]
</script>

<template>
  <TStack :gap="8">
    <TStack :gap="5" align="start">
      <span class="inline-flex size-12 items-center justify-center rounded-lg bg-accent-subtle text-accent-fg">
        <TIcon :icon="Sparkles" size="lg" />
      </span>
      <TPageHeader
        title="Hi there! Let's get things done."
        description="A small, friendly todo list: write down what's on your mind, then enjoy ticking it off."
      />
      <TButton as-child size="lg">
        <RouterLink to="/todos">
          Open my todos
          <TIcon :icon="ArrowRight" size="sm" />
        </RouterLink>
      </TButton>
    </TStack>

    <TGrid min-child-width="11rem" :gap="4">
      <TCard v-for="feature in FEATURES" :key="feature.title" variant="filled" :dividers="false">
        <TStack :gap="2">
          <TIcon :icon="feature.icon" class="text-accent-fg" />
          <h2 class="m-0 text-sm font-semibold text-fg">{{ feature.title }}</h2>
          <p class="m-0 text-sm text-fg-muted">{{ feature.text }}</p>
        </TStack>
      </TCard>
    </TGrid>

    <p class="m-0 text-xs text-fg-muted">Your list lives in this tab only: it starts fresh on every visit.</p>
  </TStack>
</template>
