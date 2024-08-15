import * as modelCmd from './update-model-cmd'
import * as process from './update-process'
import { Effect, pipe } from 'effect'
import * as Chunk from 'effect/Chunk'
import * as Queue from 'effect/Queue'
import { useEffect, useRef, useState } from 'react'

export type Cmd = Effect.Effect<void>
export type SetCounter = (f: (n: number) => number) => void

export interface BaseMsg {
  _tag: 'baseMsg'
}
export interface BaseModel {
  _tag: 'baseModel'
}

export type MapModel<UserModel extends BaseModel> = (m: UserModel) => UserModel
export type SetModel<UserModel extends BaseModel> = (
  f: MapModel<UserModel>
) => void

export type MsgQueue<UserMsg extends BaseMsg> = Effect.Effect<
  Queue.Queue<UserMsg>,
  never,
  never
>

type Handler = (ev: MessageEvent) => void

export interface Config<UserMsg extends BaseMsg, UserModel extends BaseModel> {
  msgCount: number
  msgQueue: MsgQueue<UserMsg>
  postMsgSync: (msg: UserMsg) => void
  processMsg: process.ProcessMsg<UserMsg, UserModel>
}

//
// MESSAGE
//

const APP_MESSAGE_EVENT_TAG = 'app-msg'

function checkMsg(ev: MessageEvent): boolean {
  return ev.data?._tag === APP_MESSAGE_EVENT_TAG
}

export function postMsg<UserMsg extends BaseMsg>(
  msgQueue: MsgQueue<UserMsg>,
  msg: UserMsg
): Effect.Effect<void> {
  return Effect.gen(function* (_) {
    const queue = yield* _(msgQueue)
    yield* _(queue.offer(msg))
    window.postMessage({ _tag: APP_MESSAGE_EVENT_TAG })
  })
}

export function postMsgSync<UserMsg extends BaseMsg>(
  msgQueue: MsgQueue<UserMsg>,
  msg: UserMsg
): void {
  Effect.runSync(postMsg(msgQueue, msg))
}

//
// MERGE
//

function mergeUpdates<UserMsg extends BaseMsg, UserModel extends BaseModel>(
  config: Config<UserMsg, UserModel>,
  model: UserModel
): Effect.Effect<modelCmd.UpdateModel<UserModel>> {
  return Effect.gen(function* (_) {
    const queue = yield* _(config.msgQueue)
    const msgs = yield* _(Queue.takeAll(queue))
    const procs = pipe(
      msgs,
      Chunk.reverse,
      Chunk.map((msg: UserMsg) =>
        pipe(
          config.processMsg(msg)(model),
          process.processUpdateModelCommand,
          Effect.runSync
        )
      )
    )
    yield* _(
      pipe(
        procs,
        Chunk.map((proc) => proc.cmd),
        Effect.all,
        Effect.forkDaemon
      )
    )
    return (model: UserModel) =>
      pipe(
        procs,
        Chunk.filterMap((proc) => proc.updateModel),
        Effect.reduce(model, (prevModel, updateModel) => updateModel(prevModel))
      )
  })
}

function runProcess<UserMsg extends BaseMsg, UserModel extends BaseModel>(
  config: Config<UserMsg, UserModel>,
  model: UserModel,
  setModel: SetModel<UserModel>
): Promise<void> {
  return Effect.runPromise(
    mergeUpdates<UserMsg, UserModel>(config, model)
  ).then((updateModel) =>
    setModel((prevModel) => Effect.runSync(updateModel(prevModel)))
  )
}

// React hooks

function useMessage() {
  const [counter, setCounter] = useState<number>(0)
  const handlerRef = useRef<Handler>()

  useEffect(() => {
    if (handlerRef.current) {
      return
    }
    function handler(ev: MessageEvent) {
      if (checkMsg(ev)) {
        setCounter((n) => n + 1)
      }
    }
    window.addEventListener('message', handler)
    handlerRef.current = handler
  }, [setCounter])

  return {
    counter,
  }
}

function useProcess<UserMsg extends BaseMsg, UserModel extends BaseModel>(
  config: Config<UserMsg, UserModel>,
  model: UserModel,
  setModel: SetModel<UserModel>,
  counter: number
): void {
  const counterRef = useRef<number>(0)

  useEffect(() => {
    counterRef.current = counter
    runProcess(config, model, setModel)
  }, [config, counter, counterRef, model, setModel])
}

export function useUpdate<UserMsg extends BaseMsg, UserModel extends BaseModel>(
  config: Config<UserMsg, UserModel>,
  model: UserModel,
  setModel: SetModel<UserModel>
): void {
  const { counter } = useMessage()

  useProcess(config, model, setModel, counter)
}
