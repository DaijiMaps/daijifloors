import './Footer.css'
import { HTMLProps } from 'react'

export interface FooterProps {}

export function Footer(props: FooterProps & HTMLProps<HTMLDivElement>) {
  const { ...rest } = props

  return <div {...rest} />
}

export default Footer
