import type { FeatureEvent, LayerSpecification } from '@repo/map-core'

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never

/** A raw layer spec, without the id and slot (props). */
export type TLayerSpec = DistributiveOmit<LayerSpecification, 'id' | 'slot'>

export interface TLayerProps {
  /** Unique among the map's layers. */
  id: string
  /** Paint, layout, filter and zoom range update in place; a new type or source re-creates it. */
  spec: TLayerSpec
  beforeId?: string
  slot?: string
  onFeatureClick?: (event: FeatureEvent) => void
  onFeatureEnter?: (event: FeatureEvent) => void
  onFeatureLeave?: () => void
}
