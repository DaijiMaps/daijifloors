import { headerConfig } from '../../data/header'
import { installHeaderOps } from '@daijimaps/daijifloors-app-lib'

export function initHeader() {
  installHeaderOps(headerConfig)
}
