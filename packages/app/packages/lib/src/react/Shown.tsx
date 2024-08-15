import { PropsWithChildren } from 'react'

export interface ShownProps {
  _shown: boolean
}

export function Shown(props: PropsWithChildren<ShownProps>) {
  return !props._shown ? <></> : <>{props.children}</>
}
