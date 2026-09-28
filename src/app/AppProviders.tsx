import type { PropsWithChildren } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ProgramsProvider } from '../features/programs/context/ProgramsProvider'

// domAnimation covers the opacity/transform/exit animations used here without
// bundling the full motion component; strict rejects accidental `motion.*`.
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation} strict>
      <ProgramsProvider>{children}</ProgramsProvider>
    </LazyMotion>
  )
}
