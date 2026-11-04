<script setup lang="ts">
import { TBadge, TCluster } from '@repo/ui-vue'
</script>

<template>
  <TCluster :gap="2" align="center">
    <TBadge>Draft</TBadge>
    <TBadge tone="accent">New</TBadge>
    <TBadge tone="success">Active</TBadge>
    <TBadge tone="info">Syncing</TBadge>
    <TBadge tone="warning">Away</TBadge>
    <TBadge tone="danger" size="md">Failed</TBadge>
  </TCluster>
</template>
