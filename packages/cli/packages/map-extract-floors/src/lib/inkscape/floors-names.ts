import type { Layer } from './layers'
import * as Doc from '@effect/printer/Doc'
import * as fs from 'fs'

const renderNamesTs = (layers: Layer[]) => {
  const names = layers.map((l) => l.name)
  const doc = Doc.vsep([
    Doc.text(`export type FloorName = string`),
    Doc.text(``),
    Doc.text(`type NonEmptyReadonlyArray<T> = [T, ...Array<T>]`),
    Doc.text(``),
    Doc.text(`export type FloorNames = NonEmptyReadonlyArray<FloorName>`),
    Doc.text(``),
    Doc.text(`export const FloorNames: FloorNames = [`),
    Doc.vsep(names.map((x) => Doc.text(`  '${x}',`))),
    Doc.text(`]`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleFloorNames = (layers: Layer[], dir: string) => {
  const text = renderNamesTs(layers)
  try {
    fs.mkdirSync(`${dir}/floors`)
  } catch (e) {
    console.log(e)
  }
  fs.writeFileSync(`${dir}/floors/names.ts`, text, 'utf8')
}
