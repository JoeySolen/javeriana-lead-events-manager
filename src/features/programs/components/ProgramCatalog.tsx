import { useRef } from 'react'
import { BroomIcon } from '@phosphor-icons/react/dist/icons/Broom'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/icons/MagnifyingGlass'
import { PlusIcon } from '@phosphor-icons/react/dist/icons/Plus'
import { flushSync } from 'react-dom'
import { m, useReducedMotion } from 'framer-motion'
import { usePrograms } from '../context/ProgramsContext'
import { PAGE_SIZE, useProgramFilters } from '../hooks/useProgramFilters'
import type { Program } from '../types'
import { ProgramCard } from './ProgramCard'

const EMPTY_PROGRAMS: Program[] = []

export function ProgramCatalog({
  onSelect,
}: {
  onSelect: (id: string) => void
}) {
  const { state, reload } = usePrograms()
  const reduceMotion = useReducedMotion()
  const {
    query,
    setQuery,
    category,
    setCategory,
    categories,
    filtered,
    visible,
    showMore,
    clearFilters,
  } = useProgramFilters(
    state.status === 'success' ? state.programs : EMPTY_PROGRAMS,
  )
  const listRef = useRef<HTMLUListElement>(null)
  // After "Mostrar más", continue keyboard navigation at the first new card.
  // flushSync commits the new cards before focusing, without effect timing.
  function loadMore() {
    const firstNew = visible.length
    flushSync(showMore)
    listRef.current?.children[firstNew]?.querySelector('button')?.focus()
  }
  const remaining = filtered.length - visible.length

  if (state.status === 'loading')
    return (
      <p
        role="status"
        className="rounded-card border border-line bg-card p-8 text-ink-soft"
      >
        Cargando oferta académica…
      </p>
    )
  if (state.status === 'error')
    return (
      <div className="rounded-card border border-danger-ink/30 bg-danger-soft p-8">
        <p role="alert" className="font-medium text-danger-ink">
          {state.message}
        </p>
        <button type="button" onClick={reload} className="btn-primary mt-4">
          Reintentar
        </button>
      </div>
    )
  if (state.programs.length === 0)
    return (
      <p
        role="status"
        className="rounded-card border border-line bg-card p-8 text-ink-soft"
      >
        No hay programas disponibles por ahora.
      </p>
    )

  return (
    <>
      <div
        role="search"
        aria-label="Filtrar oferta académica"
        className="mb-5 grid items-end gap-4 rounded-card border border-line bg-card p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      >
        <div>
          <label htmlFor="program-search" className="label mb-2">
            Buscar programa
          </label>
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
            <input
              id="program-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. Ingeniería"
              className="field pl-10"
            />
          </div>
        </div>
        <div>
          <label htmlFor="program-category" className="label mb-2">
            Categoría
          </label>
          <select
            id="program-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field"
          >
            <option value="">Todas las categorías</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.value} ({item.count})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!query && !category}
          className="inline-flex min-h-12 items-center gap-2 rounded-control px-4 text-sm font-bold text-brand transition-colors duration-300 hover:bg-brand-soft disabled:cursor-default disabled:bg-transparent disabled:text-ink-muted"
        >
          <BroomIcon /> Limpiar filtros
        </button>
      </div>
      <p role="status" className="mb-5 text-sm font-medium text-ink-muted">
        {filtered.length === state.programs.length
          ? `${filtered.length} programas`
          : `${filtered.length} de ${state.programs.length} programas`}
        {remaining > 0 && ` · mostrando ${visible.length}`}
      </p>
      {filtered.length ? (
        <ul
          ref={listRef}
          aria-label="Programas académicos"
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {visible.map((program, index) => (
            <m.li
              key={program.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.32,
                delay: reduceMotion ? 0 : (index % PAGE_SIZE) * 0.025,
                ease: 'easeOut',
              }}
            >
              <ProgramCard program={program} onSelect={onSelect} />
            </m.li>
          ))}
        </ul>
      ) : (
        <div className="rounded-card bg-page p-10 text-center">
          <h3 className="text-lg font-bold text-ink">
            No encontramos programas
          </h3>
          <p className="mt-2 text-base text-ink-soft">
            Prueba otro nombre o cambia la categoría.
          </p>
        </div>
      )}
      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={loadMore} className="btn-secondary">
            <PlusIcon />
            Mostrar {Math.min(PAGE_SIZE, remaining)} programas más
            <span className="font-medium text-ink-muted">
              ({remaining} restantes)
            </span>
          </button>
        </div>
      )}
    </>
  )
}
