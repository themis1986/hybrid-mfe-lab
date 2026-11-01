import type { TUploadFn, TUploadRejection } from '../../lib/upload'

// `class` and `style` go on the root; every other attribute (name, required, form, capture…) and listener
// goes on the native <input type="file">, which a form submits with every listed file. The list is v-model.
export interface TUploadProps {
  /** The input's id; generated when omitted. */
  id?: string
  /** Visible label; names the file input. Without one, pass aria-label. */
  label?: string
  /** Helper text under the drop zone. Replaced by `error` while one is set. */
  description?: string
  /** Error text. Marks the input as invalid and is announced. */
  error?: string
  disabled?: boolean
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
  /** The text shown for a rejected file; English by default. */
  formatRejection?: (rejection: TUploadRejection) => string
  /** Sends one file: report progress through the context, honour its abort signal. Without it, files are only listed. */
  upload?: TUploadFn
  /** Upload as soon as files are added; otherwise an upload button sends them. */
  autoUpload?: boolean
  /** How many files upload at once. */
  maxConcurrent?: number
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
