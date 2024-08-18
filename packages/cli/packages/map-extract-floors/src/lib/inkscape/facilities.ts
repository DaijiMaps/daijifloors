import { allPoints } from '../inkscape'
import * as fs from 'fs'
import { Root } from 'xast'

interface Facilities {
  biLinks: Map<number, string[]>
}

const allLinks: Map<number, string[]> = new Map()

const saveFacilities = (): Facilities => {
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
    if (v instanceof Map) {
      const m: { [k: string]: unknown } = {}
      for (const [mk, mv] of v.entries()) {
        if (typeof mk === 'number') {
          m[`${mk}`] = mv
        }
      }
      return m
    } else {
      return v
    }
  }
  return JSON.stringify(m, replacer, 2)
}

export const handleFacilities = (ast: Root, dir: string) => {
  const facilities = saveFacilities()
  const text = renderFacilities(facilities)
  fs.writeFileSync(`${dir}/facilities.json`, text, 'utf8')
}
