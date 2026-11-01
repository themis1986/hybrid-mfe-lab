<script setup lang="ts">
import { TGrid, TVideo } from '@repo/ui-vue'
import { brokenVideo, sampleVideoSources } from '../samples'
</script>

<template>
  <TGrid min-child-width="16rem" :gap="4">
    <TVideo
      :sources="sampleVideoSources"
      radius="md"
      caption="Two sources (WebM, MP4), native controls"
    />
    <TVideo
      :sources="sampleVideoSources"
      autoplay
      loop
      :controls="false"
      ratio="square"
      fit="cover"
      radius="md"
      caption="Muted autoplay loop, cover (paused with reduced motion)"
    />
    <TVideo
      :src="brokenVideo"
      radius="md"
      bordered
      caption="No playable source"
    />
  </TGrid>
</template>
