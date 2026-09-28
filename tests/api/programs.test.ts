import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleProgramsRequest } from '../../api/programs'

describe('GET /api/programs', () => {
  beforeEach(() => {
    vi.stubEnv('MOCKAROO_API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('rechaza métodos diferentes de GET', async () => {
    const response = await handleProgramsRequest(
      new Request('https://example.com/api/programs', { method: 'POST' }),
    )

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('GET')
  })

  it('falla de forma controlada si falta la clave', async () => {
    vi.stubEnv('MOCKAROO_API_KEY', '')

    const response = await handleProgramsRequest(
      new Request('https://example.com/api/programs'),
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'El servicio de programas no está configurado.',
    })
  })

  it('consulta Mockaroo sin exponer la clave en la respuesta', async () => {
    const programs = [{ id: '1', name: 'Derecho' }]
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json(programs, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const response = await handleProgramsRequest(
      new Request('https://example.com/api/programs'),
    )

    expect(fetchMock).toHaveBeenCalledWith(
      'https://my.api.mockaroo.com/programs.json',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'X-API-Key': 'test-key',
        },
      }),
    )
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=3600')
    await expect(response.json()).resolves.toEqual(programs)
  })

  it('convierte errores del proveedor en una respuesta 502', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 429 })),
    )

    const response = await handleProgramsRequest(
      new Request('https://example.com/api/programs'),
    )

    expect(response.status).toBe(502)
  })
})
