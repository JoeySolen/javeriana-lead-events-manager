import type { Program } from '../types'

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <span className="mb-6 w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
        {program.category}
      </span>
      <h3 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
        {program.name}
      </h3>
      <p className="text-sm leading-7 text-slate-600">{program.description}</p>
    </article>
  )
}
