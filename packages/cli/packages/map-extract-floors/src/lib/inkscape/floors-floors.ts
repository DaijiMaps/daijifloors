import type { Layer } from './layers'
import { fixupElements } from './svg'
import * as Doc from '@effect/printer/Doc'
import { pipe } from 'effect'
import * as fs from 'fs'
import { toXml } from 'xast-util-to-xml'

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
