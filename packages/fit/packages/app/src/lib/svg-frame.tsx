import { Checks } from './check'
import { FitContext } from './context'
import { Result } from './model'
import { GetRect, collectRects } from './rects'
import { SvgTrects } from './svg-span'
import { LocWord, Word, collectLocs, tspanId } from './word'
import { useContext, useEffect, useRef, useState } from 'react'

type SvgFramePhase = 'inited' | 'rendered' | 'checked'

interface SvgFrameModel {
  phase: SvgFramePhase
}

export interface SvgFrameProps {
  words: Word[]
  best: Checks
  done?: (locWords: LocWord[]) => void
}

function useSvgFrame(props: SvgFrameProps) {
  const [model, setModel] = useState<SvgFrameModel>({
    phase: 'inited',
  })
  const svgGetRectRef = useRef<GetRect>(() => null)

  useEffect(() => {
    if (model.phase === 'inited') {
      setModel({ ...model, phase: 'rendered' })
    }
    if (model.phase === 'rendered') {
      const ids = new Set(
        props.words.flatMap((w) =>
          w.t === 'break' ? [] : [tspanId(props.best.fontSize, w.i)]
        )
      )
      const rects = collectRects(ids, svgGetRectRef)
      if (rects === null) {
        return
      }
      const locWords = collectLocs(
        props.words,
        Object.values(props.best.rects),
        Object.values(rects)
      )
      if (locWords.length > 0) {
        if (props.done) {
          props.done(locWords)
        }
      }
      setModel({ ...model, phase: 'checked' })
    }
  }, [model, props])

  return {
    svgGetRectRef,
  }
}

export function SvgFrame(props: SvgFrameProps) {
  const ctx = useContext(FitContext)
  const { svgGetRectRef } = useSvgFrame(props)

  return (
    <svg
      style={{
        position: 'absolute',
        left: props.best.frame.left,
        top: props.best.frame.top,
      }}
      width={`${ctx.W}px`}
      height="100px"
      className="svg-frame"
      viewBox={`0 0 ${ctx.W} 100`}
    >
      <path d={`M0,0 h${ctx.W} v100 h-${ctx.W} z`} />
      <SvgTrects
        ref={svgGetRectRef}
        fontSize={props.best.fontSize}
        locWords={props.words.flatMap((w) =>
          w.t === 'break' ? [] : [{ s: w.s, i: w.i, dx: 0, dy: 0 }]
        )}
      />
    </svg>
  )
}

export function SvgResult(result: Result) {
  const ctx = useContext(FitContext)

  return (
    <svg
      style={{
        margin: '10px',
        opacity: 1,
      }}
      width={`${ctx.W}px`}
      height="100px"
      className="svg-frame svg-frame-loc"
      viewBox={`0 0 ${ctx.W} 100`}
    >
      <path d={`M0,0 h${ctx.W} v100 h-${ctx.W} z`} />
      <SvgTrects
        ref={null}
        fontSize={result.checks.fontSize}
        locWords={result.locWords}
      />
    </svg>
  )
}
