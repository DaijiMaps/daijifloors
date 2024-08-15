import { headerOps } from '../ops/header'
import './Header.css'
import { HTMLProps } from 'react'

export interface HeaderProps {
  title: string
}

export function Header(props: HeaderProps & HTMLProps<HTMLDivElement>) {
  const { ...rest } = props

  return (
    <div {...rest}>
      {headerOps.images.map((imageConfig, i) => (
        <img key={i} {...imageConfig} />
      ))}
    </div>
  )
}

export default Header
