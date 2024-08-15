import { getFloorIdx, getFloorNameByIdx } from './floors'
import { addressesOps, AddressesOps, initCb } from './ops/addresses'
import { FloorName } from './types/floor'
import { pipe } from 'effect'
import * as RR from 'effect/Record'
import Flatbush from 'flatbush'

type Address = string

initCb.ref = (ops: AddressesOps) => {
  floorAddressBufs.ref = pipe(ops.floorAddresses, RR.map(makeAddrressBufs))
}

////

export type { Address }

export interface Point {
  x: number
  y: number
  w: number
}

export type AddressPoint = [Address, Point]

export type Addresses = Partial<Record<Address, Point>>

// XXX work-around `Partial vs Object.entries' problem
export const addressEntries = (a: Addresses): AddressPoint[] => {
  return Object.entries(a).filter((_a, p) => p !== undefined) as AddressPoint[]
}

export const addressToFloorName = (a: Address) =>
  a.replace(/^A([^-]+)-.*$/, '$1')

//
// AddressBufs (Flatbush + FlatbushIndexes)
//

// idx (string) => address
type FlatbushIndexes = Record<string, Address>

interface AddressBuf {
  fb: Flatbush
  idxs: FlatbushIndexes
}

type AddressBufs = Record<FloorName, AddressBuf>

const floorAddressBufs: { ref: AddressBufs } = {
  ref: {},
}

function makeAddrressBufs(ads: Addresses) {
  const l = Object.entries(ads).length
  if (l === 0) {
    // XXX empty fb/idxs
    const fb = new Flatbush(1)
    const idxs: FlatbushIndexes = {}
    const idx = fb.add(0, 0, 0, 0)
    idxs[`${idx}`] = 'A' as Address
    fb.finish()
    return {
      fb,
      idxs,
    }
  } else {
    const fb: Flatbush = new Flatbush(l)
    const idxs: FlatbushIndexes = {}
    for (const [a, p] of addressEntries(ads)) {
      const idx = fb.add(p.x, p.y, p.x, p.y)
      idxs[`${idx}`] = a
    }
    fb.finish()
    return {
      fb,
      idxs,
    }
  }
}

//
// search
//

export interface SearchAddressResult {
  address: Address
  pp: Point
}

export function searchAddress(
  floorName: FloorName,
  p: DOMPoint
): SearchAddressResult | null {
  const { fb, idxs }: AddressBuf = floorAddressBufs.ref[floorName]
  // XXX
  // XXX
  // XXX
  const ns = fb.neighbors(p.x, p.y, 1, 100)
  // XXX
  // XXX
  // XXX
  if (ns.length === 0) {
    return null
  }
  const n = ns[0]
  const address = idxs[`${n}`]
  const pp = addressesOps.floorAddresses[floorName][address]
  if (pp === undefined) {
    return null
  }
  return { address, pp }
}

export function addressToPointIdx(
  a: Address
): { pp: Point; idx: number } | undefined {
  const idx = pipe(a, addressToFloorName, getFloorIdx)
  return idx === -1
    ? undefined
    : pipe(
        idx,
        getFloorNameByIdx,
        (fn) => addressesOps.floorAddresses[fn][a],
        (pp) =>
          pp === undefined
            ? undefined
            : {
                idx,
                pp,
              }
      )
}

//
// ResolvedAddress
//

// address -> shop name
export type ResolvedAddresses = Record<string, string>
