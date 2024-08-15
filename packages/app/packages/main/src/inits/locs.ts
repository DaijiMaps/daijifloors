import locsWide from '../../data/locs-wide.json'
import locs from '../../data/locs.json'
import { installLocsOps } from '@daijimaps/daijifloors-app-lib'

export function initLocs() {
  installLocsOps({ locs, locsWide })
}
