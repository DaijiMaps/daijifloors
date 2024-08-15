import { Loc } from '../types/loc'
import './ShopName.css'
import { Fragment } from 'react'

export function ShopName({
  loc,
  W,
  name,
  _onMenuItemClick,
}: {
  loc: Loc
  W: number
  name?: string
  _onMenuItemClick?: (shopName: string) => void
}) {
  return (
    <div
      className="shop-name"
      style={{
        width: `${W / 10}em`,
      }}
      onClick={
        name === undefined || _onMenuItemClick === undefined
          ? undefined
          : (ev) => {
              // either "shop name" or "floor" is clicked
              ev.stopPropagation()
              _onMenuItemClick(name)
            }
      }
    >
      <p>
        {loc.lines.map((line, j) => (
          <Fragment key={j}>
            {j === 0 ? '' : ' '}
            <span
              style={{
                fontSize: `${line.fontSize * 0.1}em`,
              }}
            >
              {line.text}
            </span>
          </Fragment>
        ))}
      </p>
    </div>
  )
}
