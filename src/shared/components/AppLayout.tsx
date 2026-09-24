import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:bg-white focus:p-4"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-blue-950 text-xl font-bold text-amber-300"
            >
              J
            </span>
            <div>
              <p className="font-semibold tracking-tight text-blue-950">
                Javeriana
              </p>
              <p className="text-xs text-slate-500">Lead & Events Manager</p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            Prueba técnica · Frontend
          </span>
        </div>
      </header>
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <footer className="mx-auto max-w-6xl px-6 py-8 text-xs leading-6 text-slate-500 sm:px-8">
        Proyecto de demostración. Oferta académica ficticia para desarrollo.
      </footer>
    </div>
  )
}
