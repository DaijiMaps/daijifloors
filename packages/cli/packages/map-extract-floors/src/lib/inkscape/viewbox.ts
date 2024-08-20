import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root } from 'xast'

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export class ParseError {
  readonly _tag = 'ParseError'
}

const parseViewBox = (s: string): null | Box => {
  const xs = s.split(/ +/).map((x) => parseFloat(x))
  if (xs.length !== 4) {
    return null
  }
  for (const x of xs) {
    if (isNaN(x)) {
      return null
    }
  }
  return {
    x: xs[0],
    y: xs[1],
    width: xs[2],
    height: xs[3],
  }
}

const saveViewBox = (ast: Root): Box[] => {
  const foundViewBoxes: Box[] = []
  visitParents<Root, undefined>(ast, (n, parents) => {
    if (
      parents.length === 1 &&
      is(parents[0], 'root') &&
      is(n, 'element') &&
      n.name === 'svg'
    ) {
      const viewBox = n.attributes['viewBox']
      if (viewBox) {
        const found = parseViewBox(viewBox)
        if (found !== null) {
          foundViewBoxes.push(found)
        }
      }
    }
  })
  return foundViewBoxes
}

const renderViewBox = (viewBox: Box) => {
  return JSON.stringify(viewBox, null, 2)
}

export const handleViewBox = (ast: Root, dir: string) => {
  const foundViewBoxes = saveViewBox(ast)
  if (foundViewBoxes.length !== 1) {
    throw new ParseError()
  }
  fs.writeFileSync(
    `${dir}/viewBox.json`,
    renderViewBox(foundViewBoxes[0]),
    'utf8'
  )
}
