import { Point } from '../addresses'

export interface LocLine {
  text: string
  fontSize: number
  dy: number
}

export interface Loc {
  text: string
  fontSize: number
  lines: LocLine[]
}

export type Locs = Record<string, Loc>

export interface LocPoint {
  loc: Loc
  p: Point
}
