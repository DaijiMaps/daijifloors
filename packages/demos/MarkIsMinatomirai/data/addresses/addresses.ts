import { FloorName } from '../floors/names'
import addresses1FJson from './addresses_1F.json'
import addresses2FJson from './addresses_2F.json'
import addresses3FJson from './addresses_3F.json'
import addresses4FJson from './addresses_4F.json'
import addresses5FJson from './addresses_5F.json'
import addressesB1Json from './addresses_B1.json'
import addressesB2Json from './addresses_B2.json'
import addressesB4Json from './addresses_B4.json'
import addressesGLJson from './addresses_GL.json'

export type Address =
  | keyof typeof addressesB4Json
  | keyof typeof addressesB2Json
  | keyof typeof addressesB1Json
  | keyof typeof addressesGLJson
  | keyof typeof addresses1FJson
  | keyof typeof addresses2FJson
  | keyof typeof addresses3FJson
  | keyof typeof addresses4FJson
  | keyof typeof addresses5FJson

interface Point {
  x: number
  y: number
  w: number
}

type Addresses = Partial<Record<Address, Point>>

export const floorAddresses: Record<FloorName, Addresses> = {
  B4: addressesB4Json,
  B2: addressesB2Json,
  B1: addressesB1Json,
  GL: addressesGLJson,
  '1F': addresses1FJson,
  '2F': addresses2FJson,
  '3F': addresses3FJson,
  '4F': addresses4FJson,
  '5F': addresses5FJson,
}
