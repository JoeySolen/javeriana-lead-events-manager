import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { AppProviders } from './AppProviders'

const programs = [
  {
    id: '1',
    name: 'Ingeniería de Sistemas',
    category: 'Pregrado',
    description: 'Programa de ejemplo',
  },
]
const renderApp = () =>
  render(
    <AppProviders>
      <App />
    </AppProviders>,
  )

describe('catálogo inicial', () => {
  it('muestra carga y después los programas de la API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(programs))),
    )
    renderApp()
    expect(screen.getByRole('status')).toHaveTextContent('Cargando')
    expect(
      await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' }),
    ).toBeVisible()
    expect(
      screen.queryByText('Cargando oferta académica…'),
    ).not.toBeInTheDocument()
  })

  it('permite reintentar después de un fallo de red', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Sin conexión'))
      .mockResolvedValueOnce(new Response(JSON.stringify(programs)))
    vi.stubGlobal('fetch', fetchMock)
    renderApp()
    expect(await screen.findByRole('alert')).toHaveTextContent('Sin conexión')
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(
      await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' }),
    ).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('explica cuando el catálogo está vacío', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]')))
    renderApp()
    expect(
      await screen.findByText('No hay programas disponibles por ahora.'),
    ).toBeVisible()
  })

  it('cancela la petición al desmontar la aplicación', () => {
    let receivedSignal: AbortSignal | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, options: RequestInit) => {
        receivedSignal = options.signal ?? undefined
        return new Promise<Response>(() => {})
      }),
    )
    const { unmount } = renderApp()
    expect(receivedSignal?.aborted).toBe(false)
    unmount()
    expect(receivedSignal?.aborted).toBe(true)
  })
})
