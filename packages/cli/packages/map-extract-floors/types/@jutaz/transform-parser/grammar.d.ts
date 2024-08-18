export let Lexer: unknown
export let ParserRules: (
  | {
      name: string
      symbols: string[]
      postprocess: (d: unknown) => unknown
    }
  | {
      name: string
      symbols: (string | RegExp)[]
      postprocess: (d: unknown) => unknown[]
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
          }
      )[]
      postprocess?: undefined
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
          }
      )[]
      postprocess: (d: unknown) => number
    }
  | {
      name: string
      symbols: (string | RegExp)[]
      postprocess?: undefined
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
            pos: number
          }
      )[]
      postprocess: (d: unknown) => {
        type: string
        matrix: unknown[]
      }
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
            pos: number
          }
      )[]
      postprocess?: undefined
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
            pos: number
          }
      )[]
      postprocess: (d: unknown) => {
        type: string
        x: unknown
        y: unknown
      }
    }
  | {
      name: string
      symbols: (
        | RegExp
        | {
            literal: string
          }
      )[]
      postprocess: (e: unknown) => unknown
    }
  | {
      name: string
      symbols: (
        | string
        | {
            literal: string
            pos: number
          }
      )[]
      postprocess: (d: unknown) => {
        type: string
        value: unknown
      }
    }
)[]
export let ParserStart: string
