import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { getPrograms } from '../api/getPrograms'
import { ProgramsContext, type ProgramsState } from './ProgramsContext'

export function ProgramsProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ProgramsState>({ status: 'loading' })
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => {
    setState({ status: 'loading' })
    setRevision((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const programs = await getPrograms(controller.signal)
        if (!controller.signal.aborted)
          setState({ status: 'success', programs })
      } catch (error: unknown) {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Ocurrió un error al cargar el catálogo.',
          })
        }
      }
    }
    void load()
    return () => controller.abort()
  }, [revision])

  const value = useMemo(() => ({ state, reload }), [state, reload])
  return (
    <ProgramsContext.Provider value={value}>
      {children}
    </ProgramsContext.Provider>
  )
}
