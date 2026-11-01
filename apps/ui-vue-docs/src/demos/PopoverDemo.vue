<script setup lang="ts">
import {
  alarm,
  TButton,
  TCheckbox,
  TCluster,
  TIcon,
  TPopover,
  TPopoverClose,
  TPopoverContent,
  TPopoverFooter,
  TPopoverTrigger,
  TRadioGroup,
  TRadioGroupItem,
  TSelect,
  TSlider,
  TStack,
  TSwitch,
  TText,
} from '@repo/ui-vue'
import { Info, Plus } from '@repo/ui-vue/icons'
import { computed, reactive, ref } from 'vue'

const services = ['api-gateway', 'auth', 'billing', 'search'].map((s) => ({
  value: s,
  label: s,
}))
const events = [
  { value: 'deploy-failed', label: 'Deployment failed' },
  { value: 'error-rate', label: 'Error rate above threshold' },
  { value: 'latency', label: 'Latency above threshold' },
  { value: 'restarted', label: 'Service restarted' },
]
const channels = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack' },
  { value: 'pagerduty', label: 'PagerDuty' },
]

const blankRule = () => ({
  service: 'api-gateway',
  events: ['deploy-failed'] as string[],
  severity: 'critical',
  threshold: [5],
  channels: [] as string[],
  quietHours: false,
  note: '',
})

const open = ref(false)
const rule = reactive(blankRule())
// Errors show once the user has tried to save.
const submitted = ref(false)
const errors = computed(() => ({
  events: rule.events.length ? undefined : 'Pick at least one event.',
  channels: rule.channels.length ? undefined : 'Pick at least one channel.',
}))
const lastSaved = ref<string>()

function setChannel(value: string, on: boolean) {
  rule.channels = on
    ? [...rule.channels, value]
    : rule.channels.filter((c) => c !== value)
}

function save() {
  submitted.value = true
  if (errors.value.events || errors.value.channels) return
  const names = channels
    .filter((c) => rule.channels.includes(c.value))
    .map((c) => c.label)
  const summary = `${rule.service} · ${rule.events.length} event${rule.events.length > 1 ? 's' : ''} → ${names.join(', ')}`
  lastSaved.value = summary
  alarm.success('Rule saved', { description: summary })
  open.value = false
  Object.assign(rule, blankRule())
  submitted.value = false
}
</script>

<template>
  <TCluster :gap="6" align="start">
    <TStack :gap="2">
      <TPopover v-model:open="open">
        <TPopoverTrigger as-child>
          <TButton>
            <TIcon :icon="Plus" size="sm" />
            New notification rule
          </TButton>
        </TPopoverTrigger>
        <TPopoverContent
          size="lg"
          title="New notification rule"
          description="Get notified when a backend service needs attention."
        >
          <form class="flex flex-col gap-4" novalidate @submit.prevent="save">
            <div class="flex flex-col gap-1.5">
              <label for="rule-service" class="text-sm font-medium"
                >Service</label
              >
              <TSelect
                id="rule-service"
                v-model="rule.service"
                :options="services"
                size="sm"
              />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="rule-events" class="text-sm font-medium"
                >Events</label
              >
              <TSelect
                id="rule-events"
                v-model="rule.events"
                multiple
                :options="events"
                size="sm"
                placeholder="Pick events"
                :invalid="submitted && !!errors.events"
              />
              <p
                v-if="submitted && errors.events"
                role="alert"
                class="m-0 text-sm text-danger"
              >
                {{ errors.events }}
              </p>
            </div>
            <fieldset class="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
              <legend class="mb-2 p-0 text-sm font-medium">Severity</legend>
              <TRadioGroup
                v-model="rule.severity"
                orientation="horizontal"
                aria-label="Severity"
              >
                <label class="inline-flex items-center gap-2 text-sm"
                  ><TRadioGroupItem value="critical" size="sm" />
                  Critical</label
                >
                <label class="inline-flex items-center gap-2 text-sm"
                  ><TRadioGroupItem value="warning" size="sm" /> Warning</label
                >
                <label class="inline-flex items-center gap-2 text-sm"
                  ><TRadioGroupItem value="any" size="sm" /> Any</label
                >
              </TRadioGroup>
            </fieldset>
            <div class="flex flex-col gap-2">
              <span id="rule-threshold" class="text-sm font-medium"
                >Errors per minute: {{ rule.threshold[0] }}</span
              >
              <TSlider
                v-model="rule.threshold"
                :min="1"
                :max="50"
                size="sm"
                thumb-label="Errors per minute"
              />
            </div>
            <fieldset class="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
              <legend class="mb-2 p-0 text-sm font-medium">Channels</legend>
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                <label
                  v-for="channel in channels"
                  :key="channel.value"
                  class="inline-flex items-center gap-2 text-sm"
                >
                  <TCheckbox
                    size="sm"
                    :model-value="rule.channels.includes(channel.value)"
                    @update:model-value="
                      (on) => setChannel(channel.value, on === true)
                    "
                  />
                  {{ channel.label }}
                </label>
              </div>
              <p
                v-if="submitted && errors.channels"
                role="alert"
                class="m-0 text-sm text-danger"
              >
                {{ errors.channels }}
              </p>
            </fieldset>
            <label
              class="inline-flex items-center justify-between gap-3 text-sm"
            >
              Mute from 22:00 to 07:00
              <TSwitch v-model="rule.quietHours" size="sm" />
            </label>
            <TText
              v-model="rule.note"
              label="Note (optional)"
              :rows="2"
              size="sm"
            />
            <TPopoverFooter>
              <TPopoverClose as-child>
                <TButton type="button" variant="ghost" label="Cancel" />
              </TPopoverClose>
              <TButton type="submit" label="Save rule" />
            </TPopoverFooter>
          </form>
        </TPopoverContent>
      </TPopover>
      <p class="m-0 text-sm text-fg-muted">
        Last saved: {{ lastSaved ?? 'none yet' }}
      </p>
    </TStack>

    <TPopover>
      <TPopoverTrigger as-child>
        <TButton variant="ghost" aria-label="About this service">
          <TIcon :icon="Info" size="sm" />
        </TButton>
      </TPopoverTrigger>
      <TPopoverContent side="right" size="sm" aria-label="About api-gateway">
        <p class="m-0 pe-8 text-sm">
          <strong>api-gateway</strong> routes every public request to the
          backend services. Rules on it see all traffic.
        </p>
      </TPopoverContent>
    </TPopover>
  </TCluster>
</template>
