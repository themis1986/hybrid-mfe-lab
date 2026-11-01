<script setup lang="ts">
import { CircleCheck, File as FileIcon, RotateCw, Upload, X } from '@lucide/vue'
import { computed, onBeforeUnmount, ref, useId, watch, watchEffect } from 'vue'
import { useSplitAttrs } from '../../lib/attrs'
import { cn } from '../../lib/cn'
import {
  createPreviewCache,
  createUploadQueue,
  describeRejection,
  draggingFiles,
  fileKey,
  formatBytes,
  selectFiles,
  syncInputFiles,
  type TUploadRejection,
  toAccept,
} from '../../lib/upload'
import { TButton } from '../TButton'
import { tButtonVariants } from '../TButton/TButton.variants'
import { tFieldHintVariants, tFieldLabelClasses } from '../TField/TField.variants'
import { TIcon } from '../TIcon'
import { TProgress } from '../TProgress'
import {
  tUploadDoneClasses,
  tUploadDropzoneVariants,
  tUploadItemActionClasses,
  tUploadItemBodyClasses,
  tUploadItemErrorClasses,
  tUploadItemMetaClasses,
  tUploadItemNameClasses,
  tUploadItemVariants,
  tUploadListClasses,
  tUploadPreviewClasses,
  tUploadPreviewImageClasses,
  tUploadRejectionsClasses,
  tUploadRootClasses,
  tUploadSubmitClasses,
} from './TUpload.variants'
import type { TUploadProps } from './types'

// A file picker with a drop zone, a list of the files (thumbnails, sizes, remove), and optional uploads:
// given an `upload` function, it sends each file with progress, retry and abort. The selection logic and
// the queue are lib/upload.ts, shared with React. The native input stays in step with the list, so a form
// submits every listed file. `class` and `style` go on the root; every other attribute on the input.
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<TUploadProps>(), {
  autoUpload: true,
  maxConcurrent: 3,
  variant: 'dropzone',
  showList: true,
  previews: true,
  browseLabel: 'Browse',
  removeLabel: 'Remove',
  retryLabel: 'Retry',
  uploadLabel: 'Upload',
  uploadedLabel: 'Uploaded',
})
const emit = defineEmits<{
  reject: [rejections: TUploadRejection[]]
  'upload-complete': [file: File, result: unknown]
  'upload-error': [file: File, error: unknown]
}>()
// v-model; without one, the component keeps its own list.
const files = defineModel<File[]>({ default: () => [] })
const { root, inner } = useSplitAttrs(() => tUploadRootClasses)
const element = ref<HTMLInputElement | null>(null)
defineExpose({ element })

// useId() is unique within one Vue app. Several apps (microfrontends) on one page must each set their
// own app.config.idPrefix, or their ids can collide.
const generatedId = useId()
const inputId = computed(() => props.id ?? generatedId)
const labelId = computed(() => `${inputId.value}-label`)
const hintId = computed(() => `${inputId.value}-hint`)
const rejectionsId = computed(() => `${inputId.value}-rejections`)

const rejections = ref<TUploadRejection[]>([])
const dragging = ref(false)
let dragDepth = 0
// The queue keeps plain data: `version` is bumped on every change, and stateOf() reads it so the template
// re-renders.
const version = ref(0)
const queue = createUploadQueue(() => version.value++)
const previewCache = createPreviewCache()
function stateOf(file: File) {
  void version.value
  return queue.get(file)
}

watchEffect(() =>
  queue.configure({
    upload: props.upload,
    maxConcurrent: props.maxConcurrent,
    onComplete: (file, result) => emit('upload-complete', file, result),
    onError: (file, error) => emit('upload-error', file, error),
  }),
)
// The list is the source of truth: removed files are forgotten (uploads aborted, thumbnails revoked), and
// the native input is kept in step.
watch(
  [files, element],
  ([list, input]) => {
    queue.sync(list)
    previewCache.prune(list)
    if (input) syncInputFiles(input, list)
  },
  { flush: 'post' },
)
onBeforeUnmount(() => {
  queue.abortAll()
  previewCache.clear()
})

const rules = computed(() => ({
  accept: props.accept,
  multiple: props.multiple,
  maxFiles: props.maxFiles,
  maxSize: props.maxSize,
  minSize: props.minSize,
  validate: props.validate,
}))

// Adds picked or dropped files; returns the list to show.
function add(incoming: File[]) {
  if (props.disabled || incoming.length === 0) return files.value
  const result = selectFiles(incoming, files.value, rules.value)
  rejections.value = result.rejected
  if (result.rejected.length > 0) emit('reject', result.rejected)
  if (result.accepted.length > 0) {
    files.value = result.files
    if (props.upload && props.autoUpload) queue.enqueue(result.accepted)
  }
  return result.files
}

function onChange(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  syncInputFiles(input, add([...(input.files ?? [])]))
}

function remove(file: File) {
  files.value = files.value.filter((other) => other !== file)
  // The item's button is gone: focus returns to the input (its ring shows on the drop zone).
  element.value?.focus()
}

// Only drags that carry files are handled; the depth counter ignores enter/leave between children.
function onDragEnter(event: DragEvent) {
  if (props.disabled || !draggingFiles(event)) return
  event.preventDefault()
  dragDepth++
  dragging.value = true
}
function onDragOver(event: DragEvent) {
  if (props.disabled || !draggingFiles(event)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}
function onDragLeave() {
  if (dragDepth > 0 && --dragDepth === 0) dragging.value = false
}
function onDrop(event: DragEvent) {
  if (props.disabled || !draggingFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  dragging.value = false
  const next = add([...(event.dataTransfer?.files ?? [])])
  if (element.value) syncInputFiles(element.value, next)
}

const hint = computed(() => props.error ?? props.description)
const messages = computed(() =>
  rejections.value.map((rejection) => props.formatRejection?.(rejection) ?? describeRejection(rejection, rules.value)),
)
const describedBy = computed(
  () => [hint.value && hintId.value, messages.value.length > 0 && rejectionsId.value].filter(Boolean).join(' ') || undefined,
)
const pending = computed(() => files.value.filter((file) => ['idle', 'error'].includes(stateOf(file).status)))

function percentOf(file: File) {
  const state = stateOf(file)
  return state.status === 'uploading' && state.progress !== undefined ? ` · ${Math.round(state.progress)}%` : ''
}
</script>

<template>
  <div data-slot="upload" v-bind="root()">
    <span v-if="label" :id="labelId" :class="tFieldLabelClasses">{{ label }}</span>
    <input
      ref="element"
      v-bind="inner()"
      :id="inputId"
      type="file"
      :accept="toAccept(accept)"
      :multiple="multiple"
      :disabled="disabled"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="describedBy"
      :aria-invalid="error ? true : undefined"
      class="peer sr-only"
      @change="onChange"
    />
    <!-- cn: the dragging colours replace the base ones. -->
    <label
      :for="inputId"
      data-slot="upload-dropzone"
      :data-dragging="dragging || undefined"
      :class="cn(tUploadDropzoneVariants({ variant, dragging }))"
      @dragenter="onDragEnter"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <TIcon :icon="Upload" :size="variant === 'compact' ? 'sm' : 'lg'" />
      <span>{{ dropLabel ?? (multiple ? 'Drag and drop files here, or' : 'Drag and drop a file here, or') }}</span>
      <span :class="tButtonVariants({ variant: 'soft', size: 'sm' })">{{ browseLabel }}</span>
    </label>
    <p
      v-if="hint"
      :id="hintId"
      :role="error ? 'alert' : undefined"
      :class="tFieldHintVariants({ tone: error ? 'error' : 'description' })"
    >
      {{ hint }}
    </p>
    <div v-if="messages.length > 0" :id="rejectionsId" role="alert" data-slot="upload-rejections" :class="tUploadRejectionsClasses">
      <p v-for="(message, index) in messages" :key="index" :class="tFieldHintVariants({ tone: 'error' })">{{ message }}</p>
    </div>
    <ul v-if="showList && files.length > 0" data-slot="upload-list" :aria-label="label" :class="tUploadListClasses">
      <li
        v-for="file in files"
        :key="fileKey(file)"
        data-slot="upload-item"
        :data-status="stateOf(file).status"
        :class="tUploadItemVariants({ status: stateOf(file).status })"
      >
        <span :class="tUploadPreviewClasses">
          <img v-if="previews && previewCache.get(file)" :src="previewCache.get(file)" alt="" :class="tUploadPreviewImageClasses" />
          <TIcon v-else :icon="FileIcon" />
        </span>
        <div :class="tUploadItemBodyClasses">
          <span :title="file.name" :class="tUploadItemNameClasses">{{ file.name }}</span>
          <span :class="tUploadItemMetaClasses">{{ formatBytes(file.size) }}{{ percentOf(file) }}</span>
          <TProgress
            v-if="stateOf(file).status === 'queued' || stateOf(file).status === 'uploading'"
            :value="stateOf(file).status === 'uploading' ? stateOf(file).progress : undefined"
            size="sm"
            :aria-label="file.name"
          />
          <span v-if="stateOf(file).status === 'error'" :class="tUploadItemErrorClasses">{{ stateOf(file).error }}</span>
        </div>
        <TIcon v-if="stateOf(file).status === 'done'" :icon="CircleCheck" :label="uploadedLabel" :class="tUploadDoneClasses" />
        <TButton
          v-if="stateOf(file).status === 'error' && upload"
          variant="ghost"
          size="sm"
          :aria-label="`${retryLabel} ${file.name}`"
          :disabled="disabled"
          :class="tUploadItemActionClasses"
          @click="queue.enqueue([file])"
        >
          <TIcon :icon="RotateCw" size="sm" />
        </TButton>
        <TButton
          variant="ghost"
          size="sm"
          :aria-label="`${removeLabel} ${file.name}`"
          :disabled="disabled"
          :class="tUploadItemActionClasses"
          @click="remove(file)"
        >
          <TIcon :icon="X" size="sm" />
        </TButton>
      </li>
    </ul>
    <TButton
      v-if="upload && !autoUpload && pending.length > 0"
      size="sm"
      :disabled="disabled"
      :class="tUploadSubmitClasses"
      @click="queue.enqueue(pending)"
    >
      {{ uploadLabel }}
    </TButton>
  </div>
</template>
