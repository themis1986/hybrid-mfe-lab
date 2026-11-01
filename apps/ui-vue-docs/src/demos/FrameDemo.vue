<script setup lang="ts">
import { TGrid, TFrame } from '@repo/ui-vue'
import { growingFrameDoc, sampleFrameDoc } from '../samples'
</script>

<template>
  <TGrid min-child-width="16rem" :gap="4">
    <TFrame :srcdoc="sampleFrameDoc" title="Sandboxed example" sandbox ratio="4-3" radius="md" caption="Sandboxed srcdoc, ratio 4-3" />
    <TFrame :srcdoc="growingFrameDoc" title="Growing example" auto-height radius="md" caption="autoHeight: follows its content" />
  </TGrid>
</template>
