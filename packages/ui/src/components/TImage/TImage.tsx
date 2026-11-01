import { ImageOff } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  mediaCaptionClasses,
  mediaRootClasses,
  ratioPreset,
  ratioValue,
  type TMediaStatus,
} from '../../lib/media'
import { useComposedRef } from '../../lib/refs'
import { TIcon } from '../TIcon'
import {
  tImageFallbackClasses,
  tImageFrameVariants,
  tImageVariants,
} from './TImage.variants'
import type { TImageProps } from './types'

function initialState(
  src: string | undefined,
  fallbackSrc: string | undefined,
) {
  const current = src || fallbackSrc
  return {
    src,
    current,
    status: (current ? 'loading' : 'error') as TMediaStatus,
  }
}

// An <img> in a box: an optional ratio, a skeleton while it loads, a fallback image and then fallback
// content when it fails, and an optional caption (the root is then a <figure>). The root's data-state is
// loading, loaded or error.
export function TImage({
  src,
  alt,
  ratio,
  fit,
  position,
  radius,
  bordered,
  placeholder = 'skeleton',
  fallbackSrc,
  fallback,
  caption,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ref,
  className,
  style,
  ...props
}: TImageProps) {
  const own = useRef<HTMLImageElement>(null)
  const imgRef = useComposedRef(own, ref)
  // The status belongs to one src: a new src starts over (adjusted during render, not in an effect).
  const [state, setState] = useState(() => initialState(src, fallbackSrc))
  if (state.src !== src) setState(initialState(src, fallbackSrc))

  const sized = ratio !== undefined
  const failed = state.status === 'error'
  const Root = caption != null ? 'figure' : 'div'

  return (
    <Root
      data-slot="image"
      data-state={state.status}
      className={cn(mediaRootClasses, className)}
      style={style}
    >
      <div
        data-slot="image-frame"
        className={tImageFrameVariants({
          ratio: ratioPreset(ratio),
          sized,
          radius,
          bordered,
          pending: placeholder === 'skeleton' && state.status === 'loading',
        })}
        style={{ aspectRatio: ratioValue(ratio) }}
      >
        <img
          {...props}
          ref={imgRef}
          src={state.current}
          alt={alt}
          loading={loading}
          decoding={decoding}
          className={tImageVariants({ sized, fit, failed })}
          style={position ? { objectPosition: position } : undefined}
          onLoad={(event) => {
            setState((current) => ({ ...current, status: 'loaded' }))
            onLoad?.(event)
          }}
          onError={(event) => {
            setState((current) =>
              fallbackSrc && current.current !== fallbackSrc
                ? { ...current, current: fallbackSrc }
                : { ...current, status: 'error' },
            )
            onError?.(event)
          }}
        />
        {failed && (
          <div data-slot="image-fallback" className={tImageFallbackClasses}>
            {fallback ?? (
              <TIcon icon={ImageOff} size="lg" label={alt || undefined} />
            )}
          </div>
        )}
      </div>
      {caption != null && (
        <figcaption className={mediaCaptionClasses}>{caption}</figcaption>
      )}
    </Root>
  )
}
