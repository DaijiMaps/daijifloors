import { pipe, Match } from 'effect'

const opacityValues = [{}, { opacity: `0` }, { opacity: `1` }]

export function makeOpacityStyle(vis: number) {
  return pipe(
    Match.value(vis),
    Match.whenAnd(0, () => opacityValues[0]),
    Match.whenAnd(1, () => opacityValues[1]),
    Match.whenAnd(2, () => opacityValues[2]),
    Match.orElse(() => opacityValues[0])
  )
}
