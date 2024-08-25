import { Address, Point } from './address'
import { DetailContext } from './detail'
import { FloorNames } from './floor'

export interface FacilityDetailContext extends DetailContext {
  // XXX
  // XXX
  // XXX
  info: FacilityInfo
  // XXX
  // XXX
  // XXX
}

export interface Facility {
  kind: string
  idx: number
  p: Point
}

export type FacilityLinks = FacilityLinksUni | FacilityLinksBi

// uni-directional (Escalator)
interface FacilityLinksUni {
  tag: 'uni'
  destinations: FloorNames
  name?: string
}

// bi-directional (Elevator, Stairs)
interface FacilityLinksBi {
  tag: 'bi'
  addresses: Address[]
  name?: string
}

export interface FacilityInfo {
  kind: string
  idx: number
  links?: FacilityLinks
}

export interface FacilitiesJson {
  uniLinks?: {
    [key in string]: string[]
  }
  biLinks?: {
    [key in string]: string[]
  }
}

// XXX define info per kind?  (e.g. ToiletsInfo)
