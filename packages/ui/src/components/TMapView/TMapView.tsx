import {
  applyBounds,
  applyView,
  createMap,
  DEFAULT_MAP_STYLE,
  type MapHandle,
  readView,
  setInteractive,
  setMapStyle,
  type ViewState,
} from '@repo/map-core'
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '../../lib/cn'
import { MapContext, useLatest } from './context'
import {
  tMapViewCanvasClasses,
  tMapViewClasses,
  tMapViewMessageClasses,
} from './TMapView.variants'
import type { TMapViewProps } from './types'

// A Mapbox map filling its parent. Its children (markers, popups, layers) render once the map exists and
// register with its layer manager, which keeps them across style changes. Without a token it renders a
// message instead, and creates no map.
export function TMapView({
  accessToken,
  mapStyle = DEFAULT_MAP_STYLE,
  initialViewState,
  center,
  zoom,
  bearing,
  pitch,
  bounds,
  fitBoundsOptions,
  interactive = true,
  missingTokenLabel = 'Set a Mapbox access token to show the map.',
  onLoad,
  onClick,
  onMove,
  onMoveEnd,
  onError,
  ref,
  className,
  style,
  children,
}: TMapViewProps) {
  const container = useRef<HTMLDivElement>(null)
  const [handle, setHandle] = useState<MapHandle | null>(null)
  const controlled = defined({ center, zoom, bearing, pitch })
  const latest = useLatest({
    mapStyle,
    view: { ...initialViewState, ...controlled },
    bounds,
    fitBoundsOptions,
    interactive,
    onLoad,
    onClick,
    onMove,
    onMoveEnd,
    onError,
  })
  // What the map was last given, so a prop is applied only when it changes after creation.
  const applied = useRef({ mapStyle, bounds: boundsKey(bounds) })

  // One map per token. Under StrictMode the effect runs twice: the cleanup removes the first map entirely.
  useEffect(() => {
    if (!accessToken || !container.current) return
    const options = latest.current
    const created = createMap(container.current, {
      accessToken,
      style: options.mapStyle,
      view: options.view,
      bounds: options.bounds,
      fitBoundsOptions: options.fitBoundsOptions,
      interactive: options.interactive,
    })
    applied.current = {
      mapStyle: options.mapStyle,
      bounds: boundsKey(options.bounds),
    }
    const { map } = created
    map.on('load', () => latest.current.onLoad?.(map))
    map.on('click', (event) => latest.current.onClick?.(event))
    map.on('move', () => latest.current.onMove?.(readView(map)))
    map.on('moveend', () => latest.current.onMoveEnd?.(readView(map)))
    map.on('error', ({ error }) => {
      if (latest.current.onError) latest.current.onError(error)
      else console.error(error)
    })
    setHandle(created)
    return () => {
      setHandle(null)
      created.destroy()
    }
  }, [accessToken, latest])

  useEffect(() => {
    if (!handle || applied.current.mapStyle === mapStyle) return
    applied.current.mapStyle = mapStyle
    setMapStyle(handle, mapStyle)
  }, [handle, mapStyle])

  // Echoed values are no-ops (applyView compares with the camera), so onMove → state → props can't loop.
  const [lng, lat] = center ?? []
  useEffect(() => {
    if (handle) applyView(handle.map, defined({ center, zoom, bearing, pitch }))
    // center is compared by value (lng, lat).
  }, [handle, lng, lat, zoom, bearing, pitch])

  const key = boundsKey(bounds)
  useEffect(() => {
    if (!handle || !bounds || applied.current.bounds === key) return
    applied.current.bounds = key
    applyBounds(handle.map, bounds, fitBoundsOptions)
    // bounds is compared by value; new options apply with the next bounds.
  }, [handle, key])

  useEffect(() => {
    if (handle) setInteractive(handle.map, interactive)
  }, [handle, interactive])

  useImperativeHandle(ref, () => ({ getMap: () => handle?.map ?? null }), [
    handle,
  ])

  const context = useMemo(
    () => handle && { map: handle.map, layers: handle.layers },
    [handle],
  )

  return (
    <div
      data-slot="map-view"
      className={cn(tMapViewClasses, className)}
      style={style}
    >
      {accessToken ? (
        <div
          ref={container}
          data-slot="map-view-canvas"
          className={tMapViewCanvasClasses}
        />
      ) : (
        <div
          role="status"
          data-slot="map-view-message"
          className={tMapViewMessageClasses}
        >
          {missingTokenLabel}
        </div>
      )}
      {context && <MapContext value={context}>{children}</MapContext>}
    </div>
  )
}

const boundsKey = (bounds: readonly number[] | undefined) => bounds?.join(',')

/** The view's parts that are set, so unset props never move the camera. */
function defined(view: Partial<ViewState>): Partial<ViewState> {
  return Object.fromEntries(
    Object.entries(view).filter(([, value]) => value !== undefined),
  )
}
