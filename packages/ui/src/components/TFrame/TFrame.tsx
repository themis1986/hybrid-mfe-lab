import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  mediaCaptionClasses,
  mediaOverlayClasses,
  mediaRootClasses,
  observeContentHeight,
  ratioPreset,
  ratioValue,
  type TMediaStatus,
  toAllow,
  toLength,
  toSandbox,
} from '../../lib/media'
import { useComposedRef } from '../../lib/refs'
import { TSpinner } from '../TSpinner'
import { tFrameBoxVariants, tFrameVariants } from './TFrame.variants'
import type { TFrameProps } from './types'

// An <iframe> in a box sized by a ratio, a fixed height or its content (autoHeight), with a spinner until
// it loads. Lazy-loaded, and sends only the origin as referrer by default. The root's data-state is
// loading or loaded (cross-origin frames report no errors).
export function TFrame({
  src,
  srcDoc,
  title,
  ratio = '16-9',
  height,
  autoHeight,
  sandbox,
  allow,
  radius,
  bordered = true,
  caption,
  showLoader = true,
  loadingLabel = 'Loading',
  loading = 'lazy',
  referrerPolicy = 'strict-origin-when-cross-origin',
  onLoad,
  ref,
  className,
  style,
  ...props
}: TFrameProps) {
  const own = useRef<HTMLIFrameElement>(null)
  const frameRef = useComposedRef(own, ref)
  // A new document starts over (adjusted during render, not in an effect).
  const key = `${src ?? ''}\n${srcDoc ?? ''}`
  const [status, setStatus] = useState({
    key,
    value: 'loading' as TMediaStatus,
  })
  if (status.key !== key) setStatus({ key, value: 'loading' })
  // Counts load events, including navigation inside the frame: each new document is observed again.
  const [loads, setLoads] = useState(0)
  const [contentHeight, setContentHeight] = useState<number>()

  useEffect(() => {
    if (!autoHeight || !own.current || loads === 0) return
    return observeContentHeight(own.current, setContentHeight)
  }, [autoHeight, loads])

  const measured = autoHeight && contentHeight !== undefined
  const byRatio = !measured && height === undefined
  const Root = caption != null ? 'figure' : 'div'

  return (
    <Root
      data-slot="frame"
      data-state={status.value}
      className={cn(mediaRootClasses, className)}
      style={style}
    >
      <div
        data-slot="frame-box"
        className={tFrameBoxVariants({
          ratio: byRatio ? ratioPreset(ratio) : null,
          radius,
          bordered,
        })}
        style={{
          aspectRatio: byRatio ? ratioValue(ratio) : undefined,
          height: measured ? undefined : toLength(height),
        }}
      >
        <iframe
          {...props}
          ref={frameRef}
          src={src}
          srcDoc={srcDoc}
          title={title}
          sandbox={toSandbox(sandbox)}
          allow={toAllow(allow)}
          loading={loading}
          referrerPolicy={referrerPolicy}
          className={tFrameVariants({ fill: !measured })}
          style={measured ? { height: contentHeight } : undefined}
          onLoad={(event) => {
            setStatus({ key, value: 'loaded' })
            setLoads((count) => count + 1)
            onLoad?.(event)
          }}
        />
        {showLoader && status.value === 'loading' && (
          <div data-slot="frame-loader" className={mediaOverlayClasses}>
            <TSpinner label={loadingLabel} />
          </div>
        )}
      </div>
      {caption != null && (
        <figcaption className={mediaCaptionClasses}>{caption}</figcaption>
      )}
    </Root>
  )
}
