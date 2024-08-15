import { getFloorNames } from '../floors'
import { ExpandingPhase } from '../lib/expanding'
import { floorsOps } from '../ops/floors'
import { paramsOps } from '../ops/params'
import { getFloorShopNames } from '../shops'
import { FloorCategories } from './FloorCategories'
import './FloorMenuContent.css'
import { FloorShopNames } from './FloorShopNames'

export function FloorMenuContent({
  _phase,
  _onMenuItemClick,
}: {
  _phase?: ExpandingPhase
  _onMenuItemClick: (idx: number, shopName?: string) => void
}) {
  return (
    <>
      {getFloorNames().map((floorName, i) => (
        <div
          key={i}
          className="floor-menu-item"
          onClick={(ev) => {
            ev.stopPropagation()
            _onMenuItemClick(i)
          }}
        >
          <div
            className="floor-menu-item-content"
            style={
              _phase === undefined
                ? {}
                : {
                    opacity:
                      _phase._ !== 'expanding'
                        ? `initial`
                        : _phase.scale !== 1
                          ? `0`
                          : `1`,
                    transition:
                      _phase._ === 'expanding' && _phase.scale === 1
                        ? `opacity ${paramsOps.EXPANDING_TRANSITION}ms`
                        : `initial`,
                  }
            }
          >
            <h2 className="floor-menu-item-name">{floorName}</h2>
            <FloorCategories
              className="floor-menu-item-categories"
              _categories={floorsOps.floors[floorName].categories}
            />
            <FloorShopNames
              names={getFloorShopNames(floorName)}
              _onMenuItemClick={(shopName: string) =>
                _onMenuItemClick(i, shopName)
              }
            />
          </div>
        </div>
      ))}
    </>
  )
}
