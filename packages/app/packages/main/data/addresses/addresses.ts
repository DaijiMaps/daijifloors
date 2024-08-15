import { FloorName } from '../floors/names'
import addresses1FJson from './addresses_1F.json'

export type Address =
  | keyof typeof addresses1FJson

interface Point {
  x: number
  y: number
  w: number
}

type Addresses = Partial<Record<Address, Point>>

export const floorAddresses: Record<FloorName, Addresses> = {
  '1F': addresses1FJson,
}
