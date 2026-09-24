import { usePrograms } from '../../programs/context/ProgramsContext'
import type { Program } from '../../programs/types'
import { useLeadForm } from '../hooks/useLeadForm'
import { useLeads } from '../hooks/useLeads'

const EMPTY_PROGRAMS: Program[] = []
const fieldClass =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base text-slate-900 aria-invalid:border-red-500'

export function LeadSection({
  programId,
  onProgramChange,
}: {
  programId: string
  onProgramChange: (id: string) => void
}) {
  const { state } = usePrograms()
  const programs = state.status === 'success' ? state.programs : EMPTY_PROGRAMS
  const { leads, error, addLead } = useLeads()
  const {
    fullName,
    email,
    errors,
    notice,
    submit,
    changeName,
    changeEmail,
    changeProgram,
  } = useLeadForm(programs, programId, onProgramChange, addLead)
  const ready = state.status === 'success' && programs.length > 0

  return (
    <section
      id="registro"
      aria-labelledby="lead-title"
      className="mx-auto max-w-6xl scroll-mt-8 px-6 pb-12 sm:px-8"
    >
      <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-800">
            Da el siguiente paso
          </p>
          <h2
            id="lead-title"
            className="text-2xl font-semibold tracking-tight text-slate-900"
          >
            Registra tu interés
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Elige el programa que te interesa y completa tus datos.
          </p>
          <p
            id="local-notice"
            className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-950"
          >
            Demostración: los datos se guardan únicamente en este navegador. No
            se envían a la Universidad ni se realiza una inscripción oficial.
          </p>
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Registros en este navegador
            </h3>
            <p
              className="mt-2 text-3xl font-semibold text-blue-950"
              aria-label={`${leads.length} registros guardados`}
            >
              {leads.length}
            </p>
            {!error && leads.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Se conservan al recargar la página.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-3 text-sm leading-6 text-red-800">
                {error}
              </p>
            )}
          </div>
        </div>
        <form
          noValidate
          onSubmit={submit}
          aria-label="Registro de interesados"
          aria-describedby="local-notice"
        >
          <p className="mb-5 text-xs text-slate-500">
            Todos los campos son obligatorios.
          </p>
          <div className="mb-5">
            <label
              htmlFor="lead-fullName"
              className="text-sm font-semibold text-slate-700"
            >
              Nombre completo
            </label>
            <input
              id="lead-fullName"
              name="fullName"
              autoComplete="name"
              required
              maxLength={150}
              value={fullName}
              onChange={(event) => changeName(event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? 'name-error' : undefined}
              className={fieldClass}
            />
            {errors.fullName && (
              <p id="name-error" className="mt-2 text-sm text-red-700">
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="lead-email"
              className="text-sm font-semibold text-slate-700"
            >
              Correo electrónico
            </label>
            <input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => changeEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'email-help email-error' : 'email-help'
              }
              className={fieldClass}
            />
            <p
              id="email-help"
              className="mt-2 text-xs leading-5 text-slate-500"
            >
              Si tienes correo @javeriana.edu.co, úsalo. También aceptamos otros
              correos válidos.
            </p>
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-700">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="lead-programId"
              className="text-sm font-semibold text-slate-700"
            >
              Programa de interés
            </label>
            <select
              id="lead-programId"
              name="programId"
              required
              disabled={!ready}
              value={programId}
              onChange={(event) => changeProgram(event.target.value)}
              aria-invalid={Boolean(errors.programId)}
              aria-describedby={errors.programId ? 'program-error' : undefined}
              className={fieldClass}
            >
              <option value="">Selecciona un programa</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
            {errors.programId && (
              <p id="program-error" className="mt-2 text-sm text-red-700">
                {errors.programId}
              </p>
            )}
          </div>
          {!ready && (
            <p className="mb-4 text-sm text-slate-600">
              El registro estará disponible cuando se cargue la oferta
              académica.
            </p>
          )}
          <button
            type="submit"
            disabled={!ready}
            className="w-full rounded-lg bg-blue-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Registrar interés
          </button>
          {notice && (
            <p
              role={notice.kind === 'success' ? 'status' : 'alert'}
              className={`mt-5 rounded-lg p-4 text-sm leading-6 ${notice.kind === 'success' ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-800'}`}
            >
              {notice.text}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
