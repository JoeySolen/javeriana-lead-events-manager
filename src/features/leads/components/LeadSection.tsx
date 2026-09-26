import { usePrograms } from '../../programs/context/ProgramsContext'
import { PROGRAM_CATEGORIES, type Program } from '../../programs/types'
import { useLeadForm } from '../hooks/useLeadForm'
import { useLeads } from '../hooks/useLeads'

const EMPTY_PROGRAMS: Program[] = []
const fieldClass = 'field mt-2'
const errorClass = 'mt-2 text-sm font-medium text-danger-ink'

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
      className="mx-auto max-w-page scroll-mt-8 px-5 pb-16 sm:px-8"
    >
      <div className="grid gap-8 rounded-card border border-line bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
        <div>
          <p className="eyebrow">Da el siguiente paso</p>
          <h2
            id="lead-title"
            className="text-3xl font-bold tracking-tight text-ink"
          >
            Registra tu interés
          </h2>
          <p className="mt-4 text-base leading-7 text-ink-soft">
            Elige el programa que te interesa y completa tus datos.
          </p>
          <p
            id="local-notice"
            className="mt-6 rounded-control border-l-4 border-brand bg-brand-soft p-4 text-sm leading-6 text-ink"
          >
            Demostración: los datos se guardan únicamente en este navegador. No
            se envían a la Universidad ni se realiza una inscripción oficial.
          </p>
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="text-sm font-bold text-ink">
              Registros en este navegador
            </h3>
            <p
              className="mt-2 text-4xl font-bold text-brand"
              aria-label={`${leads.length} registros guardados`}
            >
              {leads.length}
            </p>
            {!error && leads.length > 0 && (
              <p className="mt-2 text-sm text-ink-muted">
                Se conservan al recargar la página.
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-3 text-sm leading-6 font-medium text-danger-ink"
              >
                {error}
              </p>
            )}
          </div>
        </div>
        <form
          className="lead-form min-w-0"
          noValidate
          onSubmit={submit}
          aria-label="Registro de interesados"
          aria-describedby="local-notice"
        >
          <p className="mb-5 text-sm text-ink-muted">
            Todos los campos son obligatorios.
          </p>
          <div className="mb-5">
            <label htmlFor="lead-fullName" className="label">
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
              <p id="name-error" className={errorClass}>
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="lead-email" className="label">
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
              className="mt-2 text-sm leading-6 text-ink-muted"
            >
              Si tienes correo @javeriana.edu.co, úsalo. También aceptamos otros
              correos válidos.
            </p>
            {errors.email && (
              <p id="email-error" className={errorClass}>
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="lead-programId" className="label">
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
              {PROGRAM_CATEGORIES.map((category) => {
                const options = programs.filter(
                  (program) => program.category === category,
                )
                return options.length ? (
                  <optgroup key={category} label={category}>
                    {options.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null
              })}
            </select>
            {errors.programId && (
              <p id="program-error" className={errorClass}>
                {errors.programId}
              </p>
            )}
          </div>
          {!ready && (
            <p className="mb-4 text-sm text-ink-soft">
              El registro estará disponible cuando se cargue la oferta
              académica.
            </p>
          )}
          <button
            type="submit"
            disabled={!ready}
            className="btn-primary w-full py-3.5 text-base"
          >
            Registrar interés
          </button>
          {notice && (
            <p
              role={notice.kind === 'success' ? 'status' : 'alert'}
              className={`mt-5 rounded-control border-l-4 p-4 break-words text-sm leading-6 font-medium ${notice.kind === 'success' ? 'border-success-ink bg-success-soft text-success-ink' : 'border-danger-ink bg-danger-soft text-danger-ink'}`}
            >
              {notice.text}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
