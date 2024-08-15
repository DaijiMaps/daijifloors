import { floorsOps } from './ops/floors'
import { FloorInfo, FloorNames } from './types/floor'

export function getFloorNames(): FloorNames {
  return floorsOps.names
}

export const getFloorNameByIdx = (idx: number) => getFloorNames()[idx]

export function getFloorIdx(floorName: string): number {
  const floorNames = getFloorNames()
  let idx = -1
  for (const s of floorNames) {
    idx = idx + 1
    if (s === floorName) {
      return idx
    }
  }
  // XXX
  return -1
}

export function getFloorInfo(idx: number): FloorInfo {
  const names = getFloorNames()
  const name = names[idx]
  const prevIdx = idx > names.length - 1 ? undefined : idx + 1
  const nextIdx = idx === 0 ? undefined : idx - 1
  const prevName = prevIdx === undefined ? undefined : names[prevIdx]
  const nextName = nextIdx === undefined ? undefined : names[nextIdx]
  const categories = floorsOps.floors[name].categories
  const shopNames = floorsOps.floors[name].shopNames
  const backgroundColor = floorsOps.floors[name].backgroundColor

  return {
    name,
    prev: {
      idx: prevIdx,
      name: prevName,
    },
    next: {
      idx: nextIdx,
      name: nextName,
    },
    categories,
    shopNames,
    backgroundColor,
  }
}
