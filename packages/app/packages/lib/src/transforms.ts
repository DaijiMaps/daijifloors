import { pipe } from 'effect'

export interface Transforms {
  mapRotationRecenter: DOMPoint | null
  mapRotation: number | null
}

export const empty: Transforms = {
  mapRotationRecenter: null,
  mapRotation: 0,
}

export function toMatrix(xs: Transforms): DOMMatrixReadOnly {
  const c = xs.mapRotationRecenter
  const r = xs.mapRotation
  return pipe(
    new DOMMatrixReadOnly(),
    (m) => (c === null ? m : m.translate(c.x, c.y)),
    (m) => (r === null ? m : m.rotate(r)),
    (m) => (c === null ? m : m.translate(-c.x, -c.y))
  )
}

export const setRotation =
  (r: number) =>
  (xs: Transforms): Transforms => {
    return {
      ...xs,
      mapRotation: r,
    }
  }

export const setCenter =
  (c: DOMPoint) =>
  (xs: Transforms): Transforms => {
    return {
      ...xs,
      mapRotationRecenter: c,
    }
  }
