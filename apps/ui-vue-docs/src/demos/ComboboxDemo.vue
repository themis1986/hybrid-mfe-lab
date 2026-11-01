<script setup lang="ts">
import { TCombobox, TGrid } from '@repo/ui-vue'
import { computed, ref } from 'vue'

const timeZones = [
  ['UTC', 'UTC'],
  ['Europe/London', 'Europe/London'],
  ['Europe/Lisbon', 'Europe/Lisbon'],
  ['Europe/Paris', 'Europe/Paris'],
  ['Europe/Berlin', 'Europe/Berlin'],
  ['Europe/Zurich', 'Europe/Zürich'],
  ['Europe/Athens', 'Europe/Athens'],
  ['Europe/Istanbul', 'Europe/Istanbul'],
  ['Africa/Cairo', 'Africa/Cairo'],
  ['Asia/Dubai', 'Asia/Dubai'],
  ['Asia/Kolkata', 'Asia/Kolkata'],
  ['Asia/Singapore', 'Asia/Singapore'],
  ['Asia/Tokyo', 'Asia/Tokyo'],
  ['Australia/Sydney', 'Australia/Sydney'],
  ['America/Sao_Paulo', 'America/São Paulo'],
  ['America/New_York', 'America/New York'],
  ['America/Chicago', 'America/Chicago'],
  ['America/Los_Angeles', 'America/Los Angeles'],
].map(([value, label]) => ({ value, label }))

const services = [
  'api-gateway',
  'auth',
  'billing',
  'catalog',
  'checkout',
  'email-worker',
  'inventory',
  'notifications',
  'payments',
  'search',
  'search-indexer',
]
  .map((s) => ({ value: s, label: s, disabled: false }))
  .concat({ value: 'legacy-ftp', label: 'legacy-ftp (retired)', disabled: true })

const zone = ref<string>()
const watched = ref<string[]>(['auth', 'billing'])
const zoneLabel = computed(() => timeZones.find((z) => z.value === zone.value)?.label)
</script>

<template>
  <TGrid min-child-width="16rem" :gap="4">
    <div class="flex flex-col gap-1.5">
      <label for="combobox-demo-zone" class="text-sm font-medium">Time zone</label>
      <TCombobox
        id="combobox-demo-zone"
        v-model="zone"
        name="timeZone"
        :options="timeZones"
        placeholder="Search time zones…"
      />
      <span class="text-sm text-fg-muted">Selected: {{ zoneLabel ?? '—' }}</span>
    </div>
    <div class="flex flex-col gap-1.5">
      <label for="combobox-demo-services" class="text-sm font-medium">Services to watch</label>
      <TCombobox
        id="combobox-demo-services"
        v-model="watched"
        multiple
        name="services"
        :options="services"
        placeholder="Search services…"
      />
      <span class="text-sm text-fg-muted">Watching: {{ watched.join(', ') || '—' }}</span>
    </div>
    <TCombobox :options="timeZones" size="sm" invalid placeholder="Invalid, small" aria-label="Invalid" />
    <TCombobox :options="timeZones" disabled default-value="UTC" aria-label="Disabled" />
  </TGrid>
</template>
