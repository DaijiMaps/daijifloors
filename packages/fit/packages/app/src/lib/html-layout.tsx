import { Checks } from './check'
import { HtmlFrame } from './html-frame'
import { Word } from './word'
import { Fragment, useCallback, useEffect, useState } from 'react'

const FONT_SIZE_MAX = 40
const FONT_SIZE_MIN = 10
const N_FONT_SIZES = FONT_SIZE_MAX - FONT_SIZE_MIN + 1 // inclusive

const fontSizes = Array(N_FONT_SIZES)
  .fill(0)
  .map((_, i) => FONT_SIZE_MAX - i)

export interface HtmlFramesProps {
  words: Word[]
  done?: (checks: Checks) => void
}

function useHtmlFrames(props: HtmlFramesProps) {
  const [checks, setChecks] = useState<(Checks | null)[]>(
    Array(N_FONT_SIZES).fill(null)
  )
  const [best, setBest] = useState<Checks | null>(null)

  const done = useCallback(
    (i: number) => (c: Checks) => {
      checks[i] = c
      setChecks(checks)
    },
    [checks]
  )

  useEffect(() => {
    if (best !== null) {
      return
    }
    if (checks.filter((x) => x !== null).length !== N_FONT_SIZES) {
      return
    }
    let b: Checks | null = null
    for (const c of checks) {
      if (c !== null && c.all) {
        b = c
        break
      }
    }
    if (b) {
      setBest(b)
      if (props.done) {
        props.done(b)
      }
    }
  }, [best, checks, props])

  return {
    done,
  }
}

export function HtmlFrames(props: HtmlFramesProps) {
  const { done } = useHtmlFrames(props)

  return (
    <div>
      {fontSizes.map((sz, i) => (
        <Fragment key={i}>
          <HtmlFrame fontSize={sz} words={props.words} done={done(i)} />
        </Fragment>
      ))}
    </div>
  )
}
