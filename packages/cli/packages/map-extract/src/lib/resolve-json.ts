import * as S from '@effect/schema/Schema'

export interface Point {
  x: number
  y: number
}

export type Addresses = Record<
  // address string (e.g. "A4F-Shops-1-1")
  string,
  // coord
  Point
>

export type Coords = Record<
  // shop name
  string,
  // coord
  readonly Point[]
>

export type ResolvedNames = Record<
  // shop name
  string,
  // address string (e.g. "A4F-Shops-1-1")
  readonly string[]
>

// ----

export const point_schema: S.Schema<Point, Point> = S.Struct({
  x: S.Number,
  y: S.Number,
})

export const address_schema: S.Schema<Addresses, Addresses> = S.Record({
  key: S.String,
  value: point_schema,
})

export const coords_schema: S.Schema<Coords, Coords> = S.Record({
  key: S.String,
  value: S.Array(point_schema),
})

export const resolved_names_schema: S.Schema<ResolvedNames, ResolvedNames> =
  S.Record({ key: S.String, value: S.Array(S.String) })

// ----

export const addresses_json_decoder = S.decode(S.parseJson(address_schema))
export const addresses_json_encoder = S.encodeSync(S.parseJson(address_schema))

export const coords_json_decoder = S.decode(S.parseJson(coords_schema))
export const coords_json_encoder = S.encodeSync(S.parseJson(coords_schema))

export const resolved_names_json_decoder = S.decode(
  S.parseJson(resolved_names_schema)
)
export const resolved_names_json_encoder = S.encodeSync(
  S.parseJson(resolved_names_schema)
)
