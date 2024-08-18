import { buildAddress, getPoint, isPoint, Point } from '../inkscape'
import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root } from 'xast'

interface Facilities {
  biLinks: Map<number, string[]>
}

// XXX per-floor?
const allAddresses: Map<string, Point> = new Map()
// key: point as string
const allPoints: Map<string, string[]> = new Map()

const allLinks: Map<number, string[]> = new Map()

const saveFacilities = (ast: Root): Facilities => {
  visitParents(ast, (e, parents) => {
    if (is(e, 'element')) {
      if (isPoint(e)) {
        const a = buildAddress(e, parents)
        const p = getPoint(e)
        if (a !== null && p !== null) {
          allAddresses.set(a, p)
          const s = `${p.x},${p.y}`
          let xs = allPoints.get(s)
          if (xs === undefined) {
            xs = []
          }
          xs.push(a)
          allPoints.set(s, xs)
        }
      }
    }
  })

  console.log('allAddresses:', allAddresses)
  console.log('allPoints:', allPoints)

  let n = 1
  for (const [, v] of allPoints.entries()) {
    if (v.length < 2) {
      continue
    }
    const xs = v.filter((a) => a.match(/^.*-Facilities-.*$/))
    if (xs.length < 2) {
      continue
    }
    const xxs = xs.filter((a) => a.match(/^.*(Elevator|Stairs).*$/))
    if (xxs.length < 2) {
      continue
    }
    allLinks.set(n, xxs)
    n = n + 1
  }

  console.log('allLinks:', allLinks)

  return {
    biLinks: allLinks,
  }
}

const renderFacilities = (m: Facilities): string => {
  const replacer = (k: unknown, v: unknown) => {
    console.log('replacer:', 'key:', k, 'value:', v)
    if (v instanceof Map) {
      console.log('replacer: map:', v)
      const m: { [k: string]: unknown } = {}
      for (const [mk, mv] of v.entries()) {
        if (typeof mk === 'number') {
          m[`${mk}`] = mv
        }
      }
      console.log('replacer:', v, m)
      return m
    } else {
      return v
    }
  }
  return JSON.stringify(m, replacer, 2)
}

export const handleFacilities = (ast: Root, dir: string) => {
  console.log('XXX')
  console.log('XXX')
  console.log('XXX facilities.json')
  console.log('XXX')
  console.log('XXX')
  const facilities = saveFacilities(ast)
  const text = renderFacilities(facilities)
  fs.writeFileSync(`${dir}/facilities.json`, text, 'utf8')
}
