import { locsOps } from './ops/locs'
import { Loc } from './types/loc'

export const namesToLocs = (names: string[]): { name: string; loc: Loc }[] => {
  return names.flatMap((name) =>
    !(name in locsOps.locs) ? [] : [{ name, loc: locsOps.locs[name] }]
  )
}
