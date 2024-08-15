import { Params } from '../types/url-params'

export function getParams(): Params {
  const url = new URL(window.location.href)
  const search = new URLSearchParams(url.search)
  return {
    floorIdx: getNumber(search, 'floorIdx'),
    r: getNumber(search, 'r'),
    shopName: getString(search, 'shopName'),
  }
}

function getNumber(search: URLSearchParams, name: string): number | undefined {
  const res = search.get(name)
  return res === null ? undefined : Number(res)
}

function getString(search: URLSearchParams, name: string): string | undefined {
  const res = search.get(name)
  return res === null ? undefined : res
}
