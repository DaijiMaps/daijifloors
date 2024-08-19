import { fixupElements } from './svg'
import * as Doc from '@effect/printer/Doc'
import { pipe } from 'effect'
import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Element, Root } from 'xast'
import { toXml } from 'xast-util-to-xml'

const saveAssets = (ast: Root): Element[] => {
  const subtrees: Element[] = []
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element')) {
      const groupmode = n.attributes['inkscape:groupmode']
      const label = n.attributes['inkscape:label']
      if (groupmode && groupmode === 'layer' && label && label === '(Assets)') {
        subtrees.push(n)
      }
    }
  })
  if (subtrees.length !== 1) {
    return []
  }
  const subtree = subtrees[0]
  const assets: Element[] = []
  visitParents<Element, undefined>(subtree, (n) => {
    if (is(n, 'element') && n.name === 'g') {
      const id = n.attributes['id']
      if (id) {
        if (id.match(/^[^A-Z].*$/)) {
          return
        }
        if (id.match(/^XShop.*$/)) {
          return
        }
        assets.push(n)
      }
    }
  })
  return assets
}

const renderAssets = (assets: Element[]) => {
  const jsx = pipe(
    assets,
    (elems) => elems.map(fixupElements),
    (elems) =>
      toXml(elems, {
        allowDangerousXml: true,
        closeEmptyElements: true,
      })
  )
  const doc = Doc.vsep([
    Doc.text(`export const assets = () => {`),
    Doc.text(`  return <>`),
    Doc.text(jsx),
    Doc.text(`  </>`),
    Doc.text(`}`),
  ])
  return Doc.render(doc, { style: 'pretty' })
}

export const handleAssets = (ast: Root, dir: string) => {
  const assets = saveAssets(ast)
  const text = renderAssets(assets)
  fs.writeFileSync(`${dir}/assets.tsx`, text, 'utf8')
}
