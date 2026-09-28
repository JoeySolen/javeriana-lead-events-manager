import type { PropsWithChildren } from 'react'
import { IconContext } from '@phosphor-icons/react/dist/lib/context'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ProgramsProvider } from '../features/programs/context/ProgramsProvider'

// domAnimation covers the opacity/transform/exit animations used here without
// bundling the full motion component; strict rejects accidental `motion.*`.
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <IconContext.Provider
      value={{
        size: 20,
        weight: 'bold',
        'aria-hidden': true,
        focusable: false,
      }}
    >
      <LazyMotion features={domAnimation} strict>
        <ProgramsProvider>{children}</ProgramsProvider>
      </LazyMotion>
    </IconContext.Provider>
  )
}
