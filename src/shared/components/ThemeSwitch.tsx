import { useEffect, useId, useState } from 'react'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/icons/CheckCircle'
import { MoonIcon } from '@phosphor-icons/react/dist/icons/Moon'
import { SunIcon } from '@phosphor-icons/react/dist/icons/Sun'
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
              {isDark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
            </span>
          </span>
        </button>
        {tooltipOpen && (
          <div
            id={tooltipId}
            role="tooltip"
            className="absolute top-full left-0 z-50 w-56 max-w-[calc(100vw-2.5rem)] pt-2 lg:right-0 lg:left-auto"
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
      <div className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-end sm:left-auto sm:right-6">
        {notice && (
          <p
            role="status"
            aria-atomic="true"
            className="flex max-w-full items-center gap-3 rounded-control border border-brand-line bg-card px-5 py-4 text-sm font-bold text-ink shadow-lg"
          >
            <CheckCircleIcon className="shrink-0 text-brand" />
            {notice === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado'}
          </p>
        )}
      </div>
    </>
  )
}
