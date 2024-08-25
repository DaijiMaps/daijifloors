import { SearchAddressResult, addressEntries, searchAddress } from './addresses'
import { addressesOps } from './ops/addresses'
import { facilitiesOps } from './ops/facilities'
import { Address } from './types/address'
import { Facility, FacilityInfo, FacilityLinks } from './types/facility'
import { FloorName, FloorNames } from './types/floor'

export interface FindFacilityResult {
  info: FacilityInfo
  p: DOMPointReadOnly
  w: number
}

export function findFacility(
  floorName: FloorName,
  p: DOMPointReadOnly
): null | FindFacilityResult {
  const res = searchAddress(floorName, p)
  if (res === null) {
    return null
  }
  return findFacilityByAddress(res)
}

function getFacilityLinks(a: Address): FacilityLinks | undefined {
  if (
    facilitiesOps.facilities.uniLinks !== undefined &&
    a in facilitiesOps.facilities.uniLinks
  ) {
    // XXX `as`
    const destinations = facilitiesOps.facilities.uniLinks[a] as FloorNames
    return { tag: 'uni', destinations }
  }
  if (facilitiesOps.facilities.biLinks !== undefined) {
    const xs = Object.entries(facilitiesOps.facilities.biLinks).flatMap(
      ([name, addresses]) =>
        addresses.filter((xa) => xa === a).length === 0
          ? []
          : [{ name, addresses }]
    )
    if (xs.length === 1) {
      // XXX `as`
      const addresses = xs[0].addresses as Address[]
      const name = xs[0].name
      return { tag: 'bi', addresses, name }
    }
  }
  return undefined
}

export function findFacilityByAddress(
  res: SearchAddressResult
): null | FindFacilityResult {
  if (res.address.match(/^.*-Facilities-/) === null) {
    return null
  }
  const { kind, idx } = addressToFacilityKindIndex(res.address)
  const links = getFacilityLinks(res.address)
  return {
    info: { kind, idx, links },
    p: new DOMPointReadOnly(res.pp.x, res.pp.y),
    w: res.pp.w,
  }
}

// "A1F-Facilities-Elevator-1" => {kind:"Elevator", idx:1}
export function addressToFacilityKindIndex(a: Address): {
  kind: string
  idx: number
} {
  const [kind, idx] = a.replace(/^.*-Facilities-/, '').split(/-/)
  return { kind, idx: Number(idx) }
}

export function getFloorFacilities(floorName: FloorName): Facility[] {
  const xs = addressesOps.floorAddresses[floorName]
  return xs === undefined
    ? []
    : addressEntries(xs)
        .filter(([a]) => a.match(/-Facilities-/))
        .map(([a, p]) => {
          const { kind, idx } = addressToFacilityKindIndex(a)
          return {
            kind,
            idx,
            p,
          }
        })
}
