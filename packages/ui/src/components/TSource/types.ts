import type { SourceSpecification } from '@repo/map-core'
import type { ReactNode } from 'react'

export interface TSourceProps {
  /** Unique among the map's sources; TLayer specs reference it as `source`. */
  id: string
  /** A raw source spec (vector, raster-dem, image…). data, tiles and url update in place. */
  spec: SourceSpecification
  /** Its layers, usually; a layer anywhere else in the map works too. */
  children?: ReactNode
}
