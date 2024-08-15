import { floorAddresses } from '../../data/addresses/addresses'
import resolvedAddresses from '../../data/addresses/resolved_addresses.json'
import { installAddressesOps } from '@daijimaps/daijifloors-app-lib'

export function initAddresses() {
  installAddressesOps({
    resolvedAddresses,
    floorAddresses,
  })
}
