import { fit_by_area } from '../lib/area'
import { ExpandingPhase, useExpanding } from '../lib/expanding'
import { XYS } from '../lib/xys'
import { paramsOps } from '../ops/params'
import { FloorContext } from '../types/floor'
import './FloorMenu.css'
import { FloorMenuContent } from './FloorMenuContent'
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

function Menu({
  //_w,
  //_h,
  _xys,
  _phase,
  _stop,
  children,
}: PropsWithChildren<{
  _w: number
  _h: number
  _xys: XYS
  _phase: ExpandingPhase
  _stop: () => void
}>) {
  const X = _xys.x + _xys.w * 0.5
  const Y = _xys.y + _xys.h * 0.5

  return (
    <div
      className="floor-menu"
      style={{
        transformOrigin: `${X}px ${Y}px`,
        transform:
          _phase._ !== 'expanding' ? `initial` : `scale(${_phase.scale})`,
        transition:
          _phase._ === 'expanding' && _phase.scale !== 0
            ? `${paramsOps.APPEARING_TRANSITION}ms`
            : 'initial',
        opacity: _phase._ === 'closed' ? `0` : `1`,
      }}
      onTransitionEnd={_stop}
    >
      {children}
    </div>
  )
}

function MenuContent({
  _w,
  _h,
  _xys,
  _phase,
  _getRect,
  children,
}: PropsWithChildren<{
  _w: number
  _h: number
  _xys: XYS
  _phase: ExpandingPhase
  _getRect: GetRect
}>) {
  const fit = fit_by_area(_xys.w, _xys.h, _w, _h)
  const VS = fit.h / _xys.h
  const vs = (_xys.h * 0.95) / _h
  const s = vs * VS

  const X = _xys.x + _xys.w * 0.5 - _w * s * 0.5
  const Y = _xys.y + _xys.h * 0.5 - _h * s * 0.5

  return (
    <div
      ref={_getRect}
      className="floor-menu-content"
      style={{
        transformOrigin: `${0}px ${0}px`,
        transform:
          `translate(${X}px, ${Y}px)` +
          ' ' +
          `scale(${s})` +
          ' ' +
          // centering 95vw
          `translateX(2.5vw)`,
        transition:
          _phase._ === 'expanding' && _phase.scale === 1
            ? `transform ${paramsOps.EXPANDING_TRANSITION}ms`
            : `initial`,
      }}
    >
      {children}
    </div>
  )
}

export interface FloorMenuProps {
  _xys: XYS
  _floor: FloorContext
  _onMenuItemClick: (idx: number, shopName?: string) => void
}

type GetRect = (e: HTMLDivElement | null) => void

export function FloorMenu({ _xys, _onMenuItemClick }: FloorMenuProps) {
  const [height, setHeight] = useState<number>(0)

  const rectRef = useRef<DOMRect | null>(null)

  const { phase: _phase, stop: _stop } = useExpanding(0)

  const _getRect: GetRect = useCallback((e: HTMLDivElement | null) => {
    if (e) {
      rectRef.current = e.getBoundingClientRect()
    }
  }, [])

  useEffect(() => {
    if (height === 0) {
      if (rectRef.current === null) {
        return
      }
      setHeight(rectRef.current.height)
    }
  }, [height])

  const _w = _xys.W
  const _h = height

  return (
    <Menu {...{ _w, _h, _xys, _phase, _stop }}>
      <MenuContent {...{ _w, _h, _xys, _phase, _getRect }}>
        <FloorMenuContent {...{ _phase, _onMenuItemClick }} />
      </MenuContent>
    </Menu>
  )
}

export function FloorMenu2({ children }: PropsWithChildren) {
  return <div className="floor-menu2">{children}</div>
}
