import { ExpandingPhase, useExpanding } from '../lib/expanding'
import { paramsOps } from '../ops/params'
import './Detail.css'
import { DetailBalloonSvg } from './DetailBalloonSvg'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

function DetailOuter({
  x,
  y,
  w,
  h,
  phase,
  stop,
  getRect,
  children,
}: PropsWithChildren<{
  x: number
  y: number
  w: number
  h: number
  phase: ExpandingPhase
  stop: () => void
  getRect: (e: HTMLDivElement | null) => void
}>) {
  return (
    <div
      className="page detail"
      style={{
        transformOrigin: `${x}px ${y}px`,
        transform:
          phase._ === 'expanding' ? `scale(${phase.scale})` : 'initial',
        transition:
          phase._ === 'expanding' && phase.scale !== 0
            ? `${paramsOps.APPEARING_TRANSITION}ms`
            : 'initial',
        // hide while calc'ing height
        opacity: h === 0 ? `0` : `initial`,
      }}
      onTransitionEnd={stop}
    >
      <DetailInner {...{ x, y, w, h, getRect }}>{children}</DetailInner>
    </div>
  )
}

function DetailInner({
  x,
  y,
  w,
  h,
  getRect,
  children,
}: PropsWithChildren<{
  x: number
  y: number
  w: number
  h: number
  getRect: (e: HTMLDivElement | null) => void
}>) {
  return (
    <div
      ref={getRect}
      className="detail-content"
      style={{
        position: `absolute`,
        left: `${x - w / 2}px`,
        top: `${y - h - (w * 40) / 240}px`,
        width: `${w}px`,
        fontSize: `${w / 30}px`,

        opacity: h === 0 ? `0` : `initial`,

        // XXX
        // XXX
        // XXX
        // XXX enabling this causes facility detail svg icon shift by 1px
        // XXX during animation ... why???
        //transition: `opacity ${APPEARING_TRANSITION}ms`,
        // XXX
        // XXX
        // XXX
      }}
    >
      {children}
    </div>
  )
}

interface DetailProps {
  _scale: number
  _viewportWidth: number
  _pageCoord: DOMPointReadOnly
  _pageWidth: number
  _pageHeight: number
}

function useDetail(props: PropsWithChildren<DetailProps>) {
  const w = (props._viewportWidth / 2) * props._scale

  const [height, setHeight] = useState<number>(0)
  const [width] = useState<number>(w)

  const { phase, stop } = useExpanding(0)

  const contectRectRef = useRef<DOMRect | null>(null)

  const getRect = useCallback((e: HTMLDivElement | null) => {
    if (e) {
      contectRectRef.current = e.getBoundingClientRect()
    }
  }, [])

  useEffect(() => {
    if (height === 0) {
      if (contectRectRef.current === null) {
        return
      }
      setHeight(contectRectRef.current.height)
    }
  }, [height])

  const { x, y } = props._pageCoord

  return { x, y, w: width, h: height, phase, stop, getRect }
}

export function Detail(props: PropsWithChildren<DetailProps>) {
  const { x, y, w, h, phase, stop, getRect } = useDetail(props)

  return (
    <>
      {h !== 0 && (
        <DetailBalloonSvg
          _pageCoord={props._pageCoord}
          _pageWidth={props._pageWidth}
          _pageHeight={props._pageHeight}
          _W={w}
          _H={h}
        />
      )}
      <DetailOuter {...{ x, y, w, h, phase, stop, getRect }}>
        {props.children}
      </DetailOuter>
    </>
  )
}
