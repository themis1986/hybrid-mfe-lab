<script setup lang="ts">
import { TAudio, TStack } from '@repo/ui-vue'
import { ref } from 'vue'
import { brokenAudio, sampleAudio } from '../samples'

const playing = ref(false)
</script>

<template>
  <TStack :gap="5" class="max-w-md">
    <TAudio
      :src="sampleAudio"
      aria-label="T-rex roar"
      :caption="playing ? 'T-rex roar · playing' : 'T-rex roar'"
      @play="playing = true"
      @pause="playing = false"
      @ended="playing = false"
    />
    <TAudio
      :src="sampleAudio"
      :playback-rate="0.5"
      :volume="0.5"
      aria-label="T-rex roar, slowed"
      caption="Half speed, half volume"
    />
    <TAudio :src="brokenAudio" aria-label="Missing recording" />
  </TStack>
</template>
