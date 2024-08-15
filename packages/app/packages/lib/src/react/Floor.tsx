import { Facility } from '../types/facility'
import { FloorConfig, SVGRenderer } from '../types/floor'
import { LocPoint } from '../types/loc'
import { FacilitySvg } from './FacilitySvg'
import './Floor.css'
import { ShopNameSvg } from './ShopNameSvg'
import { Fragment, HTMLProps } from 'react'

export type FloorProps = FloorConfig & {
  _renderer: SVGRenderer
  _facilities: Facility[]
  _shopLocPoints: LocPoint[]
  _r?: number
} & HTMLProps<HTMLElement | SVGElement>

// attach onTransitionEnd handler only to the disappearing tree
// assume no need to detach
export function Floor(props: FloorProps) {
  return (
    <g
      className="floor"
      style={props.style}
      onTransitionEnd={props.onTransitionEnd}
    >
      <props._renderer />
      <g>
        {props._facilities.map((f, i) => (
          <Fragment key={i}>
            <FacilitySvg _facility={f} _r={props._r} />
          </Fragment>
        ))}
      </g>
      <g>
        {props._shopLocPoints.map(({ loc, p }, i) => (
          <Fragment key={i}>
            <ShopNameSvg _loc={loc} _x={p.x} _y={p.y} _w={p.w} _r={props._r} />
          </Fragment>
        ))}
      </g>
    </g>
  )
}
