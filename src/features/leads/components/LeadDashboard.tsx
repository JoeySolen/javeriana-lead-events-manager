import { useEffect, useRef, useState } from 'react'
import { BroomIcon } from '@phosphor-icons/react/dist/icons/Broom'
import { InfoIcon } from '@phosphor-icons/react/dist/icons/Info'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/icons/MagnifyingGlass'
import { TrashIcon } from '@phosphor-icons/react/dist/icons/Trash'
import { XIcon } from '@phosphor-icons/react/dist/icons/X'
import type { Program } from '../../programs/types'
import { useLeadFilters } from '../hooks/useLeadFilters'
import type { Lead } from '../types'

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function LeadDashboard({
  leads,
  programs,
  storageError,
  onDelete,
  onDeleteAll,
}: {
  leads: Lead[]
  programs: Program[]
  storageError: string | null
  onDelete: (id: string) => void
  onDeleteAll: () => void
}) {
  const [confirmationVisible, setConfirmationVisible] = useState(false)
  const [notice, setNotice] = useState<{
    kind: 'success' | 'error'
    text: string
  } | null>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const deleteAllRef = useRef<HTMLButtonElement>(null)
  const {
    query,
    programId,
    programNames,
    availablePrograms,
    filteredLeads,
    setQuery,
    setProgramId,
    clearFilters,
  } = useLeadFilters(leads, programs)

  useEffect(() => {
    if (confirmationVisible) cancelRef.current?.focus()
  }, [confirmationVisible])

  function deleteOne(lead: Lead) {
    setNotice(null)
    try {
      onDelete(lead.id)
      setNotice({
        kind: 'success',
        text: `Eliminamos el registro de ${lead.fullName}.`,
      })
    } catch (error) {
      setNotice({
        kind: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No pudimos eliminar el registro.',
      })
    }
  }

  function cancelDeleteAll() {
    setConfirmationVisible(false)
    requestAnimationFrame(() => deleteAllRef.current?.focus())
  }

  function confirmDeleteAll() {
    setNotice(null)
    try {
      onDeleteAll()
      setConfirmationVisible(false)
      setNotice({
        kind: 'success',
        text: 'Eliminamos todos los registros de este navegador.',
      })
    } catch (error) {
      setNotice({
        kind: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No pudimos eliminar los registros.',
      })
    }
  }

  return (
    <section
      aria-labelledby="leads-title"
      className="mt-10 rounded-card border border-line bg-card p-6 sm:p-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Gestión local</p>
          <h2
            id="leads-title"
            className="text-3xl font-bold tracking-tight text-ink"
          >
            Prospectos registrados
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
            Consulta los interesados guardados únicamente en este navegador.
          </p>
        </div>
        <p
          className="rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand"
          aria-label={`${leads.length} prospectos registrados`}
        >
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </p>
      </div>

      {storageError ? (
        <p className="mt-8 rounded-control bg-danger-soft p-4 text-sm leading-6 text-danger-ink">
          No podemos mostrar los registros porque el almacenamiento local no
          está disponible.
        </p>
      ) : leads.length === 0 ? (
        <div className="mt-8 rounded-control bg-page p-8 text-center">
          <InfoIcon
            size={32}
            weight="regular"
            className="mx-auto mb-4 text-brand"
          />
          <h3 className="text-lg font-bold text-ink">
            Aún no hay prospectos registrados
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Completa el formulario para ver aquí el primer registro.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(14rem,0.55fr)]">
            <div>
              <label htmlFor="lead-search" className="label">
                Buscar prospecto
              </label>
              <div className="relative mt-2">
                <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
                <input
                  id="lead-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Nombre o correo"
                  className="field pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="lead-program-filter" className="label">
                Programa
              </label>
              <select
                id="lead-program-filter"
                value={programId}
                onChange={(event) => setProgramId(event.target.value)}
                className="field mt-2"
              >
                <option value="">Todos los programas</option>
                {availablePrograms.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p role="status" className="text-sm text-ink-muted">
              Mostrando {filteredLeads.length} de {leads.length}{' '}
              {leads.length === 1 ? 'registro' : 'registros'}.
            </p>
            {(query || programId) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-bold text-brand hover:bg-brand-soft"
              >
                <BroomIcon /> Limpiar filtros
              </button>
            )}
          </div>

          {filteredLeads.length === 0 ? (
            <div className="mt-4 rounded-control bg-page p-8 text-center">
              <h3 className="text-lg font-bold text-ink">
                No encontramos prospectos
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Prueba con otro nombre, correo o programa.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-control border border-line">
              <div
                aria-hidden="true"
                className="hidden grid-cols-[1fr_1.2fr_1.2fr_0.8fr_auto] gap-4 bg-page px-5 py-3 text-xs font-bold tracking-wide text-ink-muted uppercase lg:grid"
              >
                <span>Nombre</span>
                <span>Correo</span>
                <span>Programa</span>
                <span>Registro</span>
                <span>Acción</span>
              </div>
              <ul
                aria-label="Prospectos guardados"
                className="divide-y divide-line"
              >
                {filteredLeads.map((lead) => (
                  <li
                    key={lead.id}
                    className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1.2fr_1.2fr_0.8fr_auto] lg:items-center"
                  >
                    <div>
                      <span className="label lg:sr-only">Nombre</span>
                      <p className="mt-1 break-words font-bold text-ink lg:mt-0">
                        {lead.fullName}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="label lg:sr-only">Correo</span>
                      <p className="mt-1 break-all text-sm text-ink-soft lg:mt-0">
                        {lead.email}
                      </p>
                    </div>
                    <div>
                      <span className="label lg:sr-only">Programa</span>
                      <p className="mt-1 text-sm leading-6 text-ink-soft lg:mt-0">
                        {programNames.get(lead.programId) ??
                          'Programa no disponible'}
                      </p>
                    </div>
                    <div>
                      <span className="label lg:sr-only">Registro</span>
                      <time
                        dateTime={lead.createdAt}
                        className="mt-1 block text-sm text-ink-soft lg:mt-0"
                      >
                        {dateFormatter.format(new Date(lead.createdAt))}
                      </time>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteOne(lead)}
                      aria-label={`Eliminar registro de ${lead.fullName}`}
                      className="inline-flex min-h-11 items-center gap-2 justify-self-start rounded-control border border-danger-ink px-3 text-sm font-bold text-danger-ink hover:bg-danger-soft lg:justify-self-end"
                    >
                      <TrashIcon /> Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-line pt-6">
            {confirmationVisible ? (
              <div
                role="group"
                aria-label="Confirmar eliminación de todos los registros"
                className="flex flex-wrap items-center justify-between gap-4 rounded-control bg-danger-soft p-4"
              >
                <p className="text-sm font-bold text-danger-ink">
                  ¿Eliminar todos los registros de este navegador?
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    ref={cancelRef}
                    type="button"
                    onClick={cancelDeleteAll}
                    className="btn-secondary"
                  >
                    <XIcon /> Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteAll}
                    className="inline-flex min-h-11 items-center gap-2 rounded-control bg-danger-ink px-4 text-sm font-bold text-white"
                  >
                    <TrashIcon /> Sí, eliminar todos
                  </button>
                </div>
              </div>
            ) : (
              <button
                ref={deleteAllRef}
                type="button"
                onClick={() => setConfirmationVisible(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-control px-3 text-sm font-bold text-danger-ink hover:bg-danger-soft"
              >
                <TrashIcon /> Eliminar todos los registros
              </button>
            )}
          </div>
        </>
      )}

      {notice && (
        <p
          role={notice.kind === 'success' ? 'status' : 'alert'}
          className={`mt-5 rounded-control p-4 text-sm leading-6 font-medium ${notice.kind === 'success' ? 'bg-success-soft text-success-ink' : 'bg-danger-soft text-danger-ink'}`}
        >
          {notice.text}
        </p>
      )}
    </section>
  )
}
