import type { Program } from '../types'

export function ProgramCard({
  program,
  onSelect,
}: {
  program: Program
  onSelect: (id: string) => void
}) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-card p-6 transition-shadow duration-300 hover:shadow-[0_8px_24px_rgb(29_33_37/0.1)] sm:p-7">
      <span className="mb-5 w-fit rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
        {program.category}
      </span>
      <h3 className="mb-3 text-xl leading-snug font-bold tracking-tight text-ink">
        {program.name}
      </h3>
      <p className="mb-6 text-base leading-7 text-ink-soft">
        {program.description}
      </p>
      <button
        type="button"
        onClick={() => onSelect(program.id)}
        aria-label={`Inscribirme en ${program.name}`}
        className="btn-secondary mt-auto w-fit"
      >
        Inscribirme <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}
