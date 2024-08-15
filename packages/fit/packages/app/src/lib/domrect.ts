export function translate(r: DOMRect, d: DOMPoint): DOMRect {
  return {
    ...r,
    left: r.left - d.x,
    right: r.right - d.x,
    top: r.top - d.y,
    bottom: r.bottom - d.y,
    // XXX aliases
    //x: r.x - d.x,
    //y: r.y - d.y,
  }
}
