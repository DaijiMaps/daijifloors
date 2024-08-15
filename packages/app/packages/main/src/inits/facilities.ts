import facilitiesJson from '../../data/facilities.json'
import { installFacilitiesOps } from '@daijimaps/daijifloors-app-lib'

export function initFacilities() {
  installFacilitiesOps({
    facilities: facilitiesJson,
  })
}
