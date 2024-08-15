import { CSSProperties } from 'react'

export interface FloorConfig {
  categories?: string[]
  shopNames?: string[]
  backgroundColor?: string
}

export interface FloorInfoPrevNext {
  idx?: number
  name?: FloorName
}

export interface FloorInfo extends FloorConfig {
  name: FloorName
  prev?: FloorInfoPrevNext
  next?: FloorInfoPrevNext
}

export interface FloorContext extends FloorInfo {
  idx: number
  busy: boolean
}

export type SVGRenderer = React.FunctionComponent<React.SVGProps<SVGSVGElement>>

export interface Floor extends FloorConfig {
  style: CSSProperties
  onTransitionEnd?: () => void
}

export interface FloorsConfigJson {
  idx: number
  names: FloorNames
  readonly floors: {
    [key in string]: FloorConfig
  }
}

// XXX readonly
export type NonEmptyReadonlyArray<T> = [T, ...Array<T>]

export type FloorName = string
export type FloorNames = NonEmptyReadonlyArray<FloorName>

export type FloorNameMap<T> = {
  [key in FloorName]: T
}

export interface FloorsConfig {
  idx: number
  names: FloorNames
  floors: FloorNameMap<FloorConfig>
  viewBox: string
  assets: SVGRenderer
  markers: SVGRenderer
  renderers: FloorNameMap<SVGRenderer>
}
