export const id = (n: number) => {
  return [n]
}
export const dup = (n: number) => {
  return [n, n]
}

export const split = (n: number) => {
  const i = Math.round(n)
  return [i, n - i]
}
