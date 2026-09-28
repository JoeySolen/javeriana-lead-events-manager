import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../../app/App'
import { AppProviders } from '../../../app/AppProviders'
import {
  appendLead,
  LEADS_STORAGE_KEY,
  readLeads,
} from '../storage/leadsStorage'
import type { Lead } from '../types'

const programs = [
  {
    id: '1',
    name: 'Ingeniería de Sistemas',
    category: 'Pregrado',
    description: 'Ejemplo',
  },
  {
    id: '2',
    name: 'Maestría en Ingeniería',
    category: 'Posgrado',
    description: 'Ejemplo',
  },
]

const leads: Lead[] = [
  {
    id: 'lead-1',
    fullName: 'María Pérez',
    email: 'maria@example.com',
    programId: '1',
    createdAt: '2026-09-27T15:00:00.000Z',
  },
  {
    id: 'lead-2',
    fullName: 'Juan Torres',
    email: 'juan@example.com',
    programId: '2',
    createdAt: '2026-09-27T16:00:00.000Z',
  },
]

function renderApp() {
  return render(
    <AppProviders>
      <App />
    </AppProviders>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal(
    'fetch',
    vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify(programs))),
      ),
  )
})

describe('panel de prospectos', () => {
  it('explica el estado vacío', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    expect(
      screen.getByRole('heading', { name: 'Prospectos registrados' }),
    ).toBeVisible()
    expect(screen.getByText('Aún no hay prospectos registrados')).toBeVisible()
  })

  it('busca por nombre sin tildes y filtra por programa', async () => {
    leads.forEach(appendLead)
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    const dashboard = screen.getByRole('region', {
      name: 'Prospectos registrados',
    })

    fireEvent.change(within(dashboard).getByLabelText('Buscar prospecto'), {
      target: { value: 'maria' },
    })
    expect(screen.getByText('Mostrando 1 de 2 registros.')).toBeVisible()
    expect(screen.getByText('María Pérez')).toBeVisible()
    expect(screen.queryByText('Juan Torres')).not.toBeInTheDocument()

    fireEvent.click(
      within(dashboard).getByRole('button', { name: 'Limpiar filtros' }),
    )
    fireEvent.change(
      within(dashboard).getByLabelText('Programa', { selector: 'select' }),
      {
        target: { value: '2' },
      },
    )
    expect(screen.getByText('Juan Torres')).toBeVisible()
    expect(screen.queryByText('María Pérez')).not.toBeInTheDocument()
  })

  it('elimina un registro y anuncia el resultado', async () => {
    leads.forEach(appendLead)
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar registro de María Pérez',
      }),
    )

    expect(
      screen.getByText('Eliminamos el registro de María Pérez.'),
    ).toBeVisible()
    expect(readLeads()).toHaveLength(1)
    expect(screen.queryByText('María Pérez')).not.toBeInTheDocument()
  })

  it('permite cancelar o confirmar la eliminación total', async () => {
    leads.forEach(appendLead)
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar todos los registros' }),
    )
    const cancel = screen.getByRole('button', { name: 'Cancelar' })
    expect(cancel).toHaveFocus()
    fireEvent.click(cancel)
    expect(readLeads()).toHaveLength(2)

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar todos los registros' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Sí, eliminar todos' }))

    expect(localStorage.getItem(LEADS_STORAGE_KEY)).toBeNull()
    expect(screen.getByText('Aún no hay prospectos registrados')).toBeVisible()
    expect(
      screen.getByText('Eliminamos todos los registros de este navegador.'),
    ).toBeVisible()
  })
})
