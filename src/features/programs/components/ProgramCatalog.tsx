import { usePrograms } from '../context/ProgramsContext'
import { useProgramFilters } from '../hooks/useProgramFilters'
import { PROGRAM_CATEGORIES, type Program } from '../types'
import { ProgramCard } from './ProgramCard'

const EMPTY_PROGRAMS: Program[] = []

export function ProgramCatalog({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {
  const { state, reload } = usePrograms()
  const { query, setQuery, category, setCategory, filtered, clearFilters } =
    useProgramFilters(
      state.status === 'success' ? state.programs : EMPTY_PROGRAMS,
    )

  if (state.status === 'loading')
    return (
      <p
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600"
      >
        Cargando oferta académica…
      </p>
    )
  if (state.status === 'error')
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
  if (state.programs.length === 0)
    return (
      <p
        role="status"
        className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600"
      >
        No hay programas disponibles por ahora.
      </p>
    )

  return (
    <>
      <div
        role="search"
        aria-label="Filtrar oferta académica"
        className="mb-5 grid items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label
            htmlFor="program-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Buscar programa
          </label>
          <input
            id="program-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. Ingeniería"
            className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base"
          />
        </div>
        <div>
          <label
            htmlFor="program-category"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Categoría
          </label>
          <select
            id="program-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base"
          >
            <option value="">Todas las categorías</option>
            {PROGRAM_CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!query && !category}
          className="rounded-lg px-4 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-50 disabled:cursor-default disabled:text-slate-400"
        >
          Limpiar filtros
        </button>
      </div>
      <p role="status" className="mb-5 text-sm text-slate-600">
        {filtered.length} de {state.programs.length} programas
      </p>
      {filtered.length ? (
        <ul
          aria-label="Programas académicos"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((program) => (
            <li key={program.id}>
              <ProgramCard program={program} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
          <h3 className="font-semibold text-slate-900">
            No encontramos programas
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Prueba otro nombre o cambia la categoría.
          </p>
        </div>
      )}
    </>
  )
}
