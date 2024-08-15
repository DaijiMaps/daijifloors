import './Layout.css'
import { Checks } from './check'
import { HtmlFrames } from './html-layout'
import { Result, useLayout } from './model'
import { SvgFrame } from './svg-frame'
import { useState } from 'react'

export interface LayoutProps {
  text?: string
  fontSize?: number
  done?: (result: Result) => void
}

export function Layout(props: LayoutProps) {
  const model = useLayout(props)
  const [best, setBest] = useState<Checks | null>(null)

  return (
    <>
      <HtmlFrames
        words={model.words}
        done={(c) => {
          setBest(c)
        }}
      />
      {best && (
        <SvgFrame
          words={model.words}
          best={best}
          done={(locWords) => {
            if (props.done) {
              const result: Result = {
                // model.text may include '__' or '//'
                text: locWords.map((lw) => lw.s).join(' '),
                words: model.words,
                locWords,
                checks: best,
              }
              props.done(result)
            }
          }}
        />
      )}
    </>
  )
}
