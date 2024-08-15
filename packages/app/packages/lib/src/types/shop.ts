import { DetailContext } from './detail'
import { Loc } from './loc'

export interface ShopDetailContext extends DetailContext {
  info: ShopInfo
}

export interface ShopInfo {
  name: string
  loc: Loc
  locWide: Loc
  categories?: string[]
  descrs?: string[]
  address?: string
  tel?: string
  web?: string
}

export type ShopInfos = Record<string, Partial<ShopInfo>>
