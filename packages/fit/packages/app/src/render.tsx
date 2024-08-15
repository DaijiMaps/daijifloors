import { Fit } from './lib/Fit.tsx'
import './root.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

export function render() {
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
