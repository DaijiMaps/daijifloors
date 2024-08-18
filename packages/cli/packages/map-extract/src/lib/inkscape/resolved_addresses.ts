import * as fs from 'fs'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Root } from 'xast'

class Addresses extends Map<string, string> {}

const saveResolvedAddrresses = (ast: Root) => {
  const addresses = new Addresses()
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element')) {
      const label = n.attributes['inkscape:label']
      if (label?.match(/ @ /)) {
        const [a, b] = label.split(/ @ /)
        if (typeof a === 'string' && typeof b === 'string') {
          addresses.set(b, a)
        }
      }
    }
  })
  return addresses
}

const renderResolvedAddresses = (addresses: Addresses) => {
  const o = Object.fromEntries(addresses.entries())
  return JSON.stringify(o, null, 2)
}

export const handleResolvedAddrresses = (ast: Root, dir: string) => {
  const resolvedAddresses = saveResolvedAddrresses(ast)
  const text = renderResolvedAddresses(resolvedAddresses)
  fs.writeFileSync(`${dir}/resolved_addresses.json`, text, 'utf8')
}
