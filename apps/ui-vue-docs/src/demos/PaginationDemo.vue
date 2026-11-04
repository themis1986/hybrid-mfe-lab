<script setup lang="ts">
import { TButton, TCluster, TPagination, TStack } from '@repo/ui-vue'
import { ref } from 'vue'

const page = ref(5)
const total = ref(240)
</script>

<template>
  <TStack :gap="5">
    <div class="flex flex-col gap-2 text-sm">
      <span>Page {{ page }} of {{ total }} items</span>
      <TPagination
        v-model:page="page"
        :total="total"
        :items-per-page="20"
        aria-label="Results"
      />
      <TCluster>
        <TButton
          variant="outline"
          size="sm"
          label="Keep 40 items"
          @click="total = 40"
        />
        <TButton
          variant="outline"
          size="sm"
          label="Restore 240 items"
          @click="total = 240"
        />
      </TCluster>
    </div>
    <TPagination
      :default-page="12"
      :total="480"
      :items-per-page="20"
      show-first-last
      aria-label="With first and last buttons"
    />
    <TPagination
      :default-page="6"
      :total="240"
      :items-per-page="20"
      :show-edges="false"
      :sibling-count="2"
      aria-label="Without edges"
    />
    <TPagination
      :total="100"
      :items-per-page="20"
      size="sm"
      aria-label="Small"
    />
    <TPagination
      :total="100"
      :items-per-page="20"
      size="lg"
      aria-label="Large"
    />
    <TPagination
      :default-page="2"
      :total="100"
      :items-per-page="20"
      disabled
      aria-label="Disabled"
    />
  </TStack>
</template>
