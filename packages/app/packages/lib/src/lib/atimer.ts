import { TimerChange } from '../types/timer'
import { ActiveImpl, useActive } from './active'
import { TimerReturn, useTimer } from './timer'
import { useCallback } from 'react'

interface ActiveTimerImpl {
  timer: TimerReturn
  active: ActiveImpl
  start: () => boolean
  reset: () => void
  stop: () => void
}

/*
export class ActiveTimer {
  //private timer: Timer
  private active: Active
  constructor() {
    this.active = new Active(this.reset)
  }
  public stop() {}
  public reset() {}
  public start() {}
}
*/

export function useActiveTimer(
  onChange: (change: TimerChange) => void,
  timeout: number
): ActiveTimerImpl {
  const timer = useTimer()

  const active = useActive(timer.reset)

  const stop = useCallback(() => {
    if (active.active) {
      timer.stop()
      active.deactivate()
      onChange('stopped')
    }
  }, [active, onChange, timer])

  const reset = useCallback(() => {
    if (active.active) {
      timer.reset()
      onChange('reset')
    }
  }, [active, onChange, timer])

  const start = useCallback(() => {
    let started = false
    if (active.activate()) {
      started = true
      onChange('started')
      timer.start(timeout, () => {
        timer.stop()
        active.deactivate()
        onChange('expired')
      })
    } else {
      reset()
    }
    return started
  }, [active, onChange, reset, timeout, timer])

  return {
    timer,
    active,
    start,
    reset,
    stop,
  }
}
