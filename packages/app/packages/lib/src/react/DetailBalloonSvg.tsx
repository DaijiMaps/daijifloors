import { useExpanding } from '../lib/expanding'
import { paramsOps } from '../ops/params'
import './DetailBalloon.css'
import { useRef } from 'react'

// balloon (W = 240)
const HW = (W: number) => W * 0.5
const FH = (W: number) => W * (40 / 240)
const FW = (W: number) => W * (20 / 240)
const HFW = (W: number) => FW(W) * 0.5
const S = (W: number) => W / 100

function balloonPath(x: number, y: number, W: number, height: number): string {
  return (
    `M${x},${y}` +
    `l${-HFW(W)},${-FH(W)}` +
    `h${-(HW(W) - HFW(W))}` +
    `v${-height}` +
    `h${W}` +
    `v${height}` +
    `h${-(HW(W) - HFW(W))}` +
    `z`
  )
}

export function DetailBalloonSvg({
  _W,
  _H,
  _pageWidth,
  _pageHeight,
  _pageCoord,
}: {
  _W: number
  _H: number
  _pageWidth: number
  _pageHeight: number
  _pageCoord: DOMPointReadOnly
}) {
  const { phase, stop } = useExpanding(0)

  const svgMatrixRef = useRef<DOMMatrix | null>(null)

  const { x, y } = _pageCoord

  return (
    <svg
      ref={(e) => {
        if (e) {
          svgMatrixRef.current = e.getCTM()
        }
      }}
      className="map detail"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${_pageWidth} ${_pageHeight}`}
      style={{
        transformOrigin: `${x}px ${y}px`,
        transform:
          phase._ === 'expanding' ? `scale(${phase.scale})` : 'initial',
        transition:
          phase._ === 'expanding' && phase.scale !== 0
            ? `${paramsOps.APPEARING_TRANSITION}ms`
            : 'initial',
        pointerEvents: `none`,
      }}
      onTransitionEnd={stop}
    >
      <g className={'detail-balloon'}>
        <path
          className="shadow"
          d={balloonPath(x + S(_W), y + S(_W), _W, _H)}
        />
        <path
          d={balloonPath(x, y, _W, _H)}
          style={{
            strokeWidth: `${_W / 2400}px`,
          }}
        />
      </g>
    </svg>
  )
}
