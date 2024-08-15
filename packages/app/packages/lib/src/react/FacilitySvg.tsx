import { Facility } from '../types/facility'

export function FacilitySvg({
  _facility,
  _r,
}: {
  _facility: Facility
  _r?: number
}) {
  return (
    <g
      style={{
        transformOrigin:
          _r === undefined || _r === 0
            ? undefined
            : `${_facility.p.x}px ${_facility.p.y}px`,
        transform:
          _r === undefined || _r === 0 ? undefined : `rotate(${-_r}deg)`,
      }}
    >
      <use
        href={`#X${_facility.kind}`}
        style={{
          transform: `translate(${_facility.p.x}px,${_facility.p.y}px)`,
        }}
      />
    </g>
  )
}
