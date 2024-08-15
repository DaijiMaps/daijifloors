import { addressToPointIdx, searchAddress } from './addresses'
import { findFacilityByAddress } from './facilities'
import { getFloorInfo, getFloorNames } from './floors'
import * as global from './global/global'
import * as update from './lib/update'
import * as modelCmd from './lib/update-model-cmd'
import * as process from './lib/update-process'
import { getXYS } from './lib/xys'
import * as msgs from './msgs'
import { paramsOps } from './ops/params'
import { findShopByAddress, findShopByName } from './shops'
import * as transforms from './transforms'
import * as app from './types/app'
import { FloorContext } from './types/floor'
import { Duration, Effect, Match, pipe } from 'effect'

const processMsg: process.ProcessMsg<msgs.Msg, app.AppContext> = (
  msg: msgs.Msg
) =>
  pipe(
    Match.type<msgs.Msg>(),
    Match.when({ _tag: 'baseMsg', _id: 'Init' }, doInit),
    Match.when({ _tag: 'baseMsg', _id: 'Resize' }, doResize),
    Match.when({ _tag: 'baseMsg', _id: 'ModeSelect' }, doModeSelect),
    Match.when({ _tag: 'baseMsg', _id: 'AddressSelect' }, doAddressSelect),
    Match.when({ _tag: 'baseMsg', _id: 'UiLock' }, doUiLock),
    Match.when({ _tag: 'baseMsg', _id: 'UiBusy' }, doUiBusy),
    Match.when({ _tag: 'baseMsg', _id: 'FloorSelect' }, doFloorSelect),
    Match.when({ _tag: 'baseMsg', _id: 'FloorSwapStop' }, doFloorSwapStop),
    Match.when({ _tag: 'baseMsg', _id: 'MapInit' }, doMapInit),
    Match.when({ _tag: 'baseMsg', _id: 'MapClick' }, doMapClick),
    Match.orElse(() => modelCmd.empty<app.AppContext>)
  )(msg)

const doInit: process.ProcessMsg<msgs.Init, app.AppContext> =
  ({ params }) =>
  (model) => {
    const bg = model.floor.backgroundColor
    const bgCmd = modelCmd.syncCmd(() =>
      bg ? global.setRootBackgroundColor(bg) : modelCmd.emptyCmd()
    )
    const titleCmd = modelCmd.syncCmd(() => {
      document.title = paramsOps.TITLE
    })
    const busyCmd = global.postMsg(msgs.UiBusy('expired'))
    const floorSelectCmd =
      params.floorIdx === undefined || params.shopName === undefined
        ? modelCmd.emptyCmd()
        : pipe(
            global.postMsg(msgs.FloorSelect(params.floorIdx, params.shopName)),
            Effect.delay(Duration.millis(100))
          )
    return modelCmd.both(
      (prevModel: app.AppContext) =>
        pipe(prevModel, app.updateXYS(getXYS()), Effect.succeed),
      Effect.all([bgCmd, titleCmd, busyCmd, floorSelectCmd])
    )
  }

const doResize: process.ProcessMsg<msgs.Resize, app.AppContext> =
  () => (model) => {
    return model.mode._ !== 'default'
      ? modelCmd.empty()
      : modelCmd.updateModel((prevModel) =>
          pipe(prevModel, app.updateXYS(getXYS()), Effect.succeed)
        )
  }

const doModeSelect: process.ProcessMsg<msgs.ModeSelect, app.AppContext> =
  (msg) => () => {
    const cmd = global.globalPostMsg(
      msg.mode._ !== 'default' ? 'lock' : 'unlock'
    )
    return modelCmd.both(
      (prevModel: app.AppContext) =>
        Effect.succeed({
          ...prevModel,
          mode: msg.mode,
        }),
      cmd
    )
  }

const doAddressSelect: process.ProcessMsg<msgs.AddressSelect, app.AppContext> =
  (msg) => (model) => {
    const ppidx = addressToPointIdx(msg.address)
    if (ppidx === undefined || model.svgMatrix === null) {
      return modelCmd.empty()
    }
    const { pp, idx } = ppidx
    const switching = model.floor.idx !== idx
    const tx = transforms.toMatrix(model.transforms)
    const p = new DOMPointReadOnly(pp.x, pp.y)
      .matrixTransform(model.svgMatrix)
      .matrixTransform(tx)
    return modelCmd.command(
      Effect.all([
        global.postMsg(msgs.FloorSelect(idx)),
        pipe(
          global.postMsg(msgs.MapClick(p)),
          !switching ? (e) => e : Effect.delay(Duration.millis(500))
        ),
      ])
    )
  }

const doUiLock: process.ProcessMsg<msgs.UiLock, app.AppContext> =
  (msg) => () => {
    return modelCmd.updateModel((prevModel) =>
      pipe(
        prevModel,
        msg.lock === 'started' ? (m) => m : app.updateXYS(getXYS()),
        Effect.succeed
      )
    )
  }

const doUiBusy: process.ProcessMsg<msgs.UiBusy, app.AppContext> =
  (msg) => () => {
    return modelCmd.updateModel((prevModel) =>
      Effect.succeed({
        ...prevModel,
        uiBusy: msg.busy === 'started' ? true : false,
      })
    )
  }

// XXX shop with multiple addresses
const doFloorSelect: process.ProcessMsg<msgs.FloorSelect, app.AppContext> =
  (msg: msgs.FloorSelect) => (model: app.AppContext) => {
    const svgMatrix = model.svgMatrix
    if (svgMatrix === null) {
      // XXX svg not inited???
      return modelCmd.empty()
    }

    const idx = msg.idx
    const info = getFloorInfo(idx)
    const switching = model.floor.idx !== idx
    const floor: FloorContext = !switching
      ? model.floor
      : { idx, ...info, busy: true }

    const modeSelectCmd =
      model.mode._ === 'default'
        ? modelCmd.emptyCmd()
        : global.postMsg(msgs.ModeSelect({ _: 'default' }))

    const bgCmd = modelCmd.syncCmd(() =>
      global.setRootBackgroundColor(info.backgroundColor)
    )

    const makeShopSelectCmd = () => {
      if (msg.shopName === undefined) {
        return modelCmd.emptyCmd()
      }
      const floorName = getFloorNames()[msg.idx]
      // XXX shop with multiple addresses
      const res = findShopByName(floorName, msg.shopName)
      if (res === null) {
        return modelCmd.emptyCmd()
      }
      const tx = transforms.toMatrix(model.transforms)
      const p = res.p.matrixTransform(svgMatrix).matrixTransform(tx)
      return pipe(
        global.postMsg(msgs.MapClick(p)),
        !switching ? (e) => e : Effect.delay(Duration.millis(500))
      )
    }
    const shopSelectCmd = makeShopSelectCmd()

    return modelCmd.both(
      (prevModel) =>
        pipe({ ...prevModel, floor }, app.updateXYS(getXYS()), Effect.succeed),
      Effect.all([modeSelectCmd, bgCmd, shopSelectCmd])
    )
  }

const doFloorSwapStop: process.ProcessMsg<msgs.FloorSwapStop, app.AppContext> =
  () => () => {
    return modelCmd.updateModel((prevModel) =>
      Effect.succeed({
        ...prevModel,
        floor: {
          ...prevModel.floor,
          busy: false,
        },
      })
    )
  }

const doMapInit: process.ProcessMsg<msgs.MapInit, app.AppContext> =
  (msg) => (model) => {
    if (model.svgMatrix !== null) {
      return modelCmd.empty()
    }
    const svgMatrix = msg.m
    return modelCmd.updateModel((prevModel) =>
      Effect.succeed({
        ...prevModel,
        svgMatrix,
      })
    )
  }

const doMapClick: process.ProcessMsg<msgs.MapClick, app.AppContext> =
  (msg) => (model) => {
    const modeDefault: app.AppMode = { _: 'default' }
    const svgMatrix = model.svgMatrix
    if (svgMatrix === null || msg.p === undefined) {
      return model.mode._ === 'default'
        ? modelCmd.empty()
        : modelCmd.command(global.postMsg(msgs.ModeSelect(modeDefault)))
    }
    const tx = transforms.toMatrix(model.transforms)
    const p = msg.p
      .matrixTransform(tx.inverse())
      .matrixTransform(svgMatrix.inverse())

    const res = searchAddress(model.floor.name, p)
    const shop = res == null ? null : findShopByAddress(res)
    if (shop !== null) {
      const svgCoord = shop.p
      const pageCoord = shop.p.matrixTransform(svgMatrix).matrixTransform(tx)
      const modeShopDetail: app.AppMode = {
        _: 'shop-detail',
        ctx: {
          svgCoord,
          pageCoord,
          scale: svgMatrix.a,
          info: shop.info,
        },
      }
      const cmdModeDefault =
        model.mode._ !== 'shop-detail'
          ? modelCmd.emptyCmd()
          : global.postMsg(msgs.ModeSelect(modeDefault))
      const cmdModeShopDetail =
        model.mode._ === 'shop-detail' &&
        // selecting a shop which is already selected
        // => just go back to default
        model.mode.ctx.info.name === shop.info.name
          ? modelCmd.emptyCmd()
          : pipe(
              global.postMsg(msgs.ModeSelect(modeShopDetail)),
              model.mode._ === 'default'
                ? (e) => e
                : Effect.delay(Duration.millis(100))
            )
      return modelCmd.command(Effect.all([cmdModeDefault, cmdModeShopDetail]))
    }
    const facility = res === null ? null : findFacilityByAddress(res)
    if (facility !== null) {
      const svgCoord = facility.p
      const pageCoord = facility.p
        .matrixTransform(svgMatrix)
        .matrixTransform(tx)
      const modeFacilityDetail: app.AppMode = {
        _: 'facility-detail',
        ctx: {
          svgCoord,
          pageCoord,
          scale: svgMatrix.a,
          info: facility.info,
        },
      }
      const cmdModeDefault =
        model.mode._ !== 'facility-detail'
          ? modelCmd.emptyCmd()
          : global.postMsg(msgs.ModeSelect(modeDefault))
      const cmdModeFacilityDetail =
        model.mode._ === 'facility-detail' &&
        model.mode.ctx.info.kind === facility.info.kind &&
        model.mode.ctx.info.idx === facility.info.idx
          ? modelCmd.emptyCmd()
          : pipe(
              global.postMsg(msgs.ModeSelect(modeFacilityDetail)),
              model.mode._ === 'default'
                ? (e) => e
                : Effect.delay(Duration.millis(100))
            )
      return modelCmd.command(
        Effect.all([cmdModeDefault, cmdModeFacilityDetail])
      )
    }
    return model.mode._ === 'default'
      ? modelCmd.empty()
      : modelCmd.command(global.postMsg(msgs.ModeSelect(modeDefault)))
  }

const UPDATE_DEBUG = false

export const updateConfig: update.Config<msgs.Msg, app.AppContext> = {
  msgCount: 0,
  msgQueue: global.appMsgQueue,
  postMsgSync: global.postMsgSync,
  processMsg: (msg) => {
    if (UPDATE_DEBUG) {
      console.log(msg)
    }
    return processMsg(msg)
  },
}
