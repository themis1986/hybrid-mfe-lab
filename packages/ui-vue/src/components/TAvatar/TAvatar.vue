<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRootAttrs } from '../../lib/attrs'
import { avatarInitials } from '../../lib/avatar'
import { tAvatarImageClasses, tAvatarVariants } from './TAvatar.variants'
import type { TAvatarProps } from './types'

// A picture of a person or thing, falling back to initials without an image or when it fails to load.
defineOptions({ inheritAttrs: false })
const props = defineProps<TAvatarProps>()
const failedSrc = ref<string>()
const showImage = computed(() => props.src && props.src !== failedSrc.value)
const root = useRootAttrs(() => tAvatarVariants({ size: props.size }))
</script>

<template>
  <span role="img" :aria-label="name" data-slot="avatar" v-bind="root()">
    <img
      v-if="showImage"
      :src="src"
      alt=""
      :class="tAvatarImageClasses"
      @error="failedSrc = src"
    />
    <template v-else>{{ avatarInitials(name) }}</template>
  </span>
</template>
