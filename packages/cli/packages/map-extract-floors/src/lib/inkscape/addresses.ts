import type { Layer } from './layers'
import * as Doc from '@effect/printer/Doc'
import * as fs from 'fs'

const renderAddressesTs = (layers: Layer[]) => {
  const names = layers.map((l) => l.name)
  const doc = Doc.vsep([
    Doc.text(`import { FloorName } from '../floors/names'`),
    Doc.vsep(
      names.map((n) =>
        Doc.text(`import addresses${n}Json from './addresses_${n}.json'`)
      )
    ),
    Doc.text(``),
    Doc.text(`export type Address =`),
    Doc.vsep(names.map((x) => Doc.text(`  | keyof typeof addresses${x}Json`))),
    Doc.text(``),
    Doc.text(`interface Point {`),
    Doc.text(`  x: number`),
    Doc.text(`  y: number`),
    Doc.text(`  w: number`),
    Doc.text(`}`),
    Doc.text(``),
    Doc.text(`type Addresses = Partial<Record<Address, Point>>`),
    Doc.text(``),
    Doc.text(`export const floorAddresses: Record<FloorName, Addresses> = {`),
    Doc.vsep(names.map((x) => Doc.text(`  '${x}': addresses${x}Json,`))),
    Doc.text(`}`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleAddresses = (layers: Layer[], dir: string) => {
  const text = renderAddressesTs(layers)
  try {
    fs.mkdirSync(`${dir}/addresses`)
  } catch (e) {
    console.log(e)
  }
  fs.writeFileSync(`${dir}/addresses/addresses.ts`, text, 'utf8')
}
