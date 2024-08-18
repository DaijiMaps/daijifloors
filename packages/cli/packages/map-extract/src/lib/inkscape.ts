import { parseTransformForAddress } from './transform.js'
import { Element } from 'hast'

export type Point = { x: number; y: number }
export type Addreesses = Map<string, Point>

const getLabel = (n: Element) => getStringProperty(n, 'inkscape:label')
const getTransform = (n: Element) => getStringProperty(n, 'transform')

function getStringProperty(n: Element, p: string): string | null {
  const a = n?.properties?.[p]
  return typeof a === 'string' ? a : null
}

export function addressBuilder(a: Addreesses, n: Element, parents: Element[]) {
  const address = buildAddress(n, parents)
  const transform = buildTransform(n)
  if (address && transform) {
    a.set(address, transform)
  }
}

function buildAddress(n: Element, parents: Element[]): string | null {
  const suffix = getLabel(n)
  if (suffix === null) {
    return null
  }
  const prefix = parents.filter(getLabel).map(getLabel).join('-')
  const address = prefix && suffix ? `${prefix}-${suffix}` : ''
  return checkAddress(address) ? address : null
}

// e.g. Floors-1F-Shops-A1-1
function checkAddress(address: string): boolean {
  return address !== '' && /^.*-[0-9]+$/.test(address)
}

function buildTransform(n: Element): Point | null {
  const a = getTransform(n)
  return a ? parseTransformForAddress(a) : null
}
