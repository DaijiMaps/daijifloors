import { Elems, getElemRectRef, setElemsRef } from './elems'
import { GetRect } from './rects'
import { Word, spanId } from './word'
import { Fragment, forwardRef, useImperativeHandle, useRef } from 'react'

export const HtmlSpans = forwardRef<
  GetRect,
  { fontSize?: number; words: Word[] }
>((props, forwardedRef) => {
  const ref = useRef<Elems<HTMLSpanElement>>({})

  useImperativeHandle(forwardedRef, () => getElemRectRef(ref))

  return (
    <>
      {props.words.map((w, i) => (
        <Fragment key={i}>
          {w.t === 'break' ? (
            <br />
          ) : (
            <>
              {w.i !== 0 && ' '}
              <span
                ref={setElemsRef(ref)}
                id={props.fontSize ? spanId(props.fontSize, w.i) : undefined}
              >
                {w.s}
              </span>
            </>
          )}
        </Fragment>
      ))}
    </>
  )
})
