import {
  TITLE,
  LOCK_TIMEOUT,
  BUSY_TIMEOUT,
  APPEARING_TRANSITION,
  EXPANDING_TRANSITION,
  FLOOR_MENU_SHOP_NAMES_NCOLS,
  SYMBOL_SIZE,
} from '../../data/params'
import { installParamsOps } from '@daijimaps/daijifloors-app-lib'

export function initParams() {
  installParamsOps({
    TITLE,
    LOCK_TIMEOUT,
    BUSY_TIMEOUT,
    APPEARING_TRANSITION,
    EXPANDING_TRANSITION,
    FLOOR_MENU_SHOP_NAMES_NCOLS,
    SYMBOL_SIZE,
  })
}
