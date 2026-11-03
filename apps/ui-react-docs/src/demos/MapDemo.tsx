import { TButton, TCluster, TStack } from '@repo/ui'
import {
  type GeoJsonStatus,
  TGeoJsonLayer,
  TMapView,
  type TMapViewHandle,
  TMarker,
  TPopup,
  TRasterTileLayer,
} from '@repo/ui/map'
import { useRef, useState } from 'react'
import {
  azores,
  crossing,
  earthquakesUrl,
  iberia,
  initialView,
  mapStyles,
  osmAttribution,
  osmTiles,
  places,
} from './mapData'

type LayerName = 'polygon' | 'line' | 'quakes' | 'tiles'

// The map demo: loaded on its own (React.lazy), so the map engine downloads only with it.
export default function MapDemo() {
  const map = useRef<TMapViewHandle>(null)
  const [style, setStyle] = useState<keyof typeof mapStyles>('standard')
  const [shown, setShown] = useState<Record<LayerName, boolean>>({
    polygon: true,
    line: true,
    quakes: true,
    tiles: false,
  })
  const [status, setStatus] = useState<string>('idle')
  const [picked, setPicked] = useState<string>()

  const toggle = (name: LayerName) =>
    setShown((current) => ({ ...current, [name]: !current[name] }))

  return (
    <TStack gap={3}>
      <TCluster gap={2}>
        {(Object.keys(shown) as LayerName[]).map((name) => (
          <TButton
            key={name}
            size="sm"
            variant={shown[name] ? 'soft' : 'outline'}
            aria-pressed={shown[name]}
            onClick={() => toggle(name)}
          >
            {name}
          </TButton>
        ))}
        <TButton
          size="sm"
          variant="outline"
          onClick={() =>
            setStyle((current) =>
              current === 'standard' ? 'light' : 'standard',
            )
          }
        >
          Style: {style}
        </TButton>
        <TButton
          size="sm"
          variant="ghost"
          // The escape hatch: the engine's map, here to list what is on it.
          onClick={() =>
            console.info(
              map.current
                ?.getMap()
                ?.getStyle()
                ?.layers.map((layer) => layer.id),
            )
          }
        >
          Log layers
        </TButton>
      </TCluster>

      <div className="h-96">
        <TMapView
          ref={map}
          accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle={mapStyles[style]}
          initialViewState={initialView}
          className="rounded-md"
        >
          <TRasterTileLayer
            id="osm"
            tiles={osmTiles}
            attribution={osmAttribution}
            opacity={0.5}
            visible={shown.tiles}
          />
          <TGeoJsonLayer
            id="iberia"
            data={iberia}
            type="fill"
            visible={shown.polygon}
          />
          <TGeoJsonLayer
            id="crossing"
            data={crossing}
            type="line"
            paint={{ 'line-width': 3, 'line-dasharray': [2, 1] }}
            visible={shown.line}
          />
          <TGeoJsonLayer
            id="quakes"
            data={earthquakesUrl}
            type="circle"
            cluster
            refreshInterval={60_000}
            visible={shown.quakes}
            onStatusChange={(next: GeoJsonStatus, error) =>
              setStatus(error ? `${next}: ${error.message}` : next)
            }
            onFeatureClick={({ feature }) =>
              setPicked(String(feature.properties?.title ?? feature.id))
            }
          />

          <TMarker
            lngLat={places[0].lngLat}
            popup={<TPopup offset={20}>Lisbon: a custom marker.</TPopup>}
          >
            <span className="block size-4 cursor-pointer rounded-full border-2 border-canvas bg-accent shadow-sm" />
          </TMarker>
          <TMarker
            lngLat={places[1].lngLat}
            popup={<TPopup offset={36}>New York: the default pin.</TPopup>}
          />
          <TMarker
            lngLat={places[2].lngLat}
            draggable
            onDragEnd={([lng, lat]) =>
              setPicked(
                `Reykjavik dropped at ${lng.toFixed(2)}, ${lat.toFixed(2)}`,
              )
            }
          />
          <TPopup lngLat={azores} closeButton={false}>
            Azores
          </TPopup>
        </TMapView>
      </div>

      <p className="m-0 text-sm text-fg-muted">
        Earthquakes: {status}
        {picked && ` · ${picked}`}
      </p>
    </TStack>
  )
}
