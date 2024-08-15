import { FitContext } from './context'
import { Elems, getElemRectRef, setElemsRef } from './elems'
import { GetRect } from './rects'
import { LocWord, tspanId } from './word'
import {
  Fragment,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from 'react'

export const SvgTrects = forwardRef<
  GetRect,
  {
    fontSize: number
    locWords: LocWord[]
  }
>((props, forwardedRef) => {
  const ctx = useContext(FitContext)
  const ref = useRef<Elems<SVGTSpanElement>>({})

  useImperativeHandle(forwardedRef, () => getElemRectRef(ref))

  return (
    <>
      {props.locWords.map((lw, i) => (
        // XXX each word must have own <text>
        // XXX <tspan>'s in the same <text> return the identical client bbox
        // XXX bug?
        <Fragment key={i}>
          <text
            x={ctx.W * 0.5}
            y={100 * 0.5}
            fontSize={props.fontSize}
            textAnchor="middle"
          >
            <tspan
              ref={setElemsRef(ref)}
              id={
                forwardRef !== null ? tspanId(props.fontSize, lw.i) : undefined
              }
              x={ctx.W * 0.5 + lw.dx}
              y={100 * 0.5 + lw.dy}
              fontSize={props.fontSize}
              textAnchor="middle"
            >
              {lw.s}
            </tspan>
          </text>
        </Fragment>
      ))}
    </>
  )
})
