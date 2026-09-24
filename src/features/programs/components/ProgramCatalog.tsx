import { usePrograms } from '../context/ProgramsContext'
import { ProgramCard } from './ProgramCard'

export function ProgramCatalog() {
  const { state, reload } = usePrograms()

  if (state.status === 'loading') {
    return (
      <p
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600"
      >
        Cargando oferta académica…
      </p>
    )
  }
  if (state.status === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p role="alert" className="text-red-900">
          {state.message}
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-4 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Reintentar
        </button>
      </div>
    )
  }
  if (state.programs.length === 0) {
    return (
      <p
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600"
      >
        No hay programas disponibles por ahora.
      </p>
    )
  }
  return (
    <ul
      aria-label="Programas académicos"
      className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
    >
      {state.programs.map((program) => (
        <li key={program.id}>
          <ProgramCard program={program} />
        </li>
      ))}
    </ul>
  )
}
