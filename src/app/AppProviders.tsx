import type { PropsWithChildren } from 'react'
import { ProgramsProvider } from '../features/programs/context/ProgramsProvider'

export function AppProviders({ children }: PropsWithChildren) {
  return <ProgramsProvider>{children}</ProgramsProvider>
}
