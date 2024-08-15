import { getFloorFacilities } from '../facilities'
import { getFloorNames } from '../floors'
import * as Swap from '../lib/swap'
import { XYS } from '../lib/xys'
import { floorsOps } from '../ops/floors'
import { getFloorShopLocPoints } from '../shops'
import * as transforms from '../transforms'
import { FloorContext } from '../types/floor'
import { FadingFloor } from './FadingFloor'
import {
  Fragment,
  MouseEventHandler,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react'

export interface FloorsProps {
  _ctx: FloorContext
  _xys: XYS
  _transforms: transforms.Transforms
  _onMapClick?: (p: DOMPointReadOnly, m: DOMMatrixReadOnly) => void
  onTransitionEnd: () => void
}

export const Floors = forwardRef((props: FloorsProps, forwardedRef) => {
  const swap = Swap.useSwap(props._ctx.idx, !props._ctx.busy)

  const svgMatrixRef = useRef<DOMMatrix | null>(null)

  useImperativeHandle(forwardedRef, () => svgMatrixRef.current)

  const onClick: MouseEventHandler<SVGElement> = useCallback(
    (ev) => {
      ev.stopPropagation()
      if (svgMatrixRef.current === null) {
        return
      }
      const m = svgMatrixRef.current
      if (m === null) {
        return
      }
      // XXX are pageX/pageY reliable???
      // XXX in case of iframe???
      const p = new DOMPointReadOnly(ev.pageX, ev.pageY)
      const x = DOMMatrixReadOnly.fromMatrix(m)
      props._onMapClick?.(p, x)
    },
    [props]
  )

  const r = props._transforms.mapRotation

  return (
    <svg
      ref={(e) => {
        if (e) {
          svgMatrixRef.current = e.getCTM()
        }
      }}
      className="map floors"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={floorsOps.viewBox}
      onClick={onClick}
      style={{
        transform: r === null || r === 0 ? undefined : `rotate(${r}deg)`,
        transformOrigin:
          r === null || r === 0
            ? undefined
            : `${props._xys.W / 2}px ${props._xys.H / 2}px`,
      }}
    >
      <defs>
        <floorsOps.markers />
        <floorsOps.assets />
      </defs>
      <g>
        {getFloorNames().map((name, idx) => (
          <Fragment key={idx}>
            <FadingFloor
              {...floorsOps.floors[name]}
              _renderer={floorsOps.renderers[name]}
              _facilities={getFloorFacilities(name)}
              _shopLocPoints={getFloorShopLocPoints(name)}
              _r={
                props._transforms.mapRotation === null
                  ? undefined
                  : props._transforms.mapRotation
              }
              _shown={swap.exists(idx)}
              _dir={swap.dir(idx)}
              _phase={swap.phase}
              onTransitionEnd={props.onTransitionEnd}
            />
          </Fragment>
        ))}
      </g>
    </svg>
  )
})
