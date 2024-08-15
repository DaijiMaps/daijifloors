import { ShopInfos } from '../types/shop'

export interface ShopsOps {
  shopInfos: ShopInfos
}

export const shopsOps: ShopsOps = {
  shopInfos: {},
}

export const installShopsOps = (ops: ShopsOps) => {
  shopsOps.shopInfos = ops.shopInfos
}
