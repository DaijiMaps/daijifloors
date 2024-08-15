import { main } from './global/main'
import { installAddressesOps } from './ops/addresses'
import { installFacilitiesOps } from './ops/facilities'
import { installFloorsOps } from './ops/floors'
import { HeaderOps, installHeaderOps } from './ops/header'
import { installLocsOps } from './ops/locs'
import { installParamsOps } from './ops/params'
import { installShopsOps } from './ops/shops'
import { FloorsConfig, FloorsConfigJson } from './types/floor'

export type { FloorsConfig, FloorsConfigJson, HeaderOps }

export {
  main,
  installAddressesOps,
  installFacilitiesOps,
  installFloorsOps,
  installHeaderOps,
  installLocsOps,
  installParamsOps,
  installShopsOps,
}
