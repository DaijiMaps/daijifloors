import './Footer.css'
import { HTMLProps } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FooterProps {}

export function Footer(props: FooterProps & HTMLProps<HTMLDivElement>) {
  const { ...rest } = props

  return <div {...rest} />
}

export default Footer
