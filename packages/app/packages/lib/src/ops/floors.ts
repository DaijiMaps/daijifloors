import { emptySvg } from '../empty'
import type { FloorsConfig } from '../types/floor'

export const floorsOps: FloorsConfig = {
  idx: 0,
  names: ['1F'],
  floors: { '1F': {} },
  viewBox: `0 0 0 0`,
  assets: emptySvg,
  markers: emptySvg,
  renderers: { '1F': emptySvg },
}

export const installFloorsOps = (x: FloorsConfig) => {
  floorsOps.idx = x.idx
  floorsOps.names = x.names
  floorsOps.floors = x.floors
  floorsOps.viewBox = x.viewBox
  floorsOps.assets = x.assets
  floorsOps.markers = x.markers
  floorsOps.renderers = x.renderers
}
