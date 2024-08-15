export type EachKey<T> = { [K in keyof T]: Pick<T, K> }

export type One<T> = Required<EachKey<Required<T>>[keyof EachKey<T>]>

export type AtLeastOne<T> = Partial<T> & One<T>

//

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]
