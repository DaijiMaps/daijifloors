export function loopAnimationFrame(
  cond: () => boolean,
  done: () => void,
  maxretry: number,
  retry?: number
) {
  requestAnimationFrame(() => {
    if (cond()) {
      done()
    } else if (retry && retry === maxretry) {
      throw new Error('loopAnimationFrame: max retry')
    } else {
      loopAnimationFrame(cond, done, maxretry, (retry ?? 0) + 1)
    }
  })
}
