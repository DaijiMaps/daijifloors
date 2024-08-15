import App from '../react/App.tsx'
import '../root-config.css'
import '../root.css'
import { Params } from '../types/url-params.ts'
import React from 'react'
import ReactDOM from 'react-dom/client'

export function render(params: Params) {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('<root> not found!')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App params={params} />
    </React.StrictMode>
  )
}
