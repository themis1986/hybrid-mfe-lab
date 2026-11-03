<script setup lang="ts">
import { TAlarmHost } from '@repo/ui-vue'
</script>

<template>
  <RouterView />
  <!-- Renders only when no other host is on the page: the shell's shows these alarms when it hosts this app. -->
  <TAlarmHost />
</template>
