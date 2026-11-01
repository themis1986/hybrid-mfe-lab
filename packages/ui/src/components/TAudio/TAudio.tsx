import { VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  applyPlayback,
  mediaCaptionClasses,
  mediaRootClasses,
  prefersReducedMotion,
  sourcesKey,
  type TMediaStatus,
} from '../../lib/media'
import { useComposedRef } from '../../lib/refs'
import { TIcon } from '../TIcon'
import { tAudioFallbackClasses, tAudioVariants } from './TAudio.variants'
import type { TAudioProps } from './types'

// An <audio> player with native controls, the width of its root, and a fallback in its place when nothing
// can be played. Name it with aria-label when no visible text says what it plays. The root's data-state is
// loading, loaded (metadata known) or error.
export function TAudio({
  src,
  sources,
  caption,
  fallback,
  errorLabel = "This audio can't be played",
  controls = true,
  preload = 'metadata',
  autoPlay,
  volume,
  playbackRate,
  startTime,
  onLoadedMetadata,
  onError,
  ref,
  className,
  style,
  ...props
}: TAudioProps) {
  const own = useRef<HTMLAudioElement>(null)
  const audioRef = useComposedRef(own, ref)
  // New sources re-create the <audio> (changing its <source> children doesn't reload it) and start over.
  const key = sourcesKey(src, sources)
  const [status, setStatus] = useState({ key, value: 'loading' as TMediaStatus })
  if (status.key !== key) setStatus({ key, value: 'loading' })
  const [reducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    if (own.current) applyPlayback(own.current, { volume, playbackRate })
  }, [volume, playbackRate, key])

  const fail = () => setStatus({ key, value: 'error' })
  const failed = status.value === 'error'
  const Root = caption != null ? 'figure' : 'div'

  return (
    <Root data-slot="audio" data-state={status.value} className={cn(mediaRootClasses, className)} style={style}>
      <audio
        {...props}
        key={key}
        ref={audioRef}
        src={sources?.length ? undefined : src}
        controls={controls}
        preload={preload}
        autoPlay={autoPlay && !reducedMotion}
        className={tAudioVariants({ failed })}
        onLoadedMetadata={(event) => {
          const audio = event.currentTarget
          if (startTime !== undefined) audio.currentTime = startTime
          // Loading resets the rate to the default one.
          applyPlayback(audio, { volume, playbackRate })
          setStatus({ key, value: 'loaded' })
          onLoadedMetadata?.(event)
        }}
        onError={(event) => {
          fail()
          onError?.(event)
        }}
      >
        {/* With <source> children, failures fire on each source: the last one failing means none can play. */}
        {sources?.map((source, index) => (
          <source
            key={source.src}
            src={source.src}
            type={source.type}
            media={source.media}
            onError={index === sources.length - 1 ? fail : undefined}
          />
        ))}
      </audio>
      {failed && (
        <div data-slot="audio-fallback" className={tAudioFallbackClasses}>
          {fallback ?? (
            <>
              <TIcon icon={VolumeX} size="sm" />
              <span>{errorLabel}</span>
            </>
          )}
        </div>
      )}
      {caption != null && <figcaption className={mediaCaptionClasses}>{caption}</figcaption>}
    </Root>
  )
}
