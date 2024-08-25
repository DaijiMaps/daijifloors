import { SearchAddressResult, searchAddress } from './addresses'
import { addressesOps } from './ops/addresses'
import { locsOps } from './ops/locs'
import { shopsOps } from './ops/shops'
import { Address } from './types/address'
import { FloorName } from './types/floor'
import { LocPoint } from './types/loc'
import { ShopInfo } from './types/shop'

export interface FindShopResult {
  info: ShopInfo
  p: DOMPointReadOnly
  w: number
}

export function findShop(
  floorName: FloorName,
  p: DOMPointReadOnly
): null | FindShopResult {
  const res = searchAddress(floorName, p)
  if (res === null) {
    return null
  }
  return findShopByAddress(res)
}

export function findShopByAddress(
  res: SearchAddressResult
): null | FindShopResult {
  const name = getShopName(res.address)
  if (name === null) {
    return null
  }
  const info = getShopInfo(name)
  if (info === null) {
    return null
  }
  return {
    info,
    p: new DOMPointReadOnly(res.pp.x, res.pp.y),
    w: res.pp.w,
  }
}

function getShopName(address: Address): string | null {
  return addressesOps.resolvedAddresses[address] ?? null
}

function getShopInfo(name: string): ShopInfo | null {
  const info = shopsOps.shopInfos[name]
  const loc = locsOps.locs[name]
  const locWide = locsOps.locsWide[name]
  let res: null | ShopInfo = null
  if (name !== undefined && loc !== undefined) {
    res = {
      ...info,
      name,
      loc,
      locWide,
    }
  }
  return res
}

//
// find point by shop name
//
// XXX shop with multiple addresses
export function findShopByName(
  floorName: FloorName,
  shopName: string
): FindShopResult | null {
  const info = getShopInfo(shopName)
  if (info === null) {
    return null
  }
  const addresses = getFloorShopAddresses(floorName, shopName)
  if (addresses.length === 0) {
    return null
  }
  // XXX shop with multiple addresses
  const address = addresses[0]
  const fa = addressesOps.floorAddresses[floorName]
  if (fa === undefined) {
    return null
  }
  const p = fa[address]
  if (p === undefined) {
    return null
  }
  return {
    info,
    p: new DOMPointReadOnly(p.x, p.y),
    w: p.w,
  }
}

//
// ShopNames
//

export interface AddressShopName {
  address: Address
  shopName: string
}

export function getFloorShops(floorName: FloorName): AddressShopName[] {
  return Object.entries(addressesOps.resolvedAddresses)
    .filter(([a]) => a.match(`^A${floorName}-`))
    .map(([address, shopName]) => ({
      address,
      shopName,
    })) as AddressShopName[]
}

export function getFloorShopNames(floorName: FloorName): string[] {
  const o = Object.fromEntries(
    Object.entries(addressesOps.resolvedAddresses)
      .filter(([a]) => a.match(`^A${floorName}-`))
      .map(([address, shopName]) => [shopName, address])
  )
  return Object.keys(o)
}

export function getFloorShopAddresses(
  floorName: FloorName,
  shopName2: string
): Address[] {
  return getFloorShops(floorName)
    .filter(({ shopName }) => shopName === shopName2)
    .map(({ address }) => address) as Address[]
}

export function getFloorShopLocPoints(floorName: FloorName): LocPoint[] {
  return getFloorShops(floorName).flatMap((asn) => {
    const loc = locsOps.locs[asn.shopName]
    const p = addressesOps.floorAddresses[floorName][asn.address]
    return loc === undefined || p === undefined ? [] : [{ loc, p }]
  })
}
