import type { ComponentProps } from 'react'
import type { TUploadFn, TUploadRejection } from '../../lib/upload'

// `className` and `style` go on the root; every other prop (name, required, form, capture…), `ref`
// included, goes on the native <input type="file">, which a form submits with every listed file.
export interface TUploadProps extends Omit<
  ComponentProps<'input'>,
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'accept'
  | 'multiple'
  | 'children'
  | 'size'
> {
  /** The listed files (controlled); pair it with onValueChange. */
  value?: File[]
  /** The initial files when uncontrolled. */
  defaultValue?: File[]
  /** Called with the new list when files are added or removed. */
  onValueChange?: (files: File[]) => void
  /** Visible label; names the file input. Without one, pass aria-label. */
  label?: string
  /** Helper text under the drop zone. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Marks the input as invalid and is announced. */
  error?: string
  /** Accepted types: MIME types ('image/png'), wildcards ('image/*') or extensions ('.pdf'). */
  accept?: string | string[]
  /** Several files; otherwise a new file replaces the current one. */
  multiple?: boolean
  /** The most files the list may hold (multiple mode). */
  maxFiles?: number
  /** Largest file, in bytes. */
  maxSize?: number
  /** Smallest file, in bytes. */
  minSize?: number
  /** Extra check: return a message to reject the file. */
  validate?: (file: File) => string | undefined
  /** Called with the files that weren't added, and why. */
  onReject?: (rejections: TUploadRejection[]) => void
  /** The text shown for a rejected file; English by default. */
  formatRejection?: (rejection: TUploadRejection) => string
  /** Sends one file: report progress through the context, honour its abort signal. Without it, files are only listed. */
  upload?: TUploadFn
  /** Upload as soon as files are added; otherwise an upload button sends them. */
  autoUpload?: boolean
  /** How many files upload at once. */
  maxConcurrent?: number
  /** Called when a file has uploaded, with what `upload` resolved to. */
  onUploadComplete?: (file: File, result: unknown) => void
  /** Called when a file's upload fails. */
  onUploadError?: (file: File, error: unknown) => void
  /** A large drop zone, or a one-line one for forms. */
  variant?: 'dropzone' | 'compact'
  /** The list of files under the drop zone. */
  showList?: boolean
  /** Thumbnails for image files in the list. */
  previews?: boolean
  /** The drop zone's text, before the browse button. */
  dropLabel?: string
  browseLabel?: string
  /** Accessible names of the item buttons are these, followed by the file name. */
  removeLabel?: string
  retryLabel?: string
  /** The upload button's text (autoUpload false). */
  uploadLabel?: string
  /** Accessible name of an uploaded file's check mark. */
  uploadedLabel?: string
}
