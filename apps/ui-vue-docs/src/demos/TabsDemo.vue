<script setup lang="ts">
import { TStack, TTabs, TTabsContent, TTabsList, TTabsTrigger } from '@repo/ui-vue'
import { ref } from 'vue'

const tab = ref('account')
</script>

<template>
  <TStack :gap="8">
    <TTabs v-model="tab">
      <TTabsList>
        <TTabsTrigger value="account">Account</TTabsTrigger>
        <TTabsTrigger value="password">Password</TTabsTrigger>
        <TTabsTrigger value="billing" disabled>Billing</TTabsTrigger>
      </TTabsList>
      <TTabsContent value="account" class="text-sm">Make changes to your account here.</TTabsContent>
      <TTabsContent value="password" class="text-sm">Change your password here.</TTabsContent>
      <TTabsContent value="billing" class="text-sm">Billing is unavailable.</TTabsContent>
    </TTabs>
    <TTabs default-value="week">
      <TTabsList variant="pills">
        <TTabsTrigger value="day">Day</TTabsTrigger>
        <TTabsTrigger value="week">Week</TTabsTrigger>
        <TTabsTrigger value="month">Month</TTabsTrigger>
      </TTabsList>
      <TTabsContent value="day" class="text-sm">Today's schedule.</TTabsContent>
      <TTabsContent value="week" class="text-sm">This week's schedule.</TTabsContent>
      <TTabsContent value="month" class="text-sm">This month's schedule.</TTabsContent>
    </TTabs>
  </TStack>
</template>
