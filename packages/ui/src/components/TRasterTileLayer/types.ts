export interface TRasterTileLayerProps {
  /** Unique on the map: the source's id and the layer's. */
  id: string
  /** XYZ URL template(s), e.g. 'https://tile.example.org/{z}/{x}/{y}.png'. */
  tiles: string | string[]
  /** 256 or 512, as the server serves them. */
  tileSize?: number
  /** Credit shown in the map's attribution control. Most tile servers require it. */
  attribution?: string
  /** 0 to 1. */
  opacity?: number
  visible?: boolean
  minzoom?: number
  maxzoom?: number
  beforeId?: string
  slot?: string
}
