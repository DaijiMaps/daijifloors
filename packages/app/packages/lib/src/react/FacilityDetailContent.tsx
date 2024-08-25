import { addressToFloorName } from '../addresses'
import { paramsOps } from '../ops/params'
import { Address } from '../types/address'
import { FacilityInfo } from '../types/facility'
import { FloorContext, FloorName } from '../types/floor'
import './FacilityDetailContent.css'
import { Fragment } from 'react'

// XXX
function sizeToViewBox(s: number): string {
  const h = s / 2
  return `${-h} ${-h} ${s} ${s}`
}

function FacilityDetailTitle({ _info }: FacilityDetailContentProps) {
  return (
    <h2
      style={{
        fontSize: `2.5em`,
        fontWeight: `lighter`,
        margin: `0.5em`,
      }}
    >
      {_info.kind}
      {` #`}
      {_info.idx}
    </h2>
  )
}

function FacilityDetailIcon({ _info }: FacilityDetailContentProps) {
  const xid = `#X${_info.kind}`
  return (
    <div
      style={{
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        margin: `2em 4em`,
      }}
    >
      <svg
        viewBox={sizeToViewBox(paramsOps.SYMBOL_SIZE)}
        width="7.5em"
        height="7.5em"
      >
        <use href={xid} />
      </svg>
    </div>
  )
}

function FacilityDetailLinks({
  _ctx,
  _info,
  _onFloorClick,
  _onAddressClick,
}: FacilityDetailContentProps) {
  return (
    <div
      className="facility-detail-links"
      style={{
        fontSize: `2em`,
      }}
    >
      {_onFloorClick !== undefined &&
        _info.links !== undefined &&
        _info.links.tag === 'uni' &&
        _info.links.destinations.map((d, i) => (
          <Fragment key={i}>
            <p onClick={() => _onFloorClick(d)}>{d}</p>
          </Fragment>
        ))}
      {_onAddressClick !== undefined &&
        _info.links !== undefined &&
        _info.links.tag === 'bi' &&
        _info.links.addresses.map((a, i) => (
          <Fragment key={i}>
            <p
              style={
                addressToFloorName(a) === _ctx.name ? { opacity: `0.25` } : {}
              }
              onClick={
                addressToFloorName(a) === _ctx.name
                  ? undefined
                  : () => _onAddressClick(a)
              }
            >
              {addressToFloorName(a)}
            </p>
          </Fragment>
        ))}
    </div>
  )
}

export interface FacilityDetailContentProps {
  _ctx: FloorContext
  _info: FacilityInfo
  _onFloorClick?: (fn: FloorName) => void
  _onAddressClick?: (address: Address) => void
}

export function FacilityDetailContent(props: FacilityDetailContentProps) {
  return (
    <div
      className="facility-detail"
      style={{
        fontWeight: `lighter`,
        fontFamily: `sans-serif`,
        padding: `1em`,
        textAlign: `center`,
      }}
    >
      <FacilityDetailTitle {...props} />
      <FacilityDetailIcon {...props} />
      <FacilityDetailLinks {...props} />
    </div>
  )
}
