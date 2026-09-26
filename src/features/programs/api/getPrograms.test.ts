import { describe, expect, it, vi } from 'vitest'
import catalog from '../../../../public/api/programs.json'
import { getPrograms } from './getPrograms'

describe('getPrograms', () => {
  it('usa el endpoint configurable y transmite la señal de cancelación', async () => {
    vi.stubEnv('VITE_PROGRAMS_API_URL', '/api/test')
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([])))
    vi.stubGlobal('fetch', fetchMock)
    const signal = new AbortController().signal
    await expect(getPrograms(signal)).resolves.toEqual([])
    expect(fetchMock).toHaveBeenCalledWith('/api/test', { signal })
  })

  it('informa fallos HTTP', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    )
    await expect(getPrograms()).rejects.toThrow('No pudimos cargar')
  })

  it.each([
    { programs: [] },
    [{ id: '1', name: 'Programa', description: 'Ejemplo', category: 'Otro' }],
    [{ id: '1', category: 'Pregrado' }],
  ])('rechaza datos incompatibles: %j', async (data) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(data))),
    )
    await expect(getPrograms()).rejects.toThrow('formato inesperado')
  })

  it('rechaza identificadores duplicados', async () => {
    const program = {
      id: '1',
      name: 'Programa',
      description: 'Ejemplo',
      category: 'Pregrado',
    }
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify([program, program]))),
    )
    await expect(getPrograms()).rejects.toThrow('identificadores repetidos')
  })

  it('acepta el catálogo incluido en public/api', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(catalog))),
    )
    const programs = await getPrograms()
    expect(programs.length).toBeGreaterThan(200)
    expect(new Set(programs.map((program) => program.category))).toEqual(
      new Set(['Pregrado', 'Posgrado']),
    )
  })
})
