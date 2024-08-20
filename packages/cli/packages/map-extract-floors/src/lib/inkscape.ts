import { parseTransformForAddress } from './transform.js'
import { spawnSync } from 'node:child_process'
import { Element, Root } from 'xast'

export type Point = { x: number; y: number }
export type Circle = Point & { r: number }
export type Addreesses = Map<string, Point>

const getLabel = (n: Element | Root) => getStringProperty(n, 'inkscape:label')
const getTransform = (n: Element | Root) => getStringProperty(n, 'transform')

function getName(n: Element | Root): string | null {
  const a = 'name' in n ? n?.name : undefined
  return typeof a === 'string' ? a : null
}

function getStringProperty(n: Element | Root, p: string): string | null {
  const a = 'attributes' in n ? n?.attributes?.[p] : undefined
  return typeof a === 'string' ? a : null
}

export function getPoint(e: Element | Root): Point | null {
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

export function buildAddress(
  n: Element,
  parents: (Element | Root)[]
): string | null {
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

// Inkscape bounding-box generation (-S)
// format: <id>,<x>,<y>,<w>,<h>

interface Box {
  // XXX same as ViewBox
  x: number
  y: number
  width: number
  height: number
}

export const allBoundingBoxes = new Map<string, Box>()

export const parseInkscapeBoundingBoxAll = (content: string): void => {
  content
    .split(/\n/)
    .filter((s) => s !== '')
    .filter((s) => s.match(/^[A-Z]/))
    .map((s) => {
      const values = s.split(/,/)
      if (values.length === 5) {
        try {
          const nums = values.slice(1).map(parseFloat)
          allBoundingBoxes.set(values[0], {
            x: nums[0],
            y: nums[1],
            width: nums[2],
            height: nums[3],
          })
        } catch (e) {
          console.log(e)
        }
      }
      return s
    })
  console.log('bb:', allBoundingBoxes)
}

export const generateBoundingBoxes = (
  infile: string,
  outdir: string
): string => {
  const res = spawnSync('inkscape', ['-S', infile], {
    cwd: outdir,
  })
  return res.stdout.toString()
}
