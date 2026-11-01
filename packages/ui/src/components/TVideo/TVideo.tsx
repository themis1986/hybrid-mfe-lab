import { VideoOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import {
  applyPlayback,
  mediaCaptionClasses,
  mediaOverlayClasses,
  mediaRootClasses,
  prefersReducedMotion,
  ratioPreset,
  ratioValue,
  sourcesKey,
  type TMediaStatus,
} from '../../lib/media'
import { useComposedRef } from '../../lib/refs'
import { TIcon } from '../TIcon'
import { tVideoFrameVariants, tVideoVariants } from './TVideo.variants'
import type { TVideoProps } from './types'

// A <video> in a box with a fixed ratio, native controls, and a fallback over the box when nothing can be
// played. The root's data-state is loading, loaded (metadata known) or error.
export function TVideo({
  src,
  sources,
  tracks,
  ratio = '16-9',
  fit,
  radius,
  bordered,
  caption,
  fallback,
  errorLabel = "This video can't be played",
  controls = true,
  playsInline = true,
  preload = 'metadata',
  autoPlay,
  muted,
  volume,
  playbackRate,
  startTime,
  onLoadedMetadata,
  onError,
  ref,
  className,
  style,
  ...props
}: TVideoProps) {
  const own = useRef<HTMLVideoElement>(null)
  const videoRef = useComposedRef(own, ref)
  // New sources re-create the <video> (changing its <source> children doesn't reload it) and start over.
  const key = sourcesKey(src, sources)
  const [status, setStatus] = useState({ key, value: 'loading' as TMediaStatus })
  if (status.key !== key) setStatus({ key, value: 'loading' })
  const [reducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    if (own.current) applyPlayback(own.current, { volume, playbackRate })
  }, [volume, playbackRate, key])

  const fail = () => setStatus({ key, value: 'error' })
  const Root = caption != null ? 'figure' : 'div'

  return (
    <Root data-slot="video" data-state={status.value} className={cn(mediaRootClasses, className)} style={style}>
      <div
        data-slot="video-frame"
        className={tVideoFrameVariants({ ratio: ratioPreset(ratio), radius, bordered })}
        style={{ aspectRatio: ratioValue(ratio) }}
      >
        <video
          {...props}
          key={key}
          ref={videoRef}
          src={sources?.length ? undefined : src}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          autoPlay={autoPlay && !reducedMotion}
          muted={muted || autoPlay}
          className={tVideoVariants({ fit })}
          onLoadedMetadata={(event) => {
            const video = event.currentTarget
            if (startTime !== undefined) video.currentTime = startTime
            // Loading resets the rate to the default one.
            applyPlayback(video, { volume, playbackRate })
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
          {tracks?.map((track) => (
            <track
              key={track.src}
              src={track.src}
              kind={track.kind}
              srcLang={track.srcLang}
              label={track.label}
              default={track.default}
            />
          ))}
        </video>
        {status.value === 'error' && (
          <div data-slot="video-fallback" className={mediaOverlayClasses}>
            {fallback ?? (
              <>
                <TIcon icon={VideoOff} size="lg" />
                <span>{errorLabel}</span>
              </>
            )}
          </div>
        )}
      </div>
      {caption != null && <figcaption className={mediaCaptionClasses}>{caption}</figcaption>}
    </Root>
  )
}
