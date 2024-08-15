import { useCallback, useRef, useState } from 'react'

export function useCounter() {
  const [count, setCount] = useState(0)

  const inc = useCallback(() => {
    setCount(count + 1)
  }, [count])

  const ainc = useCallback(async () => inc(), [inc])

  const sinc = useCallback(() => setTimeout(() => inc(), 100), [inc])

  return {
    count,
    setCount,
    inc,
    ainc,
    sinc,
  }
}

export function useCounterRef() {
  const counter = useRef(0)

  const inc = useCallback(() => {
    counter.current = counter.current + 1
  }, [])

  const ainc = useCallback(async () => inc(), [inc])

  const sinc = useCallback(() => setTimeout(() => inc(), 100), [inc])

  return {
    counter,
    inc,
    ainc,
    sinc,
  }
}
