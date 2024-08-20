import { spawnSync } from 'node:child_process'

// Inkscape bounding-box generation (-S)
// format: <id>,<x>,<y>,<w>,<h>

interface Box {
  x: number
  y: number
  width: number
  height: number
}

export const allBoundingBoxes = new Map<string, Box>()

export const parseBoundingBoxCSV = (content: string): void => {
  content
    .split(/\n/)
    .filter((s) => s !== '')
    .filter((s) => s.match(/^[A-Z]/))
    .map((s) => {
      const values = s.split(/,/)
      if (values.length === 5) {
        try {
          const nums = values.slice(1).map(parseFloat)
          allBoundingBoxes.set(values[0], {
            x: nums[0],
            y: nums[1],
            width: nums[2],
            height: nums[3],
          })
        } catch (e) {
          console.log(e)
        }
      }
      return s
    })
  console.log('bb:', allBoundingBoxes)
}

export const generateBoundingBoxCSV = (
  infile: string,
  outdir: string
): string => {
  const res = spawnSync('inkscape', ['-S', infile], {
    cwd: outdir,
  })
  return res.stdout.toString()
}
