import { rnd3 } from './common'
import { HtmlResult } from './html-frame'
import { Result } from './model'
import { SvgResult } from './svg-frame'

export function ShowResult(result: Result) {
  return (
    <div className="result">
      <div
        style={{
          margin: '1em',
          width: '100vw',
        }}
      >
        <p>
          text: <span className="result-text">{result.text}</span>
        </p>
        <p>
          font size:{' '}
          <span className="result-font-size">{result.checks.fontSize}</span>
        </p>
        <p>
          total area:{' '}
          <span className="result-total-area">
            {rnd3(result.checks.area.totalArea)}
          </span>
        </p>
        {result.locWords.map((lw, i) => (
          <p key={i}>
            span {i}: "{lw.s}" @ ({rnd3(lw.dx)}, {rnd3(lw.dy)})
          </p>
        ))}
      </div>
      <HtmlResult {...result} />
      <SvgResult {...result} />
    </div>
  )
}
