import { Addresses, Coords } from './resolve-json'
import * as flatbush from 'flatbush'

type Result = Record<string, string[]>

export function resolve_shop_names(
  addresses_json: Addresses,
  coords_json: Coords
): Result {
  const addresses = Object.entries(addresses_json)
  const coords = Object.entries(coords_json)
  if (addresses.length == 0) {
    return {}
  }
  const f = new flatbush.default(addresses.length)
  const indices = new Map()
  const results: Result = {}

  for (const [a, { x, y }] of addresses) {
    const index = f.add(x, y, x, y)
    indices.set(index, a)
  }
  f.finish()
  for (const [n, points] of coords) {
    for (const { x, y } of points) {
      if (x === 0 && y === 0) {
        // empty coord
        continue
      }
      const neighbors = f.neighbors(x, y, 1)
      if (neighbors.length === 1) {
        const nearest = neighbors[0]
        const a = indices.get(nearest)
        if (a) {
          if (results[n] === undefined) {
            results[n] = [a]
          } else {
            results[n].push(a)
          }
        }
      } else {
        // not found - print error?
      }
    }
  }
  return results
}
