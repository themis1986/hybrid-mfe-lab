<script setup lang="ts">
import { TAvatar, TCluster } from '@repo/ui-vue'
</script>

<template>
  <TCluster :gap="3" align="center">
    <TAvatar name="Ada Lovelace" size="sm" />
    <TAvatar name="Grace Hopper" />
    <TAvatar name="Radia Perlman" size="lg" />
    <TAvatar name="Image that fails" src="/missing.png" />
  </TCluster>
</template>
