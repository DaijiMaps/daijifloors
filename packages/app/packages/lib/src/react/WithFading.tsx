import { Direction } from '../lib/direction'
import * as fading from '../lib/fading'
import { Phase } from '../lib/phase'
import { getVisibility } from '../lib/visibility'
import { Shown } from './Shown'
import React, { HTMLProps } from 'react'

interface ParentProps {
  _shown: boolean
  _dir: Direction
  _phase: Phase
}

export function withFading<P = HTMLProps<HTMLElement>>(
  Component: React.ComponentType<P>
) {
  return function (parentProps: P & ParentProps & HTMLProps<HTMLElement>) {
    const { _shown, _dir, _phase, ...props } = parentProps

    const vis = getVisibility(_dir, _phase)

    const childProps = {
      style: {
        transition: `opacity 1s`,
        ...fading.makeOpacityStyle(vis),
      },
      onTransitionEnd: _dir === 'in' ? props.onTransitionEnd : undefined,
    } as HTMLProps<HTMLElement>

    return (
      <Shown _shown={_shown}>
        <Component {...childProps} {...parentProps} />
      </Shown>
    )
  }
}
