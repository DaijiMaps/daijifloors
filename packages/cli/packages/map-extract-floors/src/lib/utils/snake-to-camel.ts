const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const snakeToCamel = (k: string) => {
  if (k.match(/^.*-.*$/)) {
    return k
      .split(/-/)
      .map((s, i) => (i === 0 ? s : capitalize(s)))
      .join('')
  }
  return k
}
