<script setup lang="ts">
import { TButton, TCollapsible, TCollapsibleContent, TCollapsibleTrigger } from '@repo/ui-vue'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <TCollapsible v-model:open="open" class="flex max-w-md flex-col gap-2">
    <div class="flex items-center justify-between gap-3 text-sm">
      <span class="font-medium">3 people starred this repository</span>
      <TCollapsibleTrigger as-child>
        <TButton variant="ghost" size="sm" :label="open ? 'Hide' : 'Show all'" />
      </TCollapsibleTrigger>
    </div>
    <div class="rounded-md border border-line px-3 py-2 text-sm">@ada</div>
    <TCollapsibleContent>
      <div class="flex flex-col gap-2">
        <div class="rounded-md border border-line px-3 py-2 text-sm">@grace</div>
        <div class="rounded-md border border-line px-3 py-2 text-sm">@linus</div>
      </div>
    </TCollapsibleContent>
  </TCollapsible>
</template>
