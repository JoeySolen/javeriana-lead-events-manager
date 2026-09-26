import type { PropsWithChildren } from 'react'
import { ThemeSwitch } from './ThemeSwitch'
import logo from '../../assets/logo-javeriana.png'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-page">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:rounded-control focus:bg-card focus:p-4 focus:font-bold focus:text-brand"
      >
        Saltar al contenido
      </a>
      <header className="bg-card shadow-[0_1px_12px_rgb(29_33_37/0.1)]">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Pontificia Universidad Javeriana"
              width={492}
              height={192}
              className="brand-logo h-12 w-auto sm:h-16"
            />
            <p className="hidden border-l border-line pl-4 text-sm leading-tight font-bold text-ink-soft sm:block">
              Lead & Events
              <br />
              Manager
            </p>
          </div>
          <nav
            aria-label="Principal"
            className="flex w-full flex-wrap items-center justify-between gap-3 lg:w-auto lg:justify-end"
          >
            <ThemeSwitch />
            <a
              href="#oferta"
              className="hidden min-h-11 items-center rounded-control px-3 text-sm font-bold text-ink-soft transition-colors duration-300 hover:text-brand sm:inline-flex"
            >
              Oferta académica
            </a>
            <a href="#registro" className="btn-primary">
              Registrarme
            </a>
          </nav>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <footer className="border-t border-line">
        <p className="mx-auto max-w-page px-5 py-8 text-xs leading-6 text-ink-muted sm:px-8">
          Proyecto de demostración · Prueba técnica frontend. Programas de
          pregrado y posgrado tomados de javeriana.edu.co; no es un sitio
          oficial de la Universidad.
        </p>
      </footer>
    </div>
  )
}
