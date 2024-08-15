import type { Direction } from './direction'
import type { Phase } from './phase'
import { pipe, Match } from 'effect'

const invVis = (dir: Direction) => (vis: number) => {
  return dir === 'in' ? vis : 3 - vis
}

export function getVisibility(dir: Direction, phase: Phase): number {
  const inv = invVis(dir)
  const vis = pipe(
    Match.value({
      dir,
      phase,
    }),
    Match.whenAnd({ dir: 'none' }, () => inv(0)),
    Match.when({ phase: 'initial' }, () => inv(0)),
    Match.when({ phase: 'preparing' }, () => inv(1)),
    Match.when({ phase: 'changing' }, () => inv(2)),
    Match.when({ phase: 'finished' }, () => inv(3)),
    Match.orElse(() => inv(0))
  )
  return vis
}
