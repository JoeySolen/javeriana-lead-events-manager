import { useState } from 'react'
import { ArrowDownIcon } from '@phosphor-icons/react/dist/icons/ArrowDown'
import { m, useReducedMotion, type Variants } from 'framer-motion'
import campus from '../assets/terraza-educ.jpg'
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

const HERO_EASE = [0.22, 1, 0.36, 1] as const

const heroCopy: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.1,
    },
  },
}

const heroEyebrow: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.48, ease: HERO_EASE },
  },
}

const heroCopyItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: HERO_EASE },
  },
}

const heroActions: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: HERO_EASE },
  },
}

const heroPath: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: HERO_EASE },
  },
}

const heroMedia: Variants = {
  hidden: { opacity: 0, x: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.18, duration: 0.78, ease: HERO_EASE },
  },
}

const heroImage: Variants = {
  hidden: { scale: 1.08 },
  visible: {
    scale: 1,
    transition: { delay: 0.18, duration: 1.05, ease: HERO_EASE },
  },
}

export default function App() {
  const [selectedProgramId, setSelectedProgramId] = useState('')
  const reduceMotion = useReducedMotion()
  function selectProgram(id: string) {
    setSelectedProgramId(id)
    document.getElementById('lead-fullName')?.focus()
  }
  return (
    <AppLayout>
      <section aria-labelledby="page-title">
        <div className="mx-auto grid max-w-page items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <m.div
            variants={heroCopy}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <m.p variants={heroEyebrow} className="eyebrow">
              Conocimiento que transforma
            </m.p>
            <m.h1
              variants={heroCopyItem}
              id="page-title"
              className="max-w-xl text-[2rem] leading-tight font-bold tracking-tight text-ink sm:text-4xl"
            >
              <span className="text-brand">El próximo paso</span> empieza aquí.
            </m.h1>
            <m.p
              variants={heroCopyItem}
              className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg sm:leading-8"
            >
              Explora programas para aprender, crecer y construir nuevas
              oportunidades.
            </m.p>
            <m.div variants={heroActions} className="mt-8 flex flex-wrap gap-3">
              <a href="#oferta" className="btn-primary">
                Explorar la oferta <ArrowDownIcon />
              </a>
              <a href="#registro" className="btn-secondary">
                Registrar mi interés
              </a>
            </m.div>
            <m.ul
              variants={heroActions}
              className="mt-8 grid gap-5 border-t border-line pt-6 sm:grid-cols-2"
            >
              {PATHS.map((path) => (
                <m.li key={path.title} variants={heroPath}>
                  <span className="block text-sm font-bold text-brand">
                    {path.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-ink-soft">
                    {path.text}
                  </span>
                </m.li>
              ))}
            </m.ul>
          </m.div>
          <m.figure
            variants={heroMedia}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            className="overflow-hidden rounded-media bg-brand-soft"
          >
            <m.img
              variants={heroImage}
              src={campus}
              alt="Vista panorámica del campus de la Universidad Javeriana y los cerros de Bogotá"
              width={1600}
              height={1067}
              fetchPriority="high"
              className="h-72 w-full object-cover object-center sm:h-96 lg:h-[28rem]"
            />
          </m.figure>
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
