import { Checks, collectChecks } from './check'
import { FitContext } from './context'
import { getElemRect } from './elems'
import { HtmlSpans } from './html-span'
import { Result } from './model'
import { GetRect, collectRects } from './rects'
import { Word, spanId } from './word'
import { useContext, useEffect, useRef, useState } from 'react'

type HtmlFramePhase = 'inited' | 'rendered' | 'checked'

interface HtmlFrameModel {
  phase: HtmlFramePhase
  checks: Checks | null
}

export interface HtmlFrameProps {
  fontSize: number
  words: Word[]
  done?: (checks: Checks) => void
}

function useHtmlFrame(props: HtmlFrameProps) {
  const ctx = useContext(FitContext)
  const [model, setModel] = useState<HtmlFrameModel>({
    phase: 'inited',
    checks: null,
  })
  const frameRef = useRef<HTMLDivElement>(null)
  const htmlGetRectRef = useRef<GetRect>(() => null)

  useEffect(() => {
    if (model.phase === 'inited') {
      setModel({ ...model, phase: 'rendered' })
    }
    if (model.phase === 'rendered') {
      const frame = getElemRect(frameRef.current)
      if (frame === null) {
        return
      }
      const ids = new Set(
        props.words.flatMap((w) =>
          w.t === 'span' ? [spanId(props.fontSize, w.i)] : []
        )
      )
      const rects = collectRects(ids, htmlGetRectRef)
      if (rects === null) {
        return
      }
      const checks = collectChecks(ctx.W, props.fontSize, frame, rects)
      setModel({ ...model, phase: 'checked', checks })
      if (props.done) {
        props.done(checks)
      }
    }
  }, [ctx, model, props, setModel])

  return { frameRef, htmlGetRectRef }
}

export function HtmlFrame(props: HtmlFrameProps) {
  const ctx = useContext(FitContext)
  const { frameRef, htmlGetRectRef } = useHtmlFrame(props)

  return (
    <div
      ref={frameRef}
      id={`html-frame-${props.fontSize}`}
      className="frame"
      style={{
        width: `${ctx.W}px`,
      }}
    >
      <p
        style={{
          fontSize: props.fontSize,
        }}
      >
        <HtmlSpans
          ref={htmlGetRectRef}
          fontSize={props.fontSize}
          words={props.words}
        />
      </p>
    </div>
  )
}

export function HtmlResult(result: Result) {
  const ctx = useContext(FitContext)

  return (
    <div
      className="frame"
      style={{
        width: `${ctx.W}px`,
      }}
    >
      <p
        style={{
          fontSize: result.checks.fontSize,
        }}
      >
        <HtmlSpans ref={null} words={result.words} />
      </p>
    </div>
  )
}
