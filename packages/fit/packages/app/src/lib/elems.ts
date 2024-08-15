import { GetRect } from './rects'

export type Elems<E extends Element> = Record<string, E | null>
export type ElemsRef<E extends Element> = React.MutableRefObject<Elems<E>>

export function getElemRect<E extends Element>(e: E | null): DOMRect | null {
  return e?.getBoundingClientRect() ?? null
}

export function getElemRectRef<E extends Element>(ref: ElemsRef<E>): GetRect {
  return (id: string) => getElemRect(ref.current[id])
}

export function setElemsRef<E extends Element>(ref: ElemsRef<E>) {
  return (e: E) => {
    if (e) {
      ref.current[e.id] = e
    }
  }
}
