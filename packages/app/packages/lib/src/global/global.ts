import * as update from '../lib/update'
import * as msgs from '../msgs'
import { paramsOps } from '../ops/params'
import { Chunk, Effect, Queue, pipe } from 'effect'

export const appMsgQueue = pipe(
  Queue.unbounded<msgs.Msg>(),
  Effect.runSync,
  Effect.succeed
)

export const postMsg = (msg: msgs.Msg) => update.postMsg(appMsgQueue, msg)

export const postMsgSync = (msg: msgs.Msg) =>
  update.postMsgSync(appMsgQueue, msg)

//
// Scroll / scale event handlers
//

let locked: boolean = false
let lockTimer: null | number = null
let busyTimer: null | number = null

type GlobalMsg = 'lock' | 'unlock'

export const globalMsgQueue = pipe(
  Queue.unbounded<GlobalMsg>(),
  Effect.runSync,
  Effect.succeed
)

const GLOBAL_MESSAGE_EVENT_TAG = 'global-msg'

function processGlobalMessages() {
  return Effect.gen(function* (_) {
    const queue = yield* _(globalMsgQueue)
    const msgs = yield* _(Queue.takeAll(queue))
    const cmds = pipe(msgs, Chunk.reverse, Chunk.map(processGlobalMsg))
    yield* _(Effect.all(cmds))
  })
}

function processGlobalMsg(msg: GlobalMsg) {
  return Effect.sync(
    msg === 'lock'
      ? () => lock()
      : () => {
          lockUi()
          startLockTimer()
        }
  )
}

window.addEventListener('message', (ev) => {
  if (ev.data?._tag === GLOBAL_MESSAGE_EVENT_TAG) {
    Effect.runSync(processGlobalMessages())
  }
})

export function globalPostMsg(msg: GlobalMsg) {
  return Effect.gen(function* (_) {
    const queue = yield* _(globalMsgQueue)
    yield* _(queue.offer(msg))
    window.postMessage({ _tag: GLOBAL_MESSAGE_EVENT_TAG })
  })
}

export function visualViewportHandler() {
  if (locked) {
    console.error('VisualViewport event locked!')
    return
  }
  lock()
  lockUi()
  startLockTimer()
}

export function addVisualViewportHandler() {
  window.visualViewport?.addEventListener('scroll', visualViewportHandler)
  //window.visualViewport?.addEventListener('resize', visualViewportHandler)
  window.addEventListener('wheel', visualViewportHandler)
}

export function removeVisualViewportHandler() {
  window.visualViewport?.removeEventListener('scroll', visualViewportHandler)
  //window.visualViewport?.removeEventListener('resize', visualViewportHandler)
  window.removeEventListener('wheel', visualViewportHandler)
}

function startLockTimer() {
  if (lockTimer !== null) {
    clearTimeout(lockTimer)
    lockTimer = null
  }
  if (busyTimer !== null) {
    clearTimeout(busyTimer)
    busyTimer = null
  }
  lockTimer = window.setTimeout(() => {
    lockTimer = null
    unlockUi()
    unlock()
  }, paramsOps.LOCK_TIMEOUT)
  busyTimer = window.setTimeout(() => {
    busyTimer = null
    unbusyUi()
  }, paramsOps.BUSY_TIMEOUT)
}

function lock() {
  locked = true
  removeVisualViewportHandler()
}

function unlock() {
  addVisualViewportHandler()
  locked = false
}

function lockUi() {
  postMsgSync(msgs.UiLock('started'))
  postMsgSync(msgs.UiBusy('started'))
}

function unlockUi() {
  postMsgSync(msgs.UiLock('expired'))
}

function unbusyUi() {
  postMsgSync(msgs.UiBusy('expired'))
}

//
// root background color
//

export function setRootBackgroundColor(color?: string) {
  const root: HTMLElement | null = document.querySelector(':root')
  if (root && color) {
    root.style.backgroundColor = color
  }
}
