import { Loc } from '../types/loc'

function rectPath(x: number, y: number, s: number) {
  const w = 150 * s
  const h = 100 * s
  const hw = w * 0.5
  const hh = h * 0.5
  return `M${x},${y}m${-hw},${-hh}h${w}v${h}h${-w}z`
}

export interface ShopNameSvgProps {
  _loc: Loc
  _x: number
  _y: number
  _w: number
  _r?: number
}

export function ShopNameSvg({ _loc, _x, _y, _w, _r }: ShopNameSvgProps) {
  const s = _w / 150
  const fs = _loc.fontSize * s
  return (
    <g
      style={{
        transformOrigin:
          _r === undefined || _r === 0 ? undefined : `${_x}px ${_y}px`,
        transform:
          _r === undefined || _r === 0 ? undefined : `rotate(${-_r}deg)`,
      }}
    >
      <path
        d={rectPath(_x, _y, s)}
        fontFamily="Avenir"
        stroke="black"
        strokeWidth={s * 2}
        fill="none"
      />
      <text fontSize={`${fs}px`} x={_x} y={_y}>
        {_loc.lines.map((line, i) => (
          <tspan key={i} x={_x} y={_y + line.dy * s} textAnchor="middle">
            {line.text}
          </tspan>
        ))}
      </text>
    </g>
  )
}
