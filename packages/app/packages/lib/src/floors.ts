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

function getName(idx: number) {
  const names = getFloorNames()
  const name = names[idx]
  return {
    name,
    prev:
      idx === 0
        ? undefined
        : {
            idx: idx - 1,
            name: names[idx - 1],
          },
    next:
      idx > names.length - 1
        ? undefined
        : {
            idx: idx + 1,
            name: names[idx + 1],
          },
  }
}

export function getFloorInfo(idx: number): FloorInfo {
  const { name, prev, next } = getName(idx)
  const categories = floorsOps.floors[name].categories
  const shopNames = floorsOps.floors[name].shopNames
  const backgroundColor = floorsOps.floors[name].backgroundColor

  return {
    name,
    prev,
    next,
    categories,
    shopNames,
    backgroundColor,
  }
}
