import { PROGRAM_CATEGORIES, type Program } from '../types'

function isProgram(value: unknown): value is Program {
  if (typeof value !== 'object' || value === null) return false

  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.trim().length > 0 &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    'description' in value &&
    typeof value.description === 'string' &&
    'category' in value &&
    PROGRAM_CATEGORIES.some((category) => category === value.category)
  )
}

export async function getPrograms(signal?: AbortSignal): Promise<Program[]> {
  const url =
    import.meta.env.VITE_PROGRAMS_API_URL ||
    `${import.meta.env.BASE_URL}api/programs.json`
  const response = await fetch(url, signal ? { signal } : {})

  if (!response.ok)
    throw new Error('No pudimos cargar la oferta académica. Intenta de nuevo.')

  const data: unknown = await response.json()
  if (!Array.isArray(data) || !data.every(isProgram)) {
    throw new Error('La respuesta del catálogo tiene un formato inesperado.')
  }
  if (new Set(data.map((program) => program.id)).size !== data.length) {
    throw new Error('El catálogo contiene identificadores repetidos.')
  }
  return data
}
