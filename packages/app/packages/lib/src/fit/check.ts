/*
 * Check rects
 */
import { Rects } from './rects'

export interface Checks {
  fontSize: number
  frame: DOMRect
  rects: Rects
  spans: SpanChecks[]
  area: AreaChecks
  all: boolean
}

export interface SpanChecks {
  left: boolean
  right: boolean
  top: boolean
  bottom: boolean
}

export interface AreaChecks {
  totalArea: number
}

const MARGIN = 10

export const area = (r: DOMRect): number => r.width * r.height

export function checkSpan(
  frame: DOMRect,
  word: DOMRect,
  fontSize: number
): SpanChecks {
  const margin = Math.max(MARGIN, fontSize / 2)

  return {
    left: frame.left - word.left < -margin * 1.25,
    right: frame.right - word.right > margin * 1.25,
    top: frame.top - word.top < -margin * 0.75,
    bottom: frame.bottom - word.bottom > margin * 0.75,
  }
}

export function spanCheckToString(c: SpanChecks) {
  const ox = (b: boolean) => (b ? 'o' : 'x')
  return [
    'l=',
    ox(c.left),
    ' r=',
    ox(c.right),
    ' t=',
    ox(c.top),
    ' b=',
    ox(c.bottom),
  ].join('')
}

export function collectChecks(
  W: number,
  fontSize: number,
  frame: DOMRect,
  rects: Rects
): Checks {
  const totalArea =
    Object.values(rects)
      .map(area)
      .reduce((a, b) => a + b, 0) /
    (W * 100)
  const spanChecks = Object.values(rects).map((r) =>
    checkSpan(frame, r, fontSize)
  )
  const all =
    totalArea < 0.4 &&
    spanChecks
      .map((s) => s.left && s.right && s.top && s.bottom)
      .reduce((a, b) => a && b, true)
  const checks: Checks = {
    fontSize,
    frame,
    rects,
    spans: spanChecks,
    area: { totalArea },
    all,
  }
  return checks
}
