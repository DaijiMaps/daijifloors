import * as P from '@effect/schema/Pretty'
import * as S from '@effect/schema/Schema'

export interface LocLine {
  text: string
  fontSize: number
  dy: number
}

export const locline_schema = S.Struct({
  text: S.String,
  fontSize: S.Number,
  dy: S.Number,
})

export interface LocWords {
  text: string
  fontSize: number
  lines: LocLine[]
}

export const locwords_schema = S.Struct({
  text: S.String,
  fontSize: S.Number,
  lines: S.Array(locline_schema),
})

export type LocsJson = Record<string, LocWords>

export const locsjson_schema = S.Record({
  key: S.String,
  value: locwords_schema,
})

export const names_json_parser = S.parseJson(S.Array(S.String))

export const locwords_json_encoder = P.make(locsjson_schema)
