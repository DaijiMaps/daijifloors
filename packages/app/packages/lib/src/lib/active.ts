import { useCallback, useState } from 'react'

export interface ActiveImpl {
  activate: () => boolean
  deactivate: () => void
  active: boolean
}

export class Active {
  private active: boolean
  private reset: () => void
  constructor(reset: () => void) {
    this.active = false
    this.reset = reset
  }
  public activate() {
    const activated = !this.active
    if (this.active) {
      this.reset()
    } else {
      this.active = true
    }
    // return true if successfully activated
    return activated
  }
  public deactivate() {
    const deactivated = this.active
    this.active = false
    // return true if successfully deactivated
    return deactivated
  }
}

export function useActive(reset: () => void): ActiveImpl {
  const [active, setActive] = useState(false)

  const activate = useCallback(() => {
    if (active) {
      reset()
    } else {
      setActive(true)
    }
    // return true if successfully activated
    return !active
  }, [active, reset, setActive])

  const deactivate = useCallback(() => {
    setActive(false)
    // return true if successfully deactivated
    return active
  }, [setActive])

  return {
    activate,
    deactivate,
    active,
  }
}
