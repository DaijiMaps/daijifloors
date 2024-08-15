import * as update from '../lib/update'
import * as msgs from '../msgs'
import { updateConfig } from '../process-msg'
import * as app from '../types/app'
import { createContext } from 'react'

export const UpdateConfigContext =
  createContext<update.Config<msgs.Msg, app.AppContext>>(updateConfig)
