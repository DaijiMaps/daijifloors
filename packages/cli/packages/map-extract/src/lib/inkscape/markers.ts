import { fixupElements } from './svg'
import * as Doc from '@effect/printer/Doc'
import { pipe } from 'effect'
import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root, Element } from 'xast'
import { toXml } from 'xast-util-to-xml'

const saveMarkers = (ast: Root) => {
  const markers: Element[] = []
  const colors = new Set<string>()
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element') && n.name === 'path') {
      const start = n.attributes['marker-start']
      const end = n.attributes['marker-end']
      const stroke = n.attributes['stroke']
      if (typeof stroke === 'string') {
        colors.add(stroke)
        const s = stroke.replace(/#/, '')
        if (typeof start === 'string') {
          n.attributes['marker-start'] = `url(\\#Triangle-${s})`
        }
        if (typeof end === 'string') {
          n.attributes['marker-end'] = `url(\\#Triangle-${s})`
        }
      }
    }
  })
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element') && n.name === 'marker') {
      markers.push(n)
      const id = n.attributes['id']
      for (const color of colors) {
        const s = color.replace(/#/, '')
        const m = structuredClone(n)
        m.attributes['id'] = `${id}-${s}`
        visitParents(m, (mm) => {
          if (is(mm, 'element') && mm.name === 'path') {
            mm.attributes['fill'] = `${color}`
          }
        })
        markers.push(m)
      }
    }
  })
  return markers
}

const renderMarkersTsx = (markers: Element[]) => {
  const jsx = pipe(
    markers,
    (elems) => elems.map(fixupElements),
    (elems) =>
      toXml(elems, {
        allowDangerousXml: true,
        closeEmptyElements: true,
      })
  )
  const doc = Doc.vsep([
    Doc.text(`export const markers = () => {`),
    Doc.text(`  return <>`),
    Doc.text(jsx),
    Doc.text(`  </>`),
    Doc.text(`}`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleMarkers = (ast: Root, dir: string) => {
  const markers = saveMarkers(ast)
  const text = renderMarkersTsx(markers)
  fs.writeFileSync(`${dir}/markers.tsx`, text, 'utf8')
}
