/*
 * Word (span or br)
 */

type WordSpan = {
  t: 'span'
  s: string
  i: number
}

type WordBreak = {
  t: 'break'
}

export type Word = WordSpan | WordBreak

export interface LocWord {
  dx: number
  dy: number
  s: string
  i: number
}

export const spanId = (sz: number, i: number) => `html-span-f${sz}-${i + 1}`
export const tspanId = (sz: number, i: number) => `svg-tspan-f${sz}-${i + 1}`

// 'a b//c' => <span>a</span> <span>b</span> <br/> <span>c</span>
// 'a b__c' => <span>a</span> <span>b c</span>
export function parseTextToWords(text: string) {
  let x = -1
  return text.split(' ').flatMap((s) => {
    return s.split('//').flatMap((ss, i) => {
      x = x + 1
      const w: WordSpan = { t: 'span', s: ss.replace(/__/g, ' '), i: x }
      const b: WordBreak = { t: 'break' }
      return i === 0 ? [w] : [b, w]
    })
  })
}

// merge loc-words on the same line (y, height) into one span
function mergeLocs(locs: LocWord[]): LocWord[] {
  const dys = new Set(locs.map((loc) => loc.dy))
  const mergedLocs = Array.from(dys.keys()).map((dy, i) => {
    const s = locs.flatMap((loc) => (loc.dy === dy ? [loc.s] : [])).join(' ')
    return { s, i, dx: 0, dy }
  })
  return mergedLocs
}

export function collectLocs(
  words: Word[],
  html: DOMRect[],
  svg: DOMRect[]
): LocWord[] {
  const locs = words.flatMap((w) => {
    if (w.t === 'span') {
      const { s, i } = w
      const hr = html[i]
      const sr = svg[i]
      const dx = hr.left - sr.left
      const dy = hr.top - sr.top
      return [{ s, i, dx, dy }]
    } else {
      return []
    }
  })
  return mergeLocs(locs)
}
