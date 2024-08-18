import type { Layer } from './layers'
import * as Doc from '@effect/printer/Doc'
import * as fs from 'fs'

const renderAddressesTs = (layers: Layer[]) => {
  const names = layers.map((l) => l.name)
  const doc = Doc.vsep([
    Doc.vsep(
      names.map((n) =>
        Doc.text(`import addresses${n}Json from './addresses_${n}.json'`)
      )
    ),
    Doc.text(`import { FloorName } from './names'`),
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
  fs.writeFileSync(`${dir}/addresses.ts`, text, 'utf8')
}
