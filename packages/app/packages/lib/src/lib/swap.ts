import type { Direction } from './direction'
import type { Phase } from './phase'
import { Option, Match } from 'effect'
import { useCallback, useEffect, useState } from 'react'

export interface Swap {
  prev: Option.Option<number>
  now: number
}

function getExists(swap: Swap, idx: number): boolean {
  return Match.value({ swap }).pipe(
    Match.whenOr(
      { swap: { prev: Option.some(idx) } },
      { swap: { now: idx } },
      () => true
    ),
    Match.orElse(() => false)
  )
}

function getDirection(swap: Swap, idx: number): Direction {
  const c = Option.contains(idx)
  return swap.now === idx ? 'in' : c(swap.prev) ? 'out' : 'none'
}

export function useSwap(floorIndex: number, stop: boolean) {
  const [swap, setSwap] = useState<Swap>({
    prev: Option.none(),
    now: floorIndex,
  })
  const [phase, setPhase] = useState<Phase>('initial')

  const exists = useCallback(
    (idx: number): boolean => {
      return getExists(swap, idx)
    },
    [swap]
  )

  const dir = useCallback(
    (idx: number): Direction => {
      return getDirection(swap, idx)
    },
    [swap]
  )

  useEffect(() => {
    if (floorIndex !== swap.now && !stop) {
      setPhase('preparing')
      setSwap({
        now: floorIndex,
        prev: Option.some(swap.now),
      })
      requestAnimationFrame(() => {
        setPhase('changing')
      })
    }
  }, [floorIndex, stop, swap])

  useEffect(() => {
    if (Option.isSome(swap.prev) && stop) {
      setPhase('finished')
      setSwap({ ...swap, prev: Option.none() })
    }
  }, [swap, stop])

  return {
    exists,
    dir,
    phase,
  }
}
