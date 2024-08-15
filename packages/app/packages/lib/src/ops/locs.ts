import { Locs } from '../types/loc'

export interface LocsOps {
  locs: Locs
  locsWide: Locs
}

export const locsOps: LocsOps = {
  locs: {},
  locsWide: {},
}

export const installLocsOps = (ops: LocsOps) => {
  locsOps.locs = ops.locs
  locsOps.locsWide = ops.locsWide
}
