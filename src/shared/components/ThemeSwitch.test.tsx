import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeSwitch } from './ThemeSwitch'
import { THEME_STORAGE_KEY } from '../hooks/useTheme'

let media: MediaQueryList
let change: EventTarget
function systemTheme(dark: boolean) {
  Object.defineProperty(media, 'matches', { value: dark, configurable: true })
  act(() => change.dispatchEvent(new Event('change')))
}
const toggle = () =>
  fireEvent.click(screen.getByRole('switch', { name: 'Modo oscuro' }))
const checked = () =>
  screen
    .getByRole('switch', { name: 'Modo oscuro' })
    .getAttribute('aria-checked')
const theme = () => document.documentElement.dataset.theme

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  change = new EventTarget()
  media = {
    matches: false,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: change.addEventListener.bind(change),
    removeEventListener: change.removeEventListener.bind(change),
    dispatchEvent: change.dispatchEvent.bind(change),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media),
  )
})

describe('tema de la interfaz', () => {
  it('sigue el sistema por defecto y sus cambios en vivo', () => {
    render(<ThemeSwitch />)
    expect(checked()).toBe(String(theme() === 'dark'))
    expect(theme()).toBe('light')
    systemTheme(true)
    expect(theme()).toBe('dark')
    expect(checked()).toBe('true')
  })

  it('conserva la elección explícita después de remontar y ante cambios del sistema', () => {
    const view = render(<ThemeSwitch />)
    toggle()
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    view.unmount()
    render(<ThemeSwitch />)
    expect(theme()).toBe('dark')
    systemTheme(false)
    expect(theme()).toBe('dark')
    toggle()
    systemTheme(true)
    expect(theme()).toBe('light')
  })

  it('alterna desde el tema oscuro heredado del sistema y guarda claro', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'system')
    systemTheme(true)
    render(<ThemeSwitch />)
    expect(checked()).toBe('true')
    toggle()
    expect(theme()).toBe('light')
    expect(checked()).toBe('false')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    systemTheme(false)
    systemTheme(true)
    expect(theme()).toBe('light')
  })

  it('ignora valores guardados inválidos', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid')
    systemTheme(true)
    render(<ThemeSwitch />)
    expect(theme()).toBe('dark')
    expect(checked()).toBe(String(theme() === 'dark'))
  })

  it('permite cambiar de tema aunque el almacenamiento esté bloqueado', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(<ThemeSwitch />)
    toggle()
    expect(theme()).toBe('dark')
    toggle()
    expect(theme()).toBe('light')
  })

  it('sincroniza elecciones y borrado del almacenamiento entre pestañas', () => {
    render(<ThemeSwitch />)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    act(() =>
      window.dispatchEvent(
        new StorageEvent('storage', { key: THEME_STORAGE_KEY }),
      ),
    )
    expect(theme()).toBe('dark')
    localStorage.clear()
    act(() => window.dispatchEvent(new StorageEvent('storage', { key: null })))
    expect(theme()).toBe('light')
    expect(checked()).toBe(String(theme() === 'dark'))
  })

  it('retira el listener del sistema al desmontar', () => {
    const view = render(<ThemeSwitch />)
    view.unmount()
    systemTheme(true)
    expect(theme()).toBe('light')
  })
})

describe('aviso de cambio de tema', () => {
  afterEach(() => vi.useRealTimers())

  it('no muestra un toast al cargar o al seguir un cambio del sistema', () => {
    render(<ThemeSwitch />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    systemTheme(true)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('notifica ambos temas, reemplaza el aviso y reinicia el cierre automático', () => {
    vi.useFakeTimers()
    render(<ThemeSwitch />)
    toggle()
    expect(screen.getByRole('status')).toHaveTextContent('Modo oscuro activado')
    act(() => vi.advanceTimersByTime(2000))
    toggle()
    expect(screen.getAllByRole('status')).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Modo claro activado')
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.getByRole('status')).toBeVisible()
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('cancela el cierre pendiente al desmontar', () => {
    vi.useFakeTimers()
    const schedule = vi.spyOn(window, 'setTimeout')
    const cancel = vi.spyOn(window, 'clearTimeout')
    const view = render(<ThemeSwitch />)
    toggle()
    const toastTimerIndex = schedule.mock.calls.findIndex(
      ([, delay]) => delay === 3000,
    )
    expect(toastTimerIndex).toBeGreaterThanOrEqual(0)
    const toastTimer = schedule.mock.results[toastTimerIndex]?.value
    view.unmount()
    expect(cancel).toHaveBeenCalledWith(toastTimer)
  })
})

describe('tooltip del tema', () => {
  it('muestra el estado y la acción en hover y permite pasar el cursor sobre el texto', () => {
    render(<ThemeSwitch />)
    const control = screen.getByRole('switch', { name: 'Modo oscuro' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.mouseEnter(control)
    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toHaveTextContent('Modo claro activo')
    expect(tooltip).toHaveTextContent('Cambiar a modo oscuro')
    expect(control).toHaveAttribute('aria-describedby', tooltip.id)
    fireEvent.mouseLeave(control, { relatedTarget: tooltip })
    fireEvent.mouseEnter(tooltip)
    expect(screen.getByRole('tooltip')).toBeVisible()
    fireEvent.mouseLeave(tooltip)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('aparece con foco, actualiza el texto, se cierra con Escape y al perder foco', () => {
    render(<ThemeSwitch />)
    const control = screen.getByRole('switch', { name: 'Modo oscuro' })
    fireEvent.focus(control)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Modo claro activo')
    toggle()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Modo oscuro activo')
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      'Cambiar a modo claro',
    )
    fireEvent.keyDown(control, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(control).not.toHaveAttribute('aria-describedby')
    fireEvent.blur(control)
    fireEvent.focus(control)
    expect(screen.getByRole('tooltip')).toBeVisible()
    fireEvent.blur(control)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
