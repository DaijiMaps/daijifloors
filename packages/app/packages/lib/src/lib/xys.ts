export type XYS = {
  x: number
  y: number
  w: number
  h: number
  W: number
  H: number
  s: number
}

export const initXYS: XYS = getXYS()

export function getXYS(): XYS {
  const b = document.body
  const v: VisualViewport | null = window.visualViewport
  if (!b) {
    throw new Error('document.body not found!')
  }
  if (!v) {
    throw new Error('window.visualViewpot not found!')
  }
  const r = b.getBoundingClientRect()
  const s = r.width / v.width
  const xys = {
    x: v.offsetLeft,
    y: v.offsetTop,
    w: v.width,
    h: v.height,
    W: r.width,
    H: r.height,
    s,
  }
  return xys
}

export function center(xys: XYS): DOMPointReadOnly {
  return new DOMPointReadOnly(xys.W / 2, xys.H / 2)
}
