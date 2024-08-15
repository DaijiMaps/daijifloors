import type { LayoutProps } from './Layout'
import { Checks } from './check'
import { Rects } from './rects'
import { LocWord, Word, parseTextToWords } from './word'
import { useEffect, useState } from 'react'

export interface Model {
  text: string
  words: Word[]
  locWords: LocWord[]

  frame: DOMRect | null
  html: Spans
  svg: Spans

  checks: Checks | null
}

export interface Spans {
  ids: Set<string> | null
  rects: Rects | null
}

const defaultModel: Model = {
  text: 'Theory luxe',
  words: parseTextToWords('Theory luxe'),
  locWords: [],
  frame: null,
  html: { ids: null, rects: null },
  svg: { ids: null, rects: null },
  checks: null,
}

export interface Result {
  text: string
  words: Word[]
  locWords: LocWord[]
  checks: Checks
}

export function useLayout(props: LayoutProps): Model {
  const [count, setCount] = useState<number>(0)
  const [model] = useState<Model>({
    ...defaultModel,
    text: props.text ?? defaultModel.text,
    words: parseTextToWords(props.text ?? defaultModel.text),
  })

  useEffect(() => {
    // XXX cycle a few re-renderings to progress
    // XXX otherwise get stuck
    if (count < 3) {
      setCount(count + 1)
    }
  }, [count])

  return model
}
