type Bound = 2 | 1 | 0 | -1 | -2

export function calc_bound(A: number, a: number, l: number): Bound {
  if (A > a) {
    if (A / a >= 1 / l) {
      return 2
    } else {
      return 1
    }
  } else if (A < a) {
    if (a / A >= 1 / l) {
      return -2
    } else {
      return -1
    }
  } else {
    return 0
  }
}

// area
const LIMIT = 0.5

// fit the given menu rect to visual viewport (screen)
export function fit_by_area(
  W: number,
  H: number,
  w: number,
  h: number,
  limit?: number
) {
  const A = W / H
  const a = w / h
  const l = limit ?? LIMIT
  const R = W * H * l

  switch (calc_bound(A, a, l)) {
    case 2:
      return {
        w: H * a,
        h: H,
      }
    case 1:
      return {
        w: Math.sqrt(R * a),
        h: Math.sqrt(R / a),
      }
    case 0:
      return {
        w: W * Math.sqrt(l),
        h: H * Math.sqrt(l),
      }
    case -1:
      return {
        w: Math.sqrt(R * a),
        h: Math.sqrt(R / a),
      }
    case -2:
      return {
        w: W,
        h: W / a,
      }
  }
}
