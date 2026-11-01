import { cva } from 'class-variance-authority'

// A composite of TField's label and hint, TButton, TProgress and TIcon: their own classes do most of the
// work, so these are only what the upload adds.

// `relative` holds the visually hidden input.
export const tUploadRootClasses = 'relative box-border flex min-w-0 flex-col gap-1.5 text-fg'

// The drop zone is the file input's <label>: clicking anywhere in it opens the file dialog. The input
// itself is visually hidden just before it (`peer`), so its focus ring, disabled and invalid states are
// shown on the zone. `dragging` is set while files are dragged over it.
export const tUploadDropzoneVariants = cva(
  [
    'box-border flex cursor-pointer rounded-lg border border-dashed border-line-strong bg-transparent text-sm text-fg-muted',
    'transition-colors duration-150 ease-out peer-enabled:hover:bg-surface',
    'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    'peer-aria-invalid:border-danger',
  ],
  {
    variants: {
      variant: {
        dropzone: 'flex-col items-center justify-center gap-2 px-4 py-8 text-center',
        compact: 'flex-row flex-wrap items-center gap-3 px-3 py-2 text-start',
      },
      dragging: {
        true: 'border-accent bg-accent-subtle text-accent-fg',
        false: '',
      },
    },
    defaultVariants: { variant: 'dropzone', dragging: false },
  },
)

// The rejected files' messages, each a TField error hint.
export const tUploadRejectionsClasses = 'flex flex-col gap-0.5'

export const tUploadListClasses = 'm-0 flex list-none flex-col gap-2 p-0'

export const tUploadItemVariants = cva(
  'box-border flex min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-sm',
  {
    variants: {
      status: {
        idle: 'border-line',
        queued: 'border-line',
        uploading: 'border-line',
        done: 'border-line',
        error: 'border-danger-line bg-danger-subtle',
      },
    },
    defaultVariants: { status: 'idle' },
  },
)

// The thumbnail of an image, or a file icon in its place.
export const tUploadPreviewClasses =
  'box-border flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface text-fg-muted'
export const tUploadPreviewImageClasses = 'block size-full object-cover'

export const tUploadItemBodyClasses = 'flex min-w-0 flex-1 flex-col gap-1'
export const tUploadItemNameClasses = 'truncate font-medium text-fg'
export const tUploadItemMetaClasses = 'text-xs text-fg-muted tabular-nums'
export const tUploadItemErrorClasses = 'text-xs text-danger-fg'

// Merged onto ghost TButtons: icon only.
export const tUploadItemActionClasses = 'w-8 px-0 text-fg-muted'
export const tUploadDoneClasses = 'text-success-fg'

// The upload button of manual mode (autoUpload false), merged onto a TButton.
export const tUploadSubmitClasses = 'self-start'
