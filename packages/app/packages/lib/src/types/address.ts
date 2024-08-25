export type Address = string

export interface Point {
  x: number
  y: number
  w: number
}

export type AddressPoint = [Address, Point]

export type Addresses = Partial<Record<Address, Point>>

// address -> shop name
export type ResolvedAddresses = Record<string, string>
