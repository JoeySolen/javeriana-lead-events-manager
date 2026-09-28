const MOCKAROO_PROGRAMS_URL = 'https://my.api.mockaroo.com/programs.json'

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

export async function handleProgramsRequest(
  request: Request,
): Promise<Response> {
  if (request.method !== 'GET') {
    return json(
      { error: 'Método no permitido.' },
      { status: 405, headers: { Allow: 'GET' } },
    )
  }

  const apiKey = process.env.MOCKAROO_API_KEY
  if (!apiKey) {
    return json(
      { error: 'El servicio de programas no está configurado.' },
      { status: 500 },
    )
  }

  try {
    const upstreamResponse = await fetch(MOCKAROO_PROGRAMS_URL, {
      headers: {
        Accept: 'application/json',
        'X-API-Key': apiKey,
      },
      signal: AbortSignal.timeout(8_000),
    })

    if (!upstreamResponse.ok) {
      return json(
        { error: 'No pudimos consultar el catálogo de programas.' },
        { status: 502 },
      )
    }

    const programs: unknown = await upstreamResponse.json()
    if (!Array.isArray(programs)) {
      return json(
        { error: 'El proveedor devolvió un formato inesperado.' },
        { status: 502 },
      )
    }

    return json(programs, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return json(
      { error: 'No pudimos conectar con el catálogo de programas.' },
      { status: 502 },
    )
  }
}

export default {
  fetch: handleProgramsRequest,
}
