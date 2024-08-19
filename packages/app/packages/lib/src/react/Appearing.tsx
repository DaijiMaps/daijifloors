import { usePhase } from '../lib/phase'
import {
  bottomTransformOriginStyle,
  opacityStyle,
  topTransformOriginStyle,
  topTransformStyle,
  bottomTransformStyle,
  transitionStyle,
} from '../lib/style'
import { getVisibility } from '../lib/visibility'
import { XYS } from '../lib/xys'
import { ComponentType, HTMLProps, useMemo } from 'react'

// XXX TODO clean up `as` (e.g. props as P)

// passed from user
export interface AppearingParentProps {
  transition: number
  _pos: 'top' | 'bottom'
  _xys: XYS
}

// passed from withAppearing
export interface ComponentProps<P> {
  _component: ComponentType<P>
}

// passed to component
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ChildProps extends HTMLProps<HTMLElement> {}

export function Appearing<P = HTMLProps<HTMLElement>>(
  parentProps: HTMLProps<Element> & AppearingParentProps & ComponentProps<P>
) {
  const { _component, _pos, _xys, transition, ...props } = parentProps

  const { phase, onFinish } = usePhase()

  const vis = useMemo(() => getVisibility('in', phase), [phase])

  const originStyle =
    _pos === 'top' ? topTransformOriginStyle : bottomTransformOriginStyle

  const transformStyle =
    _pos === 'top' ? topTransformStyle : bottomTransformStyle

  const childProps = {
    style: {
      ...originStyle(),
      ...transformStyle({ ..._xys, vis }),
      ...opacityStyle({ vis }),
      ...transitionStyle({ transition, vis }),
    },
    onTransitionEnd: onFinish,
  }

  return (
    <div
      className={`appearing ${
        phase !== 'finished' ? 'animating' : 'not-animating'
      }`}
    >
      <_component {...(childProps as ChildProps)} {...(props as P)} />
    </div>
  )
}
