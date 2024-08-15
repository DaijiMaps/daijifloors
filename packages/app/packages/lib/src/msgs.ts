import { Address } from './addresses'
import { AppMode } from './types/app'
import { TimerChange } from './types/timer'
import { Params } from './types/url-params'

// Msg

export type Msg =
  | Init
  | Resize
  | ModeSelect
  | AddressSelect
  | UiLock
  | UiBusy
  | FloorSelect
  | FloorSwapStop
  | MapInit
  | MapClick

export interface Init {
  readonly _tag: 'baseMsg'
  readonly _id: 'Init'
  readonly params: Params
}

export const Init = (params: Params): Msg => ({
  _tag: 'baseMsg',
  _id: 'Init',
  params,
})

export interface Resize {
  readonly _tag: 'baseMsg'
  readonly _id: 'Resize'
}

export const Resize = (): Msg => ({
  _tag: 'baseMsg',
  _id: 'Resize',
})

export interface ModeSelect {
  readonly _tag: 'baseMsg'
  readonly _id: 'ModeSelect'
  readonly mode: AppMode
}

export const ModeSelect = (mode: AppMode): Msg => ({
  _tag: 'baseMsg',
  _id: 'ModeSelect',
  mode,
})

export interface AddressSelect {
  readonly _tag: 'baseMsg'
  readonly _id: 'AddressSelect'
  readonly address: Address
}

export const AddressSelect = (address: Address): Msg => ({
  _tag: 'baseMsg',
  _id: 'AddressSelect',
  address,
})

export interface UiLock {
  readonly _tag: 'baseMsg'
  readonly _id: 'UiLock'
  readonly lock: TimerChange
}

export const UiLock = (lock: TimerChange): Msg => ({
  _tag: 'baseMsg',
  _id: 'UiLock',
  lock,
})

export interface UiBusy {
  readonly _tag: 'baseMsg'
  readonly _id: 'UiBusy'
  readonly busy: TimerChange
}

export const UiBusy = (busy: TimerChange): Msg => ({
  _tag: 'baseMsg',
  _id: 'UiBusy',
  busy,
})

export interface FloorSelect {
  readonly _tag: 'baseMsg'
  readonly _id: 'FloorSelect'
  readonly idx: number
  readonly shopName?: string
}

export const FloorSelect = (idx: number, shopName?: string): Msg => ({
  _tag: 'baseMsg',
  _id: 'FloorSelect',
  idx,
  shopName,
})

export interface FloorSwapStop {
  readonly _tag: 'baseMsg'
  readonly _id: 'FloorSwapStop'
}

export const FloorSwapStop = (): Msg => ({
  _tag: 'baseMsg',
  _id: 'FloorSwapStop',
})

export interface MapInit {
  readonly _tag: 'baseMsg'
  readonly _id: 'MapInit'
  readonly m: DOMMatrixReadOnly
}

export const MapInit = (m: DOMMatrixReadOnly): Msg => ({
  _tag: 'baseMsg',
  _id: 'MapInit',
  m,
})

export interface MapClick {
  readonly _tag: 'baseMsg'
  readonly _id: 'MapClick'
  readonly p?: DOMPointReadOnly
}

export const MapClick = (p?: DOMPointReadOnly): Msg => ({
  _tag: 'baseMsg',
  _id: 'MapClick',
  p,
})
