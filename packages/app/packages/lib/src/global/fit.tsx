import { Fit } from '../fit/Fit.tsx'
import * as global from '../global/global.ts'
import * as update from '../lib/update'
import * as msgs from '../msgs'
import '../root.css'
import { Effect } from 'effect'
import React from 'react'
import ReactDOM from 'react-dom/client'

window.addEventListener(
  'load',
  () => {
    setTimeout(() => update.postMsgSync(global.appMsgQueue, msgs.Init({})), 100)
    global.addVisualViewportHandler()
  },
  {
    once: true,
  }
)

function render() {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('<root> not found!')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Fit text="" width="150" done={() => {}} />
    </React.StrictMode>
  )
}

Effect.runSync(
  Effect.sync(() => {
    render()
  })
)
