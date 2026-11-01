<script setup lang="ts">
import { alarm, TAlarm, TButton, TCluster, TSelect, TStack, TSwitch, type TAlarmPosition } from '@repo/ui-vue'
import { computed, ref } from 'vue'

const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const
const positionOptions = [
  { value: 'host', label: "Host's (bottom-right)" },
  ...positions.map((p) => ({ value: p, label: p })),
]
const choice = ref('host')
const position = computed(() => (choice.value === 'host' ? undefined : (choice.value as TAlarmPosition)))

const offline = ref(false)
</script>

<template>
  <TStack :gap="4">
    <TCluster :gap="3">
      <TSelect v-model="choice" :options="positionOptions" size="sm" aria-label="Position" class="w-52" />
      <TButton
        variant="soft"
        label="Success"
        @click="alarm.success('Profile saved', { position })"
      />
      <TButton
        variant="soft"
        label="Error"
        @click="alarm.error('Upload failed', { description: 'The file is larger than 10 MB.', position })"
      />
      <TButton variant="soft" label="Info" @click="alarm.info('A new version is available', { position })" />
      <TButton
        variant="soft"
        label="Warning"
        @click="alarm.warning('Your session expires in 5 minutes', { position, duration: 10000 })"
      />
    </TCluster>
    <label class="inline-flex items-center gap-2 text-sm">
      <TSwitch v-model="offline" />
      Declarative &lt;TAlarm v-model:open&gt;: {{ offline ? 'open' : 'closed' }}
    </label>
    <TAlarm
      v-model:open="offline"
      variant="warning"
      title="You are offline"
      description="Changes are saved locally until the connection is back."
      :duration="Infinity"
      :position="position"
    />
  </TStack>
</template>
