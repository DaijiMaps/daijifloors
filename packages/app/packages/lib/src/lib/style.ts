export const topTransformOriginStyle = () => ({
  transformOrigin: 'left top',
})

export const bottomTransformOriginStyle = () => ({
  transformOrigin: 'left bottom',
})

export const topTransformStyle = (p: {
  x: number
  y: number
  s: number
  vis: number
}) => ({
  transform: `
translateX(calc(50% / ${p.s}))
translate(${p.x}px, ${p.y}px)
scale(${p.vis < 2 ? 0 : 1})
scale(${1 / p.s})
translateX(-50%)
`,
})

export const bottomTransformStyle = (p: {
  x: number
  y: number
  h: number
  H: number
  s: number
  vis: number
}) => ({
  transform: `
translateX(calc(50% / ${p.s}))
translate(${p.x}px, ${-p.H + p.h + p.y}px)
scale(${p.vis < 2 ? 0 : 1})
scale(${1 / p.s})
translateX(-50%)
`,
})

export const opacityStyle = (p: { vis: number }) => ({
  opacity: p.vis < 2 ? 0 : 1,
})

export const transitionStyle = (p: { vis: number; transition: number }) => ({
  transition: p.vis < 1 ? 'initial' : `${p.transition}ms`,
})
