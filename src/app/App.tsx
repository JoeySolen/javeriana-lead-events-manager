import { useState } from 'react'
import campus from '../assets/campus-javeriana.jpg'
import { LeadSection } from '../features/leads/components/LeadSection'
import { ProgramCatalog } from '../features/programs/components/ProgramCatalog'
import { AppLayout } from '../shared/components/AppLayout'

const PATHS = [
  {
    title: 'Pregrado',
    text: 'Tu primera carrera profesional.',
  },
  {
    title: 'Posgrado',
    text: 'Especializaciones, maestrías y doctorados para profundizar.',
  },
]

export default function App() {
  const [selectedProgramId, setSelectedProgramId] = useState('')
  function selectProgram(id: string) {
    setSelectedProgramId(id)
    document.getElementById('lead-fullName')?.focus()
  }
  return (
    <AppLayout>
      <section aria-labelledby="page-title">
        <div className="mx-auto grid max-w-page items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Conocimiento que transforma</p>
            <h1
              id="page-title"
              className="max-w-xl text-[2rem] leading-tight font-bold tracking-tight text-ink sm:text-4xl"
            >
              <span className="text-brand">El próximo paso</span> empieza aquí.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
              Explora programas para aprender, crecer y construir nuevas
              oportunidades.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#oferta" className="btn-primary">
                Explorar la oferta <span aria-hidden="true">↓</span>
              </a>
              <a href="#registro" className="btn-secondary">
                Registrar mi interés
              </a>
            </div>
            <ul className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
              {PATHS.map((path) => (
                <li key={path.title}>
                  <span className="block text-sm font-bold text-brand">
                    {path.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">
                    {path.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="overflow-hidden rounded-media bg-brand-soft">
            <img
              src={campus}
              alt="Edificios y zonas verdes del campus de la Universidad Javeriana"
              width={400}
              height={650}
              fetchPriority="high"
              className="h-72 w-full object-cover object-center sm:h-96 lg:h-[28rem]"
            />
            <figcaption className="bg-brand px-6 py-4 text-sm font-medium text-on-brand">
              Un lugar para aprender y transformar.
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        id="oferta"
        aria-labelledby="catalog-title"
        className="mx-auto max-w-page scroll-mt-8 px-5 py-12 sm:px-8 sm:py-16"
      >
        <p className="eyebrow">Tu siguiente oportunidad</p>
        <h2
          id="catalog-title"
          className="text-3xl font-bold tracking-tight text-ink"
        >
          Oferta académica
        </h2>
        <p className="mt-3 mb-8 text-base leading-7 text-ink-soft">
          Pregrados, especializaciones, maestrías y doctorados en un solo lugar.
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
