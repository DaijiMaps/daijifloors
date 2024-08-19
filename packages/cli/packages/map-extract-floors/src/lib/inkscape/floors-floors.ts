import type { Layer } from './layers'
import { fixupElements } from './svg'
import * as Doc from '@effect/printer/Doc'
import { pipe } from 'effect'
import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root } from 'xast'
import { toXml } from 'xast-util-to-xml'

export const allLayerNames = new Array<string>()

export const saveAllFloorLayerNames = (ast: Root) => {
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element') && n.name === 'g') {
      const label = n.attributes['inkscape:label']
      if (
        n.attributes['inkscape:groupmode'] === 'layer' &&
        // exclude e.g. (Assets)
        label?.match(/[^(]/)
      ) {
        allLayerNames.push(label)
      }
    }
  })
}
const renderFloorTsx = (layer: Layer) => {
  const jsx = pipe(layer.element, fixupElements, (e) =>
    toXml(e, {
      allowDangerousXml: true,
      closeEmptyElements: true,
    })
  )
  const doc = Doc.vsep([
    Doc.text(`export const Floor${layer.name} = () => {`),
    Doc.text(`  return <>`),
    Doc.text(jsx),
    Doc.text(`  </>`),
    Doc.text(`}`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleFloors = (layers: Layer[], dir: string) => {
  for (const layer of layers) {
    const text = renderFloorTsx(layer)
    try {
      fs.mkdirSync(`${dir}/floors`)
    } catch (e) {
      console.log(e)
    }
    fs.writeFileSync(`${dir}/floors/floor_${layer.name}.tsx`, text, 'utf8')
  }
}
