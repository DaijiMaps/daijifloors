import { initAddresses } from './inits/addresses'
import { initFacilities } from './inits/facilities'
import { initFloors } from './inits/floors'
import { initHeader } from './inits/header'
import { initLocs } from './inits/locs'
import { initParams } from './inits/params'
import { initShops } from './inits/shops'

export function init() {
  initParams()
  initHeader()
  initLocs()
  initAddresses()
  initShops()
  initFacilities()
  initFloors()
}
