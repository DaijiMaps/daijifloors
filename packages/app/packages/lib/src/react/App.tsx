import { Address } from '../addresses'
import { getFloorIdx } from '../floors'
import { useUpdate } from '../lib/update'
import * as msgs from '../msgs'
import { paramsOps } from '../ops/params'
import { updateConfig as update } from '../process-msg'
import * as app from '../types/app'
import { Params } from '../types/url-params'
import './App.css'
import { AppearingFooter } from './AppearingFooter'
import { AppearingHeader } from './AppearingHeader'
import { Detail } from './Detail'
import { FacilityDetailContent } from './FacilityDetailContent'
import { FloorButton } from './FloorButton'
import { FloorMenu2 } from './FloorMenu'
import { FloorMenuContent } from './FloorMenuContent'
import { Floors } from './Floors'
import { ShopDetailContent } from './ShopDetailContent'
import { useEffect, useRef, useState } from 'react'

function useApp({ params }: { params: Params }) {
  const [ctx, setCtx] = useState<app.AppContext>(app.defaultAppContext(params))

  const svgMatrixRef = useRef<DOMMatrixReadOnly | null>(null)

  useEffect(() => {
    if (ctx.svgMatrix !== null) {
      return
    }
    if (svgMatrixRef.current === null) {
      return
    }
    update.postMsgSync(msgs.MapInit(svgMatrixRef.current))
  }, [ctx])

  useUpdate<msgs.Msg, app.AppContext>(update, ctx, setCtx)

  return { ctx, svgMatrixRef }
}

function App({ params }: { params: Params }) {
  const { ctx, svgMatrixRef } = useApp({ params })

  return (
    <>
      <Floors
        ref={svgMatrixRef}
        onTransitionEnd={() => update.postMsgSync(msgs.FloorSwapStop())}
        _ctx={ctx.floor}
        _xys={ctx.xys}
        _transforms={ctx.transforms}
        _onMapClick={(p) => update.postMsgSync(msgs.MapClick(p))}
      />
      <AppearingHeader
        id="header"
        title={ctx.floor.name}
        transition={paramsOps.APPEARING_TRANSITION}
        _pos="top"
        _xys={ctx.xys}
        _busy={ctx.uiBusy || ctx.mode._ !== 'default'}
      />
      <AppearingFooter
        className="footer"
        transition={paramsOps.APPEARING_TRANSITION}
        _pos="bottom"
        _xys={ctx.xys}
        _busy={ctx.uiBusy || ctx.mode._ !== 'default'}
      >
        <FloorButton
          _name={ctx.floor.name}
          _categories={ctx.floor.categories}
          _onButtonClick={() =>
            update.postMsgSync(msgs.ModeSelect({ _: 'floor-menu' }))
          }
          _prev={{
            _suffix: 'prev',
            _name: ctx.floor.prev?.name,
            _onClick: () => {
              if (ctx.floor.prev?.idx !== undefined) {
                update.postMsgSync(msgs.FloorSelect(ctx.floor.prev.idx))
              }
            },
          }}
          _next={{
            _suffix: 'next',
            _name: ctx.floor.next?.name,
            _onClick: () => {
              if (ctx.floor.next?.idx !== undefined) {
                update.postMsgSync(msgs.FloorSelect(ctx.floor.next.idx))
              }
            },
          }}
        />
      </AppearingFooter>
      {ctx.mode._ === 'floor-menu' && (
        <FloorMenu2>
          <FloorMenuContent
            _onMenuItemClick={(idx, shopName) =>
              update.postMsgSync(msgs.FloorSelect(idx, shopName))
            }
          />
        </FloorMenu2>
      )}
      {ctx.mode._ === 'shop-detail' && (
        <Detail
          _scale={ctx.mode.ctx.scale}
          _viewportWidth={ctx.xys.w}
          _pageCoord={ctx.mode.ctx.pageCoord}
          _pageWidth={ctx.xys.W}
          _pageHeight={ctx.xys.H}
        >
          <ShopDetailContent _info={ctx.mode.ctx.info} />
        </Detail>
      )}
      {ctx.mode._ === 'facility-detail' && (
        <Detail
          _scale={ctx.mode.ctx.scale}
          _viewportWidth={ctx.xys.w}
          _pageCoord={ctx.mode.ctx.pageCoord}
          _pageWidth={ctx.xys.W}
          _pageHeight={ctx.xys.H}
        >
          <FacilityDetailContent
            _ctx={ctx.floor}
            _info={ctx.mode.ctx.info}
            _onFloorClick={(fn) =>
              update.postMsgSync(msgs.FloorSelect(getFloorIdx(fn)))
            }
            _onAddressClick={(address: Address) =>
              update.postMsgSync(msgs.AddressSelect(address))
            }
          />
        </Detail>
      )}
    </>
  )
}

export default App
