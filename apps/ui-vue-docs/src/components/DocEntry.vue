<script setup lang="ts">
import { TCard, TCardBody, TCardHeader, TStack } from '@repo/ui-vue'
import type { DocEntry } from '../catalog'
import CodeBlock from './CodeBlock.vue'
import DocTable from './DocTable.vue'

defineProps<{ entry: DocEntry }>()
</script>

<template>
  <!-- scroll-mt keeps the card clear of a sticky host header when its anchor is followed. -->
  <TCard :id="entry.id" class="scroll-mt-[calc(var(--t-layout-header-height)+1rem)]">
    <TCardHeader>
      <h3>
        <code class="font-mono">{{ entry.name }}</code>
      </h3>
      <span v-if="entry.parts" class="font-mono text-xs font-normal text-fg-muted">+ {{ entry.parts.join(', ') }}</span>
    </TCardHeader>
    <TCardBody>
      <TStack :gap="4">
        <p class="m-0 text-sm text-fg-muted">{{ entry.summary }}</p>
        <div class="rounded-md border border-dashed border-line p-4">
          <component :is="entry.demo" />
        </div>
        <CodeBlock :code="entry.code" :label="`${entry.name} usage`" />
        <DocTable
          :label="`${entry.name} props`"
          :columns="['Prop', 'Type', 'Default', 'Description']"
          :rows="entry.props.map((p) => [p.name, p.type, p.default ?? '–', p.description])"
          :mono="[0, 1, 2]"
        />
        <DocTable
          v-if="entry.slots"
          :label="`${entry.name} slots`"
          :columns="['Slot', 'Description']"
          :rows="entry.slots.map((s) => [s.name, s.description])"
          :mono="[0]"
        />
        <DocTable
          v-if="entry.events"
          :label="`${entry.name} events`"
          :columns="['Event', 'Payload', 'Description']"
          :rows="entry.events.map((e) => [e.name, e.payload, e.description])"
          :mono="[0, 1]"
        />
      </TStack>
    </TCardBody>
  </TCard>
</template>
