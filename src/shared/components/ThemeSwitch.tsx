import { useEffect, useId, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export function ThemeSwitch() {
  const { isDark, chooseTheme } = useTheme()
  const tooltipId = useId()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const tooltipOpen = (hovered || focused) && !dismissed
  const [notice, setNotice] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 3000)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (!tooltipOpen) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDismissed(true)
    }
    document.addEventListener('keydown', dismiss)
    return () => document.removeEventListener('keydown', dismiss)
  }, [tooltipOpen])
  function toggleTheme() {
    const next = isDark ? 'light' : 'dark'
    chooseTheme(next)
    setNotice(next)
  }

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => {
          setHovered(true)
          setDismissed(false)
        }}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label="Modo oscuro"
          aria-describedby={tooltipOpen ? tooltipId : undefined}
          onFocus={() => {
            setFocused(true)
            setDismissed(false)
          }}
          onBlur={() => setFocused(false)}
          onClick={toggleTheme}
          className="group inline-flex min-h-11 items-center gap-2 rounded-control px-1 text-sm font-bold text-ink-soft"
        >
          <span
            aria-hidden="true"
            className="relative inline-flex h-7 w-14 shrink-0 items-center rounded-full border border-field bg-page transition-colors duration-200 group-aria-checked:border-brand group-aria-checked:bg-brand"
          >
            <span className="absolute left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-muted text-card transition-transform duration-200 group-aria-checked:translate-x-7 group-aria-checked:bg-on-brand group-aria-checked:text-brand">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                {isDark ? (
                  <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                  </>
                )}
              </svg>
            </span>
          </span>
        </button>
        {tooltipOpen && (
          <div
            id={tooltipId}
            role="tooltip"
            className="absolute top-full left-0 z-50 w-56 max-w-[calc(100vw-2.5rem)] pt-2 sm:right-0 sm:left-auto"
          >
            <p className="rounded-control border border-brand-line bg-card px-4 py-3 text-sm leading-6 text-ink shadow-lg">
              <span className="block font-bold">
                {isDark ? 'Modo oscuro activo' : 'Modo claro activo'}
              </span>
              <span className="text-ink-soft">
                {isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              </span>
            </p>
          </div>
        )}
      </div>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-end sm:left-auto sm:right-6"
      >
        {notice && (
          <p
            role="status"
            className="flex max-w-full items-center gap-3 rounded-control border border-brand-line bg-card px-5 py-4 text-sm font-bold text-ink shadow-lg"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-brand"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
            {notice === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado'}
          </p>
        )}
      </div>
    </>
  )
}
