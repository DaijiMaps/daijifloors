import shopsInfoJson from '../../data/shops.json'
import { installShopsOps } from '@daijimaps/daijifloors-app-lib'

export function initShops() {
  installShopsOps({
    shopInfos: shopsInfoJson,
  })
}
