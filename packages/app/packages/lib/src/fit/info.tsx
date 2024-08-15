import { area, checkSpan, spanCheckToString } from './check'
import { rnd, rnd3 } from './common'
import { FitContext } from './context'
import { Rects } from './rects'
import { Fragment, useContext } from 'react'

function SpanInfoRow(a: {
  fontSize: number
  frame: DOMRect
  id: string
  rect: DOMRect
}) {
  const ctx = useContext(FitContext)
  const f = a.frame
  const r = a.rect
  const nums = [
    // relative from frame left/top
    rnd(r.left - f.left),
    rnd(r.right - f.left),
    rnd(r.top - f.top),
    rnd(r.bottom - f.top),
    rnd(r.width),
    rnd(r.height),
  ]
  const check = spanCheckToString(checkSpan(f, r, a.fontSize))

  return (
    <tr>
      <td>{a.id}</td>
      {nums.map((x, i) => (
        <td key={i}>{x}</td>
      ))}
      <td>{rnd3(area(r) / (ctx.W * 100))}</td>
      <td>{check}</td>
    </tr>
  )
}

export interface SpansProps {
  fontSize: number
  frame: DOMRect
  rects: Rects
}

export function SpanInfo(p: SpansProps) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>l</td>
            <td>r</td>
            <td>t</td>
            <td>b</td>
            <td>w</td>
            <td>h</td>
            <td>area</td>
            <td>check</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(p.rects).map(([id, rect], i) => {
            return (
              <Fragment key={i}>
                <SpanInfoRow
                  fontSize={p.fontSize}
                  frame={p.frame}
                  id={id}
                  rect={rect}
                />
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export const Summary = (p: SpansProps) => {
  const ctx = useContext(FitContext)
  const rs = Object.values(p.rects)
  const tops = new Set(rs.map((r) => r.top))
  const totalArea = rs.map(area).reduce((a, b) => a + b, 0)

  return (
    <div>
      <p>words: {rs.length}</p>
      <p>lines: {tops.size}</p>
      <p>total area: {rnd3(totalArea / (ctx.W * 100))}</p>
    </div>
  )
}

export const Info = (p: SpansProps) => {
  return (
    <>
      <SpanInfo {...p} />
      <Summary {...p} />
    </>
  )
}
