import { HeaderImage } from '../types/header'

export interface HeaderOps {
  images: HeaderImage[]
}

export const headerOps: HeaderOps = {
  images: [],
}

export const installHeaderOps = (x: HeaderOps) => {
  headerOps.images = x.images
}
