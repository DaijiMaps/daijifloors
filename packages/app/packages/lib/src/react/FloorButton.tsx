import './FloorButton.css'
import { FloorCategories } from './FloorCategories'

export interface PrevNextProps {
  _suffix?: 'prev' | 'next'
  _name?: string
  _onClick?: () => void
}

export interface FloorButtonProps {
  _name: string
  _categories?: string[]
  _onButtonClick: () => void
  //_prevName?: string
  //_nextName?: string
  //_onPrevClick?: () => void
  //_onNextClick?: () => void
  _prev?: PrevNextProps
  _next?: PrevNextProps
}

function PrevNext(props: PrevNextProps) {
  return (
    <div
      className={`floor-button-${props._suffix}`}
      onClick={(ev) => {
        ev.stopPropagation()
        props._onClick?.()
      }}
      style={
        props._name === undefined
          ? {
              opacity: 0,
            }
          : {}
      }
    >
      {props._name}
    </div>
  )
}

export function FloorButton(props: FloorButtonProps) {
  return (
    <div className="floor-button" onClick={props._onButtonClick}>
      <div className="floor-button-content">
        {props._prev !== undefined && <PrevNext {...props._prev} />}
        <div className="floor-button-main">
          <FloorCategories
            className="floor-button-categories"
            _categories={props._categories}
          />
          <h2 className="floor-button-title">{props._name}</h2>
        </div>
        {props._next !== undefined && <PrevNext {...props._next} />}
      </div>
    </div>
  )
}

export default FloorButton
