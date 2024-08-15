import './Shade.css'
import { HTMLProps, PropsWithChildren } from 'react'

export interface ShadeProps {
  _shading: boolean
}

export function Shade(
  props: PropsWithChildren<ShadeProps> & HTMLProps<HTMLDivElement>
) {
  const { _shading, ...rest } = props

  const classes = ['shade', _shading ? 'shading' : 'not-shading']

  return <div className={classes.join(' ')} {...rest} />
}
