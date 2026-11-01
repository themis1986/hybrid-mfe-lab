<script setup lang="ts">
import { TButton, TCluster, TStack, TToast, toast } from '@repo/ui-vue'
import { ref } from 'vue'

const messages = ref(['Welcome aboard', 'Your invoice', 'Weekly digest'])

// Deletes the first message; the toast's Undo puts it back.
function remove() {
  const [message, ...rest] = messages.value
  if (!message) return
  messages.value = rest
  toast(`Deleted “${message}”`, {
    action: {
      label: 'Undo',
      onClick: () => (messages.value = [message, ...messages.value]),
    },
  })
}

const reminder = ref(false)
</script>

<template>
  <TStack :gap="4">
    <TCluster :gap="3">
      <TButton
        variant="soft"
        label="Delete a message"
        :disabled="!messages.length"
        @click="remove"
      />
      <TButton
        variant="soft"
        label="Plain toast"
        @click="toast('Link copied')"
      />
      <TButton
        variant="outline"
        label="Declarative toast"
        @click="reminder = true"
      />
    </TCluster>
    <p class="m-0 text-sm text-fg-muted">
      Messages: {{ messages.join(', ') || 'none' }}
    </p>
    <TToast
      v-model:open="reminder"
      title="Reminder set for 9:00"
      description="We'll notify you tomorrow."
      action-label="Change"
      @action="reminder = false"
    />
  </TStack>
</template>
