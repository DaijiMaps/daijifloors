import './Fit.css'
import { Layout } from './Layout'
import { FitContext } from './context'
import { Result } from './model'
import { ShowResult } from './result'
import { useCallback, useState } from 'react'

export interface FitProps {
  text: string
  width: string
  done: (result: Result) => void
}

interface FitModel {
  width: string
  text: string
  start: boolean
  result: Result | null
  count: number
}

type UpdateMoodel = (m: Partial<FitModel>) => void

function useFit(p: FitProps): [FitModel, UpdateMoodel] {
  const [model, setModel] = useState<FitModel>({
    width: p.width,
    text: p.text,
    start: false,
    result: null,
    count: 0,
  })

  const updateModel = useCallback(
    (m: Partial<FitModel>) => {
      setModel((prev) => ({
        ...prev,
        ...m,
      }))
    },
    [setModel]
  )

  return [model, updateModel]
}

export function Fit(p: FitProps) {
  const [model, updateModel] = useFit(p)

  return (
    <>
      <div
        className="fit"
        style={{
          margin: '1em',
        }}
      >
        <div className="form">
          <input
            className="fit-text"
            type="text"
            name="text"
            value={model.text}
            onInput={(ev) => updateModel({ text: ev.currentTarget.value })}
          />{' '}
          <input
            className="fit-width"
            type="text"
            name="width"
            value={model.width}
            onInput={(ev) => updateModel({ width: ev.currentTarget.value })}
          />{' '}
          <input
            className="fit-start-stop"
            type="button"
            name="startstop"
            value={!model.start ? 'start' : 'stop'}
            onClick={() => updateModel({ start: true })}
          />{' '}
          <input
            className="fit-clear"
            type="button"
            name="clear"
            value={'clear'}
            onClick={() => {
              updateModel({
                text: '',
                width: '',
                result: null,
              })
            }}
          />
        </div>
        <FitContext.Provider value={{ W: Number(model.width) }}>
          {model.result && <ShowResult {...model.result} />}
          {model.start && (
            <Layout
              text={model.text}
              done={(result) => {
                updateModel({
                  start: false,
                  result,
                  count: model.count + 1,
                })
                p.done(result)
              }}
            />
          )}
        </FitContext.Provider>
      </div>
    </>
  )
}
