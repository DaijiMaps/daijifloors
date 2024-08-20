import { buildAddress, Circle, getPoint, isPoint, Point } from '../inkscape'
import { allLayerNames } from './floors-floors'
import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root } from 'xast'

export const allAddresses: Map<string, Circle> = new Map()
export const allPoints: Map<string, string[]> = new Map()

export const saveAllAddressesAndPoints = (ast: Root): void => {
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
}

class Addresses extends Map<string, Point> {}

const saveAddrresses = (name: string) => {
  const addresses = new Addresses()
  for (const [k, v] of allAddresses.entries()) {
    if (k.match(`^A${name}-.*$`)) {
      addresses.set(k, v)
    }
  }
  console.log('saveAddresses:', name, '->', addresses)
  return addresses
}

const renderAddresses = (addresses: Addresses) => {
  const replacer = (k: unknown, v: unknown) => {
    if (v instanceof Map) {
      const m: { [k: string]: Point & { w: number } } = {}
      for (const [mk, mv] of v.entries()) {
        if (
          typeof mk === 'string' &&
          typeof mv === 'object' &&
          'x' in mv &&
          typeof mv.x === 'number' &&
          'y' in mv &&
          typeof mv.y === 'number' &&
          'r' in mv &&
          typeof mv.r === 'number'
        ) {
          m[mk] = { x: mv.x, y: mv.y, w: mv.r * 2 }
        } else {
          // XXX
        }
      }
      return m
    } else {
      return v
    }
  }
  return JSON.stringify(addresses, replacer, 2)
}

export const handleAddrresses = (ast: Root, dir: string) => {
  for (const name of allLayerNames.filter((n) => n.match(/^[^()]/))) {
    const addresses = saveAddrresses(name)
    const text = renderAddresses(addresses)
    try {
      fs.mkdirSync(`${dir}/addresses`)
    } catch (e) {
      console.log(e)
    }
    fs.writeFileSync(`${dir}/addresses/addresses_${name}.json`, text, 'utf8')
  }
}
