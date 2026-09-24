import { useState } from 'react'
import { LeadSection } from '../features/leads/components/LeadSection'
import { ProgramCatalog } from '../features/programs/components/ProgramCatalog'
import { AppLayout } from '../shared/components/AppLayout'

export default function App() {
  const [selectedProgramId, setSelectedProgramId] = useState('')
  function selectProgram(id: string) {
    setSelectedProgramId(id)
    document.getElementById('lead-fullName')?.focus()
  }
  return (
    <AppLayout>
      <section className="bg-blue-950 text-white" aria-labelledby="page-title">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8 sm:py-20">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Conocimiento que transforma
          </p>
          <h1
            id="page-title"
            className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          >
            El próximo paso empieza aquí.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-blue-100">
            Explora programas para aprender, crecer y construir nuevas
            oportunidades.
          </p>
          <a
            href="#oferta"
            className="mt-8 inline-flex rounded-lg bg-amber-300 px-5 py-3 text-sm font-bold text-blue-950 hover:bg-amber-200"
          >
            Explorar la oferta{' '}
            <span aria-hidden="true" className="ml-3">
              ↓
            </span>
          </a>
        </div>
      </section>
      <section
        id="oferta"
        aria-labelledby="catalog-title"
        className="mx-auto max-w-6xl scroll-mt-8 px-6 py-12 sm:px-8"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-800">
          Tu siguiente oportunidad
        </p>
        <h2
          id="catalog-title"
          className="text-2xl font-semibold tracking-tight text-slate-900"
        >
          Oferta académica
        </h2>
        <p className="mb-8 mt-3 text-sm leading-6 text-slate-600">
          Pregrados, posgrados y educación continua en un solo lugar.
        </p>
        <ProgramCatalog onSelect={selectProgram} />
      </section>
      <LeadSection
        programId={selectedProgramId}
        onProgramChange={setSelectedProgramId}
      />
    </AppLayout>
  )
}
