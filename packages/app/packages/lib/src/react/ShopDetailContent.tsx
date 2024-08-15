import { locsOps } from '../ops/locs'
import { ShopInfo } from '../types/shop'
import './ShopDetailContent.css'
import { ShopName } from './ShopName'

export function ShopDetailContent(props: { _info: ShopInfo }) {
  const name = props._info.name
  const loc = name in locsOps.locs ? locsOps.locs[name] : undefined

  return loc === undefined ? (
    <></>
  ) : (
    <div className="shop-detail-content">
      <div className="shop-detail-shop-name">
        {props._info.locWide ? (
          <ShopName loc={props._info.locWide} W={300} />
        ) : (
          <h1>{props._info.name}</h1>
        )}
      </div>
      {props._info.descrs !== undefined &&
        props._info.descrs.map((descr, i) => <p key={i}>{descr}</p>)}
      {props._info.web !== undefined && (
        <p style={{ textAlign: `center`, pointerEvents: `auto` }}>
          <a href={props._info.web} target="_blank">
            Official web site
          </a>
        </p>
      )}
    </div>
  )
}
