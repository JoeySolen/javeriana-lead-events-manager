import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { AppProviders } from './AppProviders'
import {
  LEADS_STORAGE_KEY,
  readLeads,
} from '../features/leads/storage/leadsStorage'

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
  {
    id: '3',
    name: 'Diseño de Experiencias',
    category: 'Educación Continua',
    description: 'Ejemplo',
  },
]
const renderApp = () =>
  render(
    <AppProviders>
      <App />
    </AppProviders>,
  )
const fill = (
  name = '  MARÍA   PÉREZ  ',
  email = 'MARIA@JAVERIANA.EDU.CO',
  programId = '1',
) => {
  fireEvent.change(screen.getByLabelText('Nombre completo'), {
    target: { value: name },
  })
  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('Programa de interés'), {
    target: { value: programId },
  })
}
const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Registrar interés' }))

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

describe('filtros y registro', () => {
  it('combina filtros ignorando tildes, permite limpiar y muestra cero resultados', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    fireEvent.change(screen.getByLabelText('Buscar programa'), {
      target: { value: '  INGENIERIA  ' },
    })
    expect(screen.getAllByRole('article')).toHaveLength(2)
    fireEvent.change(screen.getByLabelText('Categoría'), {
      target: { value: 'Posgrado' },
    })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(
      screen.getByRole('heading', { name: 'Maestría en Ingeniería' }),
    ).toBeVisible()
    fireEvent.change(screen.getByLabelText('Buscar programa'), {
      target: { value: 'inexistente' },
    })
    expect(screen.getByText('No encontramos programas')).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('preselecciona el programa desde su card y enfoca el formulario', async () => {
    renderApp()
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Inscribirme en Maestría en Ingeniería',
      }),
    )
    expect(screen.getByLabelText('Programa de interés')).toHaveValue('2')
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus()
  })

  it('normaliza, confirma los datos guardados y los recupera al montar de nuevo', async () => {
    const { unmount } = renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    fill()
    submit()
    expect(
      screen.getByText(
        /María Pérez, tu interés en Ingeniería de Sistemas quedó registrado con maria@javeriana.edu.co/,
      ),
    ).toBeVisible()
    expect(readLeads()[0]).toMatchObject({
      fullName: 'María Pérez',
      email: 'maria@javeriana.edu.co',
      programId: '1',
    })
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('')
    unmount()
    renderApp()
    expect(screen.getByLabelText('1 registros guardados')).toBeVisible()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
  })

  it('limpia el error de programa al elegir desde una card tras un envío inválido', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    submit()
    expect(screen.getByLabelText('Programa de interés')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Inscribirme en Ingeniería de Sistemas',
      }),
    )
    expect(screen.getByLabelText('Programa de interés')).toHaveValue('1')
    expect(screen.getByLabelText('Programa de interés')).toHaveAttribute(
      'aria-invalid',
      'false',
    )
    expect(
      screen.queryByText('Selecciona un programa disponible.'),
    ).not.toBeInTheDocument()
  })

  it('marca campos inválidos, enfoca el primero y no escribe datos', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    submit()
    expect(screen.getByLabelText('Nombre completo')).toHaveFocus()
    expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(screen.getByLabelText('Programa de interés')).toHaveAttribute(
      'aria-invalid',
      'true',
    )
    expect(localStorage.getItem(LEADS_STORAGE_KEY)).toBeNull()
  })

  it('rechaza duplicados y mantiene el formulario para corregirlos', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    fill()
    submit()
    fill()
    submit()
    expect(screen.getByRole('alert')).toHaveTextContent('ya está registrado')
    expect(screen.getByLabelText('Nombre completo')).toHaveValue(
      '  MARÍA   PÉREZ  ',
    )
    expect(readLeads()).toHaveLength(1)
  })

  it('no anuncia éxito ni borra el formulario si falla el guardado', async () => {
    renderApp()
    await screen.findByRole('heading', { name: 'Ingeniería de Sistemas' })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    fill()
    submit()
    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos guardar')
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue(
      'MARIA@JAVERIANA.EDU.CO',
    )
    expect(screen.queryByText(/quedó registrado con/)).not.toBeInTheDocument()
    expect(screen.getByLabelText('0 registros guardados')).toBeVisible()
  })
})
