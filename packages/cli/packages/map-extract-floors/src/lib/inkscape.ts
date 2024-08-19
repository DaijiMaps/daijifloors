import { parseTransformForAddress } from './transform.js'
import { Element as HE, Root as HR } from 'hast'
import { is } from 'unist-util-is'
import { visitParents } from 'unist-util-visit-parents'
import { Element as XE, Root as XR } from 'xast'

type Element = HE | HR | XR | XE
type Root = HR | XR

export type Point = { x: number; y: number }
export type Circle = Point & { r: number }
export type Addreesses = Map<string, Point>

const getLabel = (n: Element) => getStringProperty(n, 'inkscape:label')
const getTransform = (n: Element) => getStringProperty(n, 'transform')

function getName(n: Element): string | null {
  const a = 'name' in n ? n?.name : undefined
  return typeof a === 'string' ? a : null
}

function getStringProperty(n: Element, p: string): string | null {
  const a =
    'properties' in n
      ? n?.properties?.[p]
      : 'attributes' in n
        ? n?.attributes?.[p]
        : undefined
  return typeof a === 'string' ? a : null
}

export function getPoint(e: Element): Point | null {
  const name = getName(e)
  if (name !== null) {
    if (name === 'use') {
      const x = getTransform(e)
      if (x !== null) {
        const p = parseTransformForAddress(x)
        if (p !== null) {
          // XXX r?
          return p
        }
      }
    }
    if (name === 'circle' || name === 'ellipse') {
      const cx = getStringProperty(e, 'cx')
      const cy = getStringProperty(e, 'cy')
      if (cx !== null && cy !== null) {
        try {
          const x = parseFloat(cx)
          const y = parseFloat(cy)
          // XXX r?
          return { x, y }
        } catch (e) {
          console.log(e)
          return null
        }
      }
    }
  }
  return null
}

export function isPoint(e: Element): boolean {
  const label = getLabel(e)
  if (label !== null) {
    if (label.match(/^[1-9][0-9]*$/)) {
      return true
    }
  }
  return false
}

export function addressBuilder(a: Addreesses, n: Element, parents: Element[]) {
  const address = buildAddress(n, parents)
  const transform = buildTransform(n)
  if (address && transform) {
    a.set(address, transform)
  }
}

export function buildAddress(n: Element, parents: Element[]): string | null {
  const suffix = getLabel(n)
  if (suffix === null) {
    return null
  }
  const prefix = parents
    .filter(getLabel)
    .map(getLabel)
    .join('-')
    .replace(/-Content-/, '-')
    .replace(/^/, 'A')
  const address = prefix && suffix ? `${prefix}-${suffix}` : ''
  return checkAddress(address) ? address : null
}

// e.g. Floors-1F-Shops-A1-1
export function checkAddress(address: string): boolean {
  return address !== '' && /^.*-[0-9]+$/.test(address)
}

function buildTransform(n: Element): Point | null {
  const a = getTransform(n)
  return a ? parseTransformForAddress(a) : null
}

export const allAddresses: Map<string, Point> = new Map()
export const allPoints: Map<string, string[]> = new Map()

export const saveAddressesAndPoints = (ast: XR): void => {
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

// XXX REFACTOR
// - find 'Content' and check the parent
// - if the parent is layer, save 'Content' tree with the layer name

export const layerNames = new Array<string>()

export const saveFloorLayerNames = (ast: Root) => {
  visitParents<Root, undefined>(ast, (n) => {
    if (is(n, 'element') && getName(n) === 'g') {
      const label = getLabel(n)
      if (
        getStringProperty(n, 'inkscape:groupmode') === 'layer' &&
        // exclude e.g. (Assets)
        label?.match(/[^(]/)
      ) {
        layerNames.push(label)
      }
    }
  })
  return layerNames
}
