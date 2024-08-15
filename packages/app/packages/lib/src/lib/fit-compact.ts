export type CompactBinary = string // "010"
export type CompactBoolean = string // [false, true, false]
export type CompactString = string // "a b_c d"
export type CompactArrayABC = string[] // ["a", "b c", "d"]
export type CompactArray = number[][] // [[0], [1, 2], [3]]

const CHAR_CODE_a = 97

export function joinWordsByCompactArray(
  ca: CompactArray,
  words: string[]
): string[] {
  return ca.map((idxs) => idxs.map((idx) => words[idx]).join(' '))
}

export function compactStringToCompactArray(cs: string): CompactArray {
  return cs
    .split(/ /)
    .map((w) => w.split(/_/))
    .map((aa) => aa.map((a) => a.charCodeAt(0) - CHAR_CODE_a))
}

export function compactArrayToCompactString(ca: CompactArray): CompactString {
  return ca
    .map((nn) => nn.map((n) => String.fromCharCode(CHAR_CODE_a + n)))
    .map((aa) => aa.join('_'))
    .join(' ')
}

export function compactStringToCompactBinary(cs: string): CompactBinary {
  return cs
    .split(/[a-z]/)
    .slice(1, -1)
    .map((sep) => !!sep.match(/_/))
    .map((n) => (n ? '1' : '0'))
    .join('')
}

export function compactBinaryToCompactString(cb: string): CompactString {
  const cl = cb.split('').map((b) => b !== '0')
  const x = ['a']
  const xs = cl.flatMap((sep, i) => [
    sep ? '_' : ' ',
    String.fromCharCode(CHAR_CODE_a + i + 1),
  ])
  return x.concat(xs).join('')
}
