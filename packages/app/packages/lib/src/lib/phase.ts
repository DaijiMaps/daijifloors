import { useCallback, useEffect, useRef, useState } from 'react'

export type Phase = 'initial' | 'preparing' | 'changing' | 'finished'

export function usePhase() {
  const [phase, setPhase] = useState<Phase>('initial')
  const done = useRef<boolean>(false)

  useEffect(() => {
    if (done.current) {
      return
    }
    if (phase === 'finished') {
      setPhase('initial')
    }
    if (phase === 'initial') {
      requestAnimationFrame(() => setPhase('preparing'))
    }
    if (phase === 'preparing') {
      requestAnimationFrame(() => setPhase('changing'))
    }
  }, [phase, setPhase])

  const onFinish = useCallback(() => {
    setPhase('finished')
    done.current = true
  }, [setPhase])

  return {
    phase: phase,
    onFinish,
  }
}
