import { allAddresses, layerNames, Point } from '../inkscape'
import * as fs from 'fs'
import { Root } from 'xast'

class Addresses extends Map<string, Point> {}

const saveAddrresses = (name: string) => {
  const addresses = new Addresses()
  for (const [k, v] of allAddresses.entries()) {
    if (k.match(`/^A${name}-.*$/`)) {
      addresses.set(k, v)
    }
  }
  return addresses
}

const renderAddresses = (addresses: Addresses) => {
  const replacer = (k: unknown, v: unknown) => {
    if (v instanceof Map) {
      const m: { [k: string]: Point } = {}
      for (const [mk, mv] of v.entries()) {
        if (
          typeof mk === 'string' &&
          typeof mv === 'object' &&
          'x' in mv &&
          typeof mv.x === 'number' &&
          'y' in mv &&
          typeof mv.y === 'number'
        ) {
          m[mk] = mv
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
  // XXX for each floor names
  // XXX collect matching addresses (allAddresses)
  // XXX and write addresses/addresses_XXX.json

  for (const name of layerNames) {
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
