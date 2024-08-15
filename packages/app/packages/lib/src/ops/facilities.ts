import { FacilitiesJson } from '../types/facility'

export interface FacilitiesOps {
  facilities: FacilitiesJson
}

export const facilitiesOps: FacilitiesOps = {
  facilities: {},
}

export const installFacilitiesOps = (ops: FacilitiesOps) => {
  facilitiesOps.facilities = ops.facilities
}
