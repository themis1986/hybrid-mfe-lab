<script setup lang="ts">
import { TAlarmHost } from '@repo/ui-vue'
</script>

<template>
  <RouterView />
  <!-- Shows the alarms when this app runs on its own; inside the shell, the shell's host does. -->
  <TAlarmHost />
</template>
