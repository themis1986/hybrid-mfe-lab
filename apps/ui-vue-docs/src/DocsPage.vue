<script setup lang="ts">
import {
  TCluster,
  TContainer,
  TPageHeader,
  TPanel,
  TSection,
  TSidebarLayout,
  TSidebarLayoutContent,
  TSidebarLayoutSidebar,
  TStack,
} from '@repo/ui-vue'
import { DOC_ENTRIES, DOC_GROUPS } from './catalog'
import CodeBlock from './components/CodeBlock.vue'
import DocEntry from './components/DocEntry.vue'

const setup = `import '@repo/ui-vue/styles.css'
import { TButton, TStack } from '@repo/ui-vue'

// Each Vue app on a shared page sets its own id prefix (field ids use useId()).
app.config.idPrefix = 'my-app'`

const entriesOf = (group: string) => DOC_ENTRIES.filter((entry) => entry.group === group)
</script>

<template>
  <TContainer class="py-8">
    <TStack :gap="6">
      <TPageHeader
        title="Vue UI docs"
        description="Every component of @repo/ui-vue: a live example, how to use it, its props and its slots."
      />

      <TPanel tone="accent" title="Getting started">
        <TStack :gap="2" class="text-sm">
          <span>
            Import the stylesheet once in the app's entry, then the components from the package. They are native Vue
            components on Reka UI, with the same design tokens and the same look as the React library.
          </span>
          <CodeBlock :code="setup" label="Setup" />
          <TCluster :gap="4" class="text-fg-muted">
            <span>Content goes in slots; inputs support v-model.</span>
            <span>Spacing props take steps 0–8: 0, 4, 8, 12, 16, 24, 32, 48, 64px.</span>
            <span>A class you pass wins over the component's own classes.</span>
          </TCluster>
        </TStack>
      </TPanel>

      <TSidebarLayout sidebar-width="13rem" :gap="6">
        <!-- Sticky only where the table of contents sits beside the content. -->
        <TSidebarLayoutSidebar
          aria-label="Components"
          class="self-start lg:sticky lg:top-[calc(var(--t-layout-header-height)+1.5rem)]"
        >
          <TStack :gap="4">
            <TStack v-for="group in DOC_GROUPS" :key="group.id" :gap="1">
              <p class="m-0 text-xs font-semibold tracking-wider text-fg-muted uppercase">{{ group.label }}</p>
              <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
                <li v-for="entry in entriesOf(group.id)" :key="entry.id">
                  <a
                    :href="`#${entry.id}`"
                    class="font-mono text-sm text-fg no-underline hover:text-accent-fg hover:underline"
                  >
                    {{ entry.name }}
                  </a>
                </li>
              </ul>
            </TStack>
          </TStack>
        </TSidebarLayoutSidebar>

        <TSidebarLayoutContent>
          <TStack :gap="8">
            <TSection
              v-for="group in DOC_GROUPS"
              :key="group.id"
              :title="group.label"
              :description="group.description"
              :gap="5"
            >
              <DocEntry v-for="entry in entriesOf(group.id)" :key="entry.id" :entry="entry" />
            </TSection>
          </TStack>
        </TSidebarLayoutContent>
      </TSidebarLayout>
    </TStack>
  </TContainer>
</template>
