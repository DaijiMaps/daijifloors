import type { Addresses, ResolvedAddresses } from '../addresses'
import type { FloorName } from '../types/floor'

export interface AddressesOps {
  floorAddresses: Record<FloorName, Addresses>
  resolvedAddresses: ResolvedAddresses
}

export const addressesOps: AddressesOps = {
  floorAddresses: { '1F': {} },
  resolvedAddresses: {},
}

export const installAddressesOps = (
  ops: Omit<AddressesOps, 'floorAddressBufs'>
) => {
  addressesOps.floorAddresses = ops.floorAddresses
  addressesOps.resolvedAddresses = ops.resolvedAddresses
  initCb.ref(ops)
}

export const initCb: { ref: (ops: AddressesOps) => void } = {
  ref: () => {},
}
