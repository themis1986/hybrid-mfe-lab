import {
  CircleCheck,
  File as FileIcon,
  RotateCw,
  Upload,
  X,
} from 'lucide-react'
import {
  type DragEvent,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import { useComposedRef } from '../../lib/refs'
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
import {
  tFieldHintVariants,
  tFieldLabelClasses,
} from '../TField/TField.variants'
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
// the queue are lib/upload.ts, shared with Vue. The native input stays in step with the list, so a form
// submits every listed file.
export function TUpload({
  value: valueProp,
  defaultValue,
  onValueChange,
  label,
  description,
  error,
  accept,
  multiple = false,
  maxFiles,
  maxSize,
  minSize,
  validate,
  onReject,
  formatRejection,
  upload,
  autoUpload = true,
  maxConcurrent = 3,
  onUploadComplete,
  onUploadError,
  variant = 'dropzone',
  showList = true,
  previews = true,
  dropLabel,
  browseLabel = 'Browse',
  removeLabel = 'Remove',
  retryLabel = 'Retry',
  uploadLabel = 'Upload',
  uploadedLabel = 'Uploaded',
  disabled,
  id,
  ref,
  className,
  style,
  ...props
}: TUploadProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const labelId = `${inputId}-label`
  const hintId = `${inputId}-hint`
  const rejectionsId = `${inputId}-rejections`

  const own = useRef<HTMLInputElement>(null)
  const inputRef = useComposedRef(own, ref)
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => defaultValue ?? [],
  )
  const files = valueProp ?? uncontrolledValue
  const [rejections, setRejections] = useState<TUploadRejection[]>([])
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  const [queue] = useState(() => createUploadQueue(rerender))
  const [previewCache] = useState(createPreviewCache)

  useEffect(() => {
    queue.configure({
      upload,
      maxConcurrent,
      onComplete: onUploadComplete,
      onError: onUploadError,
    })
  })
  // The list is the source of truth: removed files are forgotten (uploads aborted, thumbnails revoked), and
  // the native input is kept in step.
  useEffect(() => {
    queue.sync(files)
    previewCache.prune(files)
    if (own.current) syncInputFiles(own.current, files)
  }, [queue, previewCache, files])
  useEffect(() => {
    // Thumbnails are created on render: after a remount (StrictMode), render again to replace revoked ones.
    rerender()
    return () => {
      queue.abortAll()
      previewCache.clear()
    }
  }, [queue, previewCache])

  const rules = { accept, multiple, maxFiles, maxSize, minSize, validate }

  function commit(next: File[]) {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  // Adds picked or dropped files; returns the list to show.
  function add(incoming: File[]) {
    if (disabled || incoming.length === 0) return files
    const result = selectFiles(incoming, files, rules)
    setRejections(result.rejected)
    if (result.rejected.length > 0) onReject?.(result.rejected)
    if (result.accepted.length > 0) {
      commit(result.files)
      if (upload && autoUpload) queue.enqueue(result.accepted)
    }
    return result.files
  }

  function remove(file: File) {
    commit(files.filter((other) => other !== file))
    // The item's button is gone: focus returns to the input (its ring shows on the drop zone).
    own.current?.focus()
  }

  // Only drags that carry files are handled; the depth counter ignores enter/leave between children.
  function onDragEnter(event: DragEvent) {
    if (disabled || !draggingFiles(event.nativeEvent)) return
    event.preventDefault()
    dragDepth.current++
    setDragging(true)
  }
  function onDragOver(event: DragEvent) {
    if (disabled || !draggingFiles(event.nativeEvent)) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }
  function onDragLeave() {
    if (dragDepth.current > 0 && --dragDepth.current === 0) setDragging(false)
  }
  function onDrop(event: DragEvent) {
    if (disabled || !draggingFiles(event.nativeEvent)) return
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    const next = add([...event.dataTransfer.files])
    if (own.current) syncInputFiles(own.current, next)
  }

  const hint = error ?? description
  const messages = rejections.map(
    (rejection) =>
      formatRejection?.(rejection) ?? describeRejection(rejection, rules),
  )
  const describedBy =
    [hint && hintId, messages.length > 0 && rejectionsId]
      .filter(Boolean)
      .join(' ') || undefined
  const pending = files.filter((file) =>
    ['idle', 'error'].includes(queue.get(file).status),
  )

  return (
    <div
      data-slot="upload"
      className={cn(tUploadRootClasses, className)}
      style={style}
    >
      {label && (
        <span id={labelId} className={tFieldLabelClasses}>
          {label}
        </span>
      )}
      <input
        {...props}
        ref={inputRef}
        id={inputId}
        type="file"
        accept={toAccept(accept)}
        multiple={multiple}
        disabled={disabled}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="peer sr-only"
        onChange={(event) => {
          const input = event.currentTarget
          syncInputFiles(input, add([...(input.files ?? [])]))
        }}
      />
      <label
        htmlFor={inputId}
        data-slot="upload-dropzone"
        data-dragging={dragging || undefined}
        // cn: the dragging colours replace the base ones.
        className={cn(tUploadDropzoneVariants({ variant, dragging }))}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <TIcon icon={Upload} size={variant === 'compact' ? 'sm' : 'lg'} />
        <span>
          {dropLabel ??
            (multiple
              ? 'Drag and drop files here, or'
              : 'Drag and drop a file here, or')}
        </span>
        <span className={tButtonVariants({ variant: 'soft', size: 'sm' })}>
          {browseLabel}
        </span>
      </label>
      {hint && (
        <p
          id={hintId}
          role={error ? 'alert' : undefined}
          className={tFieldHintVariants({
            tone: error ? 'error' : 'description',
          })}
        >
          {hint}
        </p>
      )}
      {messages.length > 0 && (
        <div
          id={rejectionsId}
          role="alert"
          data-slot="upload-rejections"
          className={tUploadRejectionsClasses}
        >
          {messages.map((message, index) => (
            <p key={index} className={tFieldHintVariants({ tone: 'error' })}>
              {message}
            </p>
          ))}
        </div>
      )}
      {showList && files.length > 0 && (
        <ul
          data-slot="upload-list"
          aria-label={label}
          className={tUploadListClasses}
        >
          {files.map((file) => {
            const state = queue.get(file)
            const preview = previews ? previewCache.get(file) : undefined
            const percent =
              state.status === 'uploading' && state.progress !== undefined
                ? ` · ${Math.round(state.progress)}%`
                : ''

            return (
              <li
                key={fileKey(file)}
                data-slot="upload-item"
                data-status={state.status}
                className={tUploadItemVariants({ status: state.status })}
              >
                <span className={tUploadPreviewClasses}>
                  {preview ? (
                    <img
                      src={preview}
                      alt=""
                      className={tUploadPreviewImageClasses}
                    />
                  ) : (
                    <TIcon icon={FileIcon} />
                  )}
                </span>
                <div className={tUploadItemBodyClasses}>
                  <span title={file.name} className={tUploadItemNameClasses}>
                    {file.name}
                  </span>
                  <span className={tUploadItemMetaClasses}>
                    {formatBytes(file.size)}
                    {percent}
                  </span>
                  {(state.status === 'queued' ||
                    state.status === 'uploading') && (
                    <TProgress
                      value={
                        state.status === 'uploading'
                          ? state.progress
                          : undefined
                      }
                      size="sm"
                      aria-label={file.name}
                    />
                  )}
                  {state.status === 'error' && (
                    <span className={tUploadItemErrorClasses}>
                      {state.error}
                    </span>
                  )}
                </div>
                {state.status === 'done' && (
                  <TIcon
                    icon={CircleCheck}
                    label={uploadedLabel}
                    className={tUploadDoneClasses}
                  />
                )}
                {state.status === 'error' && upload && (
                  <TButton
                    variant="ghost"
                    size="sm"
                    aria-label={`${retryLabel} ${file.name}`}
                    disabled={disabled}
                    className={tUploadItemActionClasses}
                    onClick={() => queue.enqueue([file])}
                  >
                    <TIcon icon={RotateCw} size="sm" />
                  </TButton>
                )}
                <TButton
                  variant="ghost"
                  size="sm"
                  aria-label={`${removeLabel} ${file.name}`}
                  disabled={disabled}
                  className={tUploadItemActionClasses}
                  onClick={() => remove(file)}
                >
                  <TIcon icon={X} size="sm" />
                </TButton>
              </li>
            )
          })}
        </ul>
      )}
      {upload && !autoUpload && pending.length > 0 && (
        <TButton
          size="sm"
          disabled={disabled}
          className={tUploadSubmitClasses}
          onClick={() => queue.enqueue(pending)}
        >
          {uploadLabel}
        </TButton>
      )}
    </div>
  )
}
