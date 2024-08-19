import tp from '@jutaz/transform-parser'

export type Point = { x: number; y: number }

// transform must have only one translate(x, y)
// e.g. transform="translate(0,-286.85259)"
export function parseTransformForAddress(transform: string): Point | null {
  const p = tp.parse(transform)
  if (p) {
    if (p.length === 1) {
      const t = p[0]
      if (t.type === 'translate' && t.z === null) {
        if (t.x?.unit === null && t.y?.unit === null) {
          return { x: t.x?.value ?? 0, y: t.y?.value ?? 0 }
        }
      }
    }
  }
  return null
}
