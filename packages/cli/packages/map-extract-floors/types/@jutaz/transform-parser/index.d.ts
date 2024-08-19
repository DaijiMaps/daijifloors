export { parse }
declare function parse(a: string): TransformList
type TransformList = Transform[]
type Transform = Matrix | Translate | Scale | Rotate | Skew | Perspective
interface Matrix {
  type: 'matrix'
  matrix: Number_[]
}
interface Translate {
  type: 'translate'
  x: Number_
  y: Number_
  z: Number_
}
interface Scale {
  type: 'scale'
  x: Number_
  y: Number_
  z: Number_
}
interface Rotate {
  type: 'rotate'
  x: Number_
  y: Number_
  z: Number_
}
interface Skew {
  type: 'skew'
  x: Number_
  y: Number_
}
interface Perspective {
  type: 'perspective'
  value: Number_
}
interface Angle {
  value: Number_
  unit: AngleUnit
}
type AngleUnit = 'deg' | 'grad' | 'rad' | 'turn'
type LengthPercentage = Length | Percentage
interface Length {
  value: Number_
  unit:
    | AbsoluteLengthUnit
    | ViewportPercentageLengthUnit
    | FontRelativeLengthUnit
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
type Number_ = number
type Percentage = '%'
