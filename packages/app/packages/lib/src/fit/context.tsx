import { createContext } from 'react'

export const FitContext = createContext<{ W: number }>({ W: 150 })
