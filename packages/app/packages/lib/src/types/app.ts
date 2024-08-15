import { getFloorInfo } from '../floors'
import * as update from '../lib/update'
import * as libxys from '../lib/xys'
import { floorsOps } from '../ops/floors'
import * as transforms from '../transforms'
import { FacilityDetailContext } from './facility'
import { FloorContext } from './floor'
import { ShopDetailContext } from './shop'
import { Params } from './url-params'
import { pipe } from 'effect'

export type AppMode =
  | { _: 'default' }
  | { _: 'floor-menu' }
  | { _: 'shop-detail'; ctx: ShopDetailContext }
  | { _: 'facility-detail'; ctx: FacilityDetailContext }

export interface AppContext extends update.BaseModel {
  params: Params
  mode: AppMode
  uiBusy: boolean
  xys: libxys.XYS
  transforms: transforms.Transforms
  svgMatrix: DOMMatrixReadOnly | null
  floor: FloorContext
}

export const defaultAppContext = (params: Params): AppContext => {
  const xs = pipe(
    transforms.empty,
    transforms.setCenter(libxys.center(libxys.initXYS)),
    params.r === undefined ? (x) => x : transforms.setRotation(params.r)
  )
  const idx = params.floorIdx !== undefined ? params.floorIdx : floorsOps.idx
  const floorInfo = getFloorInfo(idx)
  return {
    _tag: 'baseModel',
    params,
    mode: { _: 'default' },
    uiBusy: true,
    xys: libxys.initXYS,
    transforms: xs,
    svgMatrix: null,
    floor: {
      idx,
      busy: false,
      ...floorInfo,
    },
  }
}

export const updateXYS =
  (xys: libxys.XYS) =>
  (prevModel: AppContext): AppContext => {
    return {
      ...prevModel,
      xys,
      transforms: pipe(
        prevModel.transforms,
        transforms.setCenter(libxys.center(xys))
      ),
    }
  }
