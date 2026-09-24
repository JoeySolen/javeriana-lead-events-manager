import { createContext, useContext } from 'react'
import type { Program } from '../types'

export type ProgramsState =
  | { status: 'loading' }
  | { status: 'success'; programs: Program[] }
  | { status: 'error'; message: string }

export const ProgramsContext = createContext<{
  state: ProgramsState
  reload: () => void
} | null>(null)

export function usePrograms() {
  const context = useContext(ProgramsContext)
  if (!context) throw new Error('usePrograms requiere ProgramsProvider.')
  return context
}
