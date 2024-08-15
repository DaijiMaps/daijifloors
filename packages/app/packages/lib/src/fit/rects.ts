export type Rects = Record<string, DOMRect>

export type GetRect = (id: string) => DOMRect | null
export type GetRectRef = React.MutableRefObject<GetRect>

export function collectRects(ids: Set<string>, ref: GetRectRef): Rects | null {
  const rects: Rects = {}
  let errors = 0
  for (const id of ids) {
    const rect = ref.current(id)
    if (!rect) {
      errors = errors + 1
      return null
    }
    rects[id] = rect
  }
  if (errors !== 0) {
    return null
  }
  return rects
}
