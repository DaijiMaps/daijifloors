import { namesToLocs } from '../locs'
import { paramsOps } from '../ops/params'
import { ShopName } from './ShopName'
import { CSSProperties, Fragment } from 'react'

function makeNcolsStyle(ncols: number): CSSProperties {
  const ow = Math.floor(90 / ncols) // 90/4 => 22.5 => 22
  const u = Math.floor((ow / 15) * 10) / 10 // 22/15 => 1.4666 => 1.4
  const w = u * 15 * ncols // 1.4*15*4 => 84
  const m = 2 //(90 - w) / 2
  return {
    // 1.4vw * 15 == 21vw
    // 21vw * 4 == 84vw
    // XXX theoretically (84vw - 0.1 * 4 * 1.4vw)
    width: `calc(${w}vw - 0.1 * ${ncols - 1} * ${u}vw)`,
    margin: `${m}em auto`,
    fontSize: `${u}vw`,

    display: `flex`,
    flexDirection: `row`,
    flexWrap: `wrap`,
    alignItems: `center`,
    //justifyContent: `center`,
  }
}

const ncolsStyle = makeNcolsStyle(paramsOps.FLOOR_MENU_SHOP_NAMES_NCOLS)

export function FloorShopNames({
  names,
  _onMenuItemClick,
}: {
  names: string[]
  _onMenuItemClick?: (shopName: string) => void
}) {
  return (
    <div style={ncolsStyle}>
      {namesToLocs(names).map(({ name, loc }, i) => (
        <Fragment key={i}>
          <ShopName
            loc={loc}
            W={150}
            name={name}
            _onMenuItemClick={_onMenuItemClick}
          />
        </Fragment>
      ))}
    </div>
  )
}
