import { TimerChange } from '../types/timer'
import { useActiveTimer } from './atimer'
import { useCallback } from 'react'

export class Busy {
  //private lock: ActiveTimer
  //private busy: ActiveTimer
  constructor() {}
  public start() {}
}

export function useBusy(
  timeout: number,
  onLock: (lock: TimerChange) => void,
  onBusy: (busy: TimerChange) => void
) {
  const busy = useActiveTimer((change) => {
    if (change === 'expired') {
      onBusy('expired')
    }
  }, timeout)

  const lock = useActiveTimer((change) => {
    if (change === 'started') {
      onLock('started')
      onBusy('started')
    }
    if (change === 'expired') {
      onLock('expired')
      busy.reset()
    }
  }, timeout / 2)

  const start = useCallback(() => {
    return [lock.start(), busy.start()]
  }, [lock, busy])

  return {
    start,
    lock,
    busy,
  }
}
