import { Addresses, ResolvedAddresses } from '../types/address'
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
  for (const cb of installCbs) {
    cb(ops)
  }
}

type InstallCb = (ops: AddressesOps) => void

export const installCbs: InstallCb[] = []
