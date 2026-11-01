// The upload component's logic, shared by both libraries (identical in each): which files are accepted,
// the upload queue, and image previews. Plain data and DOM APIs only; each framework re-renders on change.

/** Where a file is in its upload. `idle`: selected, not sent yet (no `upload` function, or manual mode). */
export type TUploadStatus = 'idle' | 'queued' | 'uploading' | 'done' | 'error'

export interface TUploadFileState {
  status: TUploadStatus
  /** 0–100 while uploading, once the upload function reports it. */
  progress?: number
  /** The error message, when the upload failed. */
  error?: string
}

/** Why a file wasn't added. */
export type TUploadRejectReason =
  'type' | 'too-large' | 'too-small' | 'too-many' | 'duplicate' | 'invalid'

export interface TUploadRejection {
  file: File
  reason: TUploadRejectReason
  /** The `validate` function's message, for `invalid`. */
  message?: string
}

export interface TUploadContext {
  /** Aborted when the file is removed or the component unmounts: pass it to fetch or abort your XHR. */
  signal: AbortSignal
  /** Reports progress, 0–100. */
  onProgress: (percent: number) => void
}

/** Sends one file. Resolve when done; reject (with an Error) to mark it failed. */
export type TUploadFn = (
  file: File,
  context: TUploadContext,
) => Promise<unknown>

export interface TUploadRules {
  /** Accepted types: MIME types ('image/png'), wildcards ('image/*') or extensions ('.pdf'). */
  accept?: string | string[]
  multiple?: boolean
  /** The most files the list may hold (multiple mode). */
  maxFiles?: number
  /** Bytes. */
  maxSize?: number
  /** Bytes. */
  minSize?: number
  /** Extra check: return a message to reject the file. */
  validate?: (file: File) => string | undefined
}

/** The accept attribute: a list is comma-separated. */
export function toAccept(accept: string | string[] | undefined) {
  return Array.isArray(accept) ? accept.join(',') : accept
}

function acceptList(accept: string | string[] | undefined) {
  const list = Array.isArray(accept) ? accept : (accept ?? '').split(',')
  return list.map((entry) => entry.trim().toLowerCase()).filter(Boolean)
}

/** Whether a file matches the accept list. The dialog filters too, but dropped files skip it. */
export function matchesAccept(
  file: File,
  accept: string | string[] | undefined,
) {
  const list = acceptList(accept)
  if (list.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return list.some((entry) => {
    if (entry.startsWith('.')) return name.endsWith(entry)
    if (entry.endsWith('/*')) return type.startsWith(entry.slice(0, -1))
    return type === entry
  })
}

/** The same file selected twice (name, size and modification time). */
export function sameFile(a: File, b: File) {
  return (
    a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
  )
}

/** A key for a listed file: duplicates are rejected, so it is unique in the list. */
export function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`
}

/**
 * Splits newly picked files into accepted and rejected, given the files already in the list. In single
 * mode the first acceptable file replaces the list; in multiple mode accepted files are appended.
 */
export function selectFiles(
  incoming: File[],
  current: File[],
  rules: TUploadRules,
) {
  const accepted: File[] = []
  const rejected: TUploadRejection[] = []
  const kept = rules.multiple ? current : []
  const limit = rules.multiple ? (rules.maxFiles ?? Infinity) : 1

  for (const file of incoming) {
    const reject = (reason: TUploadRejectReason, message?: string) =>
      rejected.push({ file, reason, message })
    if (!matchesAccept(file, rules.accept)) reject('type')
    else if (rules.maxSize !== undefined && file.size > rules.maxSize)
      reject('too-large')
    else if (rules.minSize !== undefined && file.size < rules.minSize)
      reject('too-small')
    else if ([...kept, ...accepted].some((other) => sameFile(other, file)))
      reject('duplicate')
    else if (kept.length + accepted.length >= limit) reject('too-many')
    else {
      const message = rules.validate?.(file)
      if (message) reject('invalid', message)
      else accepted.push(file)
    }
  }

  return {
    files: accepted.length > 0 ? [...kept, ...accepted] : current,
    accepted,
    rejected,
  }
}

/** A file size for people: 1.2 MB (decimal units, in the page's locale). */
export function formatBytes(bytes: number, locale?: string) {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'] as const
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000
    unit++
  }
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[unit],
    unitDisplay: unit === 0 ? 'long' : 'short',
    maximumFractionDigits: unit === 0 ? 0 : 1,
  }).format(value)
}

/** The default text for a rejection (English); the components take a `formatRejection` to replace it. */
export function describeRejection(
  rejection: TUploadRejection,
  rules: TUploadRules,
) {
  const name = rejection.file.name
  switch (rejection.reason) {
    case 'type':
      return `${name} isn't an accepted file type.`
    case 'too-large':
      return `${name} is larger than ${formatBytes(rules.maxSize ?? 0)}.`
    case 'too-small':
      return `${name} is smaller than ${formatBytes(rules.minSize ?? 0)}.`
    case 'too-many':
      return rules.multiple
        ? `${name} wasn't added: ${rules.maxFiles} files at most.`
        : `${name} wasn't added: one file only.`
    case 'duplicate':
      return `${name} is already in the list.`
    case 'invalid':
      return rejection.message ?? `${name} can't be added.`
  }
}

/** Whether a drag carries files (not text or a link). */
export function draggingFiles(event: DragEvent) {
  return event.dataTransfer?.types.includes('Files') ?? false
}

/**
 * Puts the list into a native file input, so a form submits every listed file (not only the last
 * selection). Skipped where the DataTransfer constructor is missing.
 */
export function syncInputFiles(input: HTMLInputElement, files: File[]) {
  if (typeof DataTransfer !== 'function') return
  const transfer = new DataTransfer()
  for (const file of files) transfer.items.add(file)
  input.files = transfer.files
}

export function isImage(file: File) {
  return file.type.startsWith('image/')
}

/** Object URLs for image thumbnails, revoked when their file leaves the list or on clear(). */
export function createPreviewCache() {
  const urls = new Map<File, string>()

  return {
    get(file: File) {
      if (!isImage(file) || typeof URL.createObjectURL !== 'function')
        return undefined
      let url = urls.get(file)
      if (!url) {
        url = URL.createObjectURL(file)
        urls.set(file, url)
      }
      return url
    },
    /** Revokes the URLs of files no longer listed. */
    prune(files: File[]) {
      for (const [file, url] of urls) {
        if (!files.includes(file)) {
          URL.revokeObjectURL(url)
          urls.delete(file)
        }
      }
    },
    clear() {
      for (const url of urls.values()) URL.revokeObjectURL(url)
      urls.clear()
    },
  }
}

export interface TUploadQueueOptions {
  upload?: TUploadFn
  /** How many files upload at once. */
  maxConcurrent?: number
  onComplete?: (file: File, result: unknown) => void
  onError?: (file: File, error: unknown) => void
}

/**
 * Runs uploads, at most `maxConcurrent` at a time, and keeps each file's state. Calls `onChange` after
 * every state change; the component reads the states back with `get`. Removing a file aborts its upload.
 */
export function createUploadQueue(onChange: () => void) {
  const states = new Map<File, TUploadFileState>()
  const running = new Map<File, AbortController>()
  let waiting: File[] = []
  let options: TUploadQueueOptions = {}

  function set(file: File, state: TUploadFileState) {
    states.set(file, state)
    onChange()
  }

  function start(file: File) {
    const upload = options.upload
    if (!upload) return
    const controller = new AbortController()
    running.set(file, controller)
    set(file, { status: 'uploading' })

    const onProgress = (percent: number) => {
      if (!controller.signal.aborted)
        set(file, {
          status: 'uploading',
          progress: Math.min(100, Math.max(0, percent)),
        })
    }
    upload(file, { signal: controller.signal, onProgress })
      .then(
        (result) => {
          if (controller.signal.aborted) return
          set(file, { status: 'done', progress: 100 })
          options.onComplete?.(file, result)
        },
        (error: unknown) => {
          if (controller.signal.aborted) return
          set(file, {
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
          })
          options.onError?.(file, error)
        },
      )
      .finally(() => {
        running.delete(file)
        pump()
      })
  }

  function pump() {
    while (running.size < (options.maxConcurrent ?? 3) && waiting.length > 0)
      start(waiting.shift()!)
  }

  function cancel(file: File) {
    running.get(file)?.abort()
    running.delete(file)
    waiting = waiting.filter((other) => other !== file)
  }

  return {
    /** The latest options (the upload function and callbacks may change on every render). */
    configure(next: TUploadQueueOptions) {
      options = next
    },
    get(file: File): TUploadFileState {
      return states.get(file) ?? { status: 'idle' }
    },
    /** Queues files for upload (again, after an error). */
    enqueue(files: File[]) {
      if (!options.upload) return
      for (const file of files) {
        if (running.has(file) || waiting.includes(file)) continue
        waiting.push(file)
        states.set(file, { status: 'queued' })
      }
      onChange()
      pump()
    },
    /** Forgets files no longer listed, aborting their uploads. */
    sync(files: File[]) {
      for (const file of [...states.keys()]) {
        if (!files.includes(file)) {
          cancel(file)
          states.delete(file)
        }
      }
    },
    /** Aborts everything (unmount). The queue stays usable. */
    abortAll() {
      for (const file of [...running.keys(), ...waiting]) {
        cancel(file)
        states.delete(file)
      }
    },
  }
}
