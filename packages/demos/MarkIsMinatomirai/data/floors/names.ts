export type FloorName = string

type NonEmptyReadonlyArray<T> = [T, ...Array<T>]

export type FloorNames = NonEmptyReadonlyArray<FloorName>

export const FloorNames: FloorNames = [
  'B4',
  'B2',
  'B1',
  'GL',
  '1F',
  '2F',
  '3F',
  '4F',
  '5F',
]
