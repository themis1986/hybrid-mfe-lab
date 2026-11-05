<script setup lang="ts">
import {
  TDatePicker,
  TFormField,
  TGrid,
  TRadioGroup,
  TRadioGroupItem,
  TSelect,
} from '@repo/ui-vue'
import { ref } from 'vue'

const country = ref<string>()
const billing = ref('monthly')
const options = [
  { value: 'gr', label: 'Greece' },
  { value: 'pt', label: 'Portugal' },
]
</script>

<template>
  <TGrid min-child-width="14rem" :gap="4">
    <TFormField
      v-slot="{ id, describedBy, invalid }"
      label="Country"
      description="Where the account is held."
    >
      <TSelect
        :id="id"
        v-model="country"
        :aria-describedby="describedBy"
        :invalid="invalid"
        placeholder="Choose a country"
        :options="options"
      />
    </TFormField>
    <TFormField
      v-slot="{ id, labelId, describedBy, invalid }"
      label="Start date"
      error="Pick a date after today."
    >
      <TDatePicker
        :id="id"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :invalid="invalid"
      />
    </TFormField>
    <TFormField v-slot="{ id, labelId, describedBy }" label="Billing">
      <TRadioGroup
        :id="id"
        v-model="billing"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        orientation="horizontal"
      >
        <label class="inline-flex items-center gap-2 text-sm">
          <TRadioGroupItem value="monthly" />
          Monthly
        </label>
        <label class="inline-flex items-center gap-2 text-sm">
          <TRadioGroupItem value="yearly" />
          Yearly
        </label>
      </TRadioGroup>
    </TFormField>
  </TGrid>
</template>
