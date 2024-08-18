import type { Layer } from './layers'
import * as Doc from '@effect/printer/Doc'
import * as fs from 'fs'

const renderRenderersTs = (layers: Layer[]) => {
  const names = layers.map((l) => l.name)
  const doc = Doc.vsep([
    Doc.vsep(
      names.map((n) => Doc.text(`import { Floor${n} } from './floor_${n}'`))
    ),
    Doc.text(``),
    Doc.text(`export const renderers = {`),
    Doc.vsep(names.map((x) => Doc.text(`  '${x}': Floor${x},`))),
    Doc.text(`}`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleRenderers = (layers: Layer[], dir: string) => {
  const text = renderRenderersTs(layers)
  try {
    fs.mkdirSync(`${dir}/floors`)
  } catch (e) {
    console.log(e)
  }
  fs.writeFileSync(`${dir}/floors/renderers.ts`, text, 'utf8')
}
