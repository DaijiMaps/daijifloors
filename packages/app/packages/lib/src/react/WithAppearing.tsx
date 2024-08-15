import { Appearing, AppearingParentProps } from './Appearing'
import { Shown } from './Shown'
import { ComponentType, HTMLProps } from 'react'

// passed from user
export interface WithAppearingParentProps {
  _busy: boolean
}

export function withAppearing<P = HTMLProps<HTMLElement>>(
  Component: ComponentType<P>
) {
  return function (
    parentProps: WithAppearingParentProps &
      AppearingParentProps &
      HTMLProps<Element>
  ) {
    const { _busy, ...rest } = parentProps

    return (
      <Shown _shown={!_busy}>
        <Appearing _component={Component} {...rest} />
      </Shown>
    )
  }
}
