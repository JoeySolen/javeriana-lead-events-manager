import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProgramsProvider } from '../context/ProgramsProvider'
import { ProgramCatalog } from './ProgramCatalog'

const programs = Array.from({ length: 30 }, (_, index) => ({
  id: String(index + 1),
  name: `${index < 20 ? 'Maestría' : 'Carrera'} ${index + 1}`,
  category: index < 20 ? 'Posgrado' : 'Pregrado',
  description: 'Ejemplo',
}))

const renderCatalog = () =>
  render(
    <ProgramsProvider>
      <ProgramCatalog onSelect={() => {}} />
    </ProgramsProvider>,
  )
const cards = () => screen.getAllByRole('article')

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(JSON.stringify(programs))),
  )
})

describe('paginación del catálogo', () => {
  it('muestra 12 programas y carga más enfocando el primero nuevo', async () => {
    renderCatalog()
    await screen.findByRole('heading', { name: 'Maestría 1' })
    expect(cards()).toHaveLength(12)
    expect(screen.getByText('30 programas · mostrando 12')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: /Mostrar 12/ }))
    expect(cards()).toHaveLength(24)
    expect(
      within(cards()[12]!).getByRole('button', { name: /Inscribirme/ }),
    ).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: /Mostrar 6/ }))
    expect(cards()).toHaveLength(30)
    expect(
      screen.queryByRole('button', { name: /Mostrar/ }),
    ).not.toBeInTheDocument()
  })

  it('vuelve a la primera página al cambiar los filtros', async () => {
    renderCatalog()
    await screen.findByRole('heading', { name: 'Maestría 1' })
    fireEvent.click(screen.getByRole('button', { name: /Mostrar 12/ }))
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Posgrado' },
    })
    expect(cards()).toHaveLength(12)
    expect(screen.getByText('20 de 30 programas · mostrando 12')).toBeVisible()
  })

  it('ofrece solo categorías con programas y cuenta según la búsqueda', async () => {
    renderCatalog()
    await screen.findByRole('heading', { name: 'Maestría 1' })
    const select = screen.getByLabelText('Categoría')
    const labels = () =>
      within(select)
        .getAllByRole('option')
        .map((option) => option.textContent)
    expect(labels()).toEqual([
      'Todas las categorías',
      'Pregrado (10)',
      'Posgrado (20)',
    ])
    fireEvent.change(screen.getByLabelText('Buscar programa'), {
      target: { value: 'carrera' },
    })
    expect(labels()).toEqual([
      'Todas las categorías',
      'Pregrado (10)',
      'Posgrado (0)',
    ])
  })
})
