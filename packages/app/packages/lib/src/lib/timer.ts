import { MutableRefObject, useCallback, useRef } from 'react'

interface TimerImpl {
  id: number | null
  msec: number | null
  done: (() => void) | null
}

export interface TimerReturn {
  timer: MutableRefObject<undefined | TimerImpl>
  start: (msec: number, done: () => void) => boolean
  stop: () => boolean
  reset: () => boolean
}

/*
export class Timer {
  private timer: TimerImpl
  constructor() {
    this.timer = {
      id: null,
      msec: null,
      done: null,
    }
  }
  private rearm() {}
  public start() {}
  public reset() {}
  public stop() {}
}
*/

export function useTimer(): TimerReturn {
  const timer = useRef<TimerImpl>()

  const rearm = useCallback((msec: number, done: () => void) => {
    const x = {
      id: window.setTimeout(() => {
        if (timer.current?.id) {
          timer.current.done?.()
          timer.current = undefined
        } else {
          console.error('timer not defined!')
        }
      }, msec),
      msec,
      done,
    }
    if (timer.current?.id) {
      clearTimeout(timer.current.id)
    }
    timer.current = x
  }, [])

  const start = useCallback(
    (msec: number, done: () => void): boolean => {
      if (!timer.current) {
        rearm(msec, done)
        return true
      }
      return false
    },
    [rearm]
  )

  const reset = useCallback((): boolean => {
    if (timer.current?.msec && timer.current?.done) {
      rearm(timer.current.msec, timer.current.done)
      return true
    }
    return false
  }, [rearm])

  const stop = useCallback((): boolean => {
    if (timer.current?.id) {
      clearTimeout(timer.current.id)
      timer.current = undefined
      return true
    }
    return false
  }, [])

  return {
    timer,
    start,
    reset,
    stop,
  }
}
