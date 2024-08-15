export type FloorName = string

type NonEmptyReadonlyArray<T> = [T, ...Array<T>]

export type FloorNames = NonEmptyReadonlyArray<FloorName>

export const FloorNames: FloorNames = [
  '1F',
]
