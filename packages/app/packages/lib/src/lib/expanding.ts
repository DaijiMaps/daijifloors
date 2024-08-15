import { useCallback, useEffect, useState } from 'react'

export interface ExpandingResult {
  phase: ExpandingPhase
  start: (scale: number) => void
  stop: () => void
}

export type ExpandingPhase =
  | { _: 'closed' }
  | { _: 'expanding'; scale: number }
  | { _: 'opened' }

export function useExpanding(scale?: number): ExpandingResult {
  const [phase, setPhase] = useState<ExpandingPhase>({
    _: 'closed',
  })

  useEffect(() => {
    if (phase._ === 'closed') {
      if (scale !== undefined) {
        setPhase({
          _: 'expanding',
          scale,
        })
      }
    }
    if (phase._ === 'expanding') {
      if (phase.scale !== 1) {
        requestAnimationFrame(() => {
          if (phase.scale !== 1) {
            setPhase({
              ...phase,
              scale: 1,
            })
          }
        })
      }
    }
  }, [phase, scale, setPhase])

  const start = useCallback(
    (scale: number) => {
      if (phase._ === 'closed') {
        setPhase({
          _: 'expanding',
          scale,
        })
      }
    },
    [phase, setPhase]
  )

  const stop = useCallback(() => {
    if (phase._ === 'expanding') {
      setPhase({ _: 'opened' })
    }
  }, [phase, setPhase])

  return {
    phase,
    start,
    stop,
  }
}
