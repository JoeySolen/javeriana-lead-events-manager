import type { Program } from '../types'

export function ProgramCard({
  program,
  onSelect,
}: {
  program: Program
  onSelect: (id: string) => void
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <span className="mb-6 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
        {program.category}
      </span>
      <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
        {program.name}
      </h3>
      <p className="mb-6 text-sm leading-7 text-slate-600">
        {program.description}
      </p>
      <button
        type="button"
        onClick={() => onSelect(program.id)}
        aria-label={`Inscribirme en ${program.name}`}
        className="mt-auto w-fit rounded-lg border border-blue-900 px-4 py-2.5 text-sm font-semibold text-blue-950 hover:bg-blue-50"
      >
        Inscribirme <span aria-hidden="true">↗</span>
      </button>
    </article>
  )
}
