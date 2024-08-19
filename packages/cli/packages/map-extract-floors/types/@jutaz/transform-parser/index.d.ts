export { parse }
declare function parse(a: string): TransformList
type TransformList = TransformFunction[]
type TransformFunction =
  | Matrix
  | Translate
  | Scale
  | Rotate
  | Skew
  | Perspective
interface Matrix {
  type: 'matrix'
  matrix: Number_[]
}
interface Translate {
  type: 'translate'
  x: LengthPercentage | null
  y: LengthPercentage | null
  z: LengthPercentage | null
}
interface Scale {
  type: 'scale'
  x: Number_ | null
  y: Number_ | null
  z: Number_ | null
}
interface Rotate {
  type: 'rotate'
  x: Angle | null
  y: Angle | null
  z: Angle | null
}
interface Skew {
  type: 'skew'
  x: Angle | null
  y: Angle | null
}
interface Perspective {
  type: 'perspective'
  value: Length
}
interface Angle {
  value: Number_
  unit: AngleUnit | null
}
type AngleUnit = 'deg' | 'grad' | 'rad' | 'turn'
type LengthPercentage = Length | Percentage
interface Length {
  value: Number_
  unit:
    | AbsoluteLengthUnit
    | ViewportPercentageLengthUnit
    | FontRelativeLengthUnit
    | null
}
type AbsoluteLengthUnit = 'px' | 'cm' | 'mm' | 'Q' | 'in' | 'pc' | 'pt'
type ViewportPercentageLengthUnit = 'vh' | 'vw' | 'vi' | 'vb' | 'vmin' | 'vmax'
type FontRelativeLengthUnit =
  | 'cap'
  | 'ch'
  | 'em'
  | 'ex'
  | 'ic'
  | 'lh'
  | 'rem'
  | 'rlh'
type Number_ = Decimal
type Decimal = number
interface Percentage {
  value: Number_
  unit: '%'
}
