import * as update from '../lib/update'
import { getParams } from '../lib/url-params'
import * as msgs from '../msgs'
import * as global from './global'
import { render } from './render'

let windowInnerWidth = window.innerWidth

function main() {
  window.addEventListener(
    'load',
    () => {
      const params = getParams()
      // XXX initial command decided by params
      // XXX e.g. selecting a shop
      setTimeout(
        () => update.postMsgSync(global.appMsgQueue, msgs.Init(params)),
        100
      )
      document.body.addEventListener('click', (ev) => {
        ev.stopPropagation()
        update.postMsgSync(global.appMsgQueue, msgs.MapClick())
      })
      window.visualViewport?.addEventListener('resize', (ev) => {
        ev.stopPropagation()
        update.postMsgSync(global.appMsgQueue, msgs.Resize())
      })
      global.addVisualViewportHandler()
      render(params)
    },
    {
      once: true,
    }
  )

  window.addEventListener('resize', () => {
    // detect only width change
    if (windowInnerWidth !== window.innerWidth) {
      windowInnerWidth = window.innerWidth
      // reset mode to default
      // XXX maybe reset only xys to re-draw balloon correctly?
      update.postMsgSync(global.appMsgQueue, msgs.ModeSelect({ _: 'default' }))
    }
  })
}

export { main }
