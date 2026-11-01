<script setup lang="ts">
import { TGrid, TImage } from '@repo/ui-vue'
import { brokenImage, sampleImage } from '../samples'
</script>

<template>
  <TGrid min-child-width="12rem" :gap="4">
    <TImage
      :src="sampleImage"
      alt="Mountains under a violet sky"
      ratio="4-3"
      radius="md"
      caption="ratio 4-3, cover"
    />
    <TImage
      :src="sampleImage"
      alt="Mountains under a violet sky"
      ratio="square"
      fit="contain"
      radius="md"
      bordered
      caption="square, contain, bordered"
    />
    <TImage
      :src="sampleImage"
      alt=""
      ratio="square"
      position="right"
      radius="full"
      caption="radius full, position right"
    />
    <TImage
      :src="brokenImage"
      :fallback-src="sampleImage"
      alt="Mountains under a violet sky"
      ratio="4-3"
      radius="md"
      caption="broken src, fallbackSrc"
    />
    <TImage
      :src="brokenImage"
      alt="Mountains under a violet sky"
      ratio="4-3"
      radius="md"
      caption="broken, default fallback"
    />
  </TGrid>
</template>
