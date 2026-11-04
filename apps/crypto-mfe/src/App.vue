<script setup lang="ts">
import { TAlarmHost } from '@repo/ui-vue'
import AppNav from './components/AppNav.vue'
import DataCredit from './components/DataCredit.vue'
</script>

<template>
  <!-- A container, not the viewport, decides the layout: the shell's sidebar takes part of the viewport's width. -->
  <div class="@container isolate font-sans text-fg">
    <div
      class="mx-auto box-border flex max-w-(--t-container-lg) flex-col gap-4 p-4 @3xl:p-6"
    >
      <AppNav />
      <RouterView />
      <DataCredit />
    </div>
  </div>
  <!-- Renders only when no other host is on the page: the shell's shows these alarms when it hosts this app. -->
  <TAlarmHost />
</template>
