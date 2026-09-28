import type { Lead } from '../types'
import { isValidEmail } from '../utils/validation'

export const LEADS_STORAGE_KEY = 'javeriana.leads.v1'

function writeLeads(leads: Lead[]): void {
  try {
    window.localStorage.setItem(
      LEADS_STORAGE_KEY,
      JSON.stringify({ version: 1, leads }),
    )
  } catch {
    throw new Error(
      'No pudimos actualizar los registros. Revisa el espacio y los permisos del navegador e intenta de nuevo.',
    )
  }
}

function isLead(value: unknown): value is Lead {
  if (typeof value !== 'object' || value === null) return false
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    'fullName' in value &&
    typeof value.fullName === 'string' &&
    value.fullName.trim().length >= 2 &&
    'email' in value &&
    typeof value.email === 'string' &&
    isValidEmail(value.email) &&
    'programId' in value &&
    typeof value.programId === 'string' &&
    value.programId.length > 0 &&
    'createdAt' in value &&
    typeof value.createdAt === 'string' &&
    Number.isFinite(Date.parse(value.createdAt))
  )
}

export function readLeads(): Lead[] {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(LEADS_STORAGE_KEY)
  } catch {
    throw new Error(
      'No se puede acceder al almacenamiento local. Habilítalo en el navegador e intenta de nuevo.',
    )
  }
  if (raw === null) return []
  try {
    const data: unknown = JSON.parse(raw)
    if (
      typeof data !== 'object' ||
      data === null ||
      !('version' in data) ||
      data.version !== 1 ||
      !('leads' in data) ||
      !Array.isArray(data.leads) ||
      !data.leads.every(isLead)
    )
      throw new Error('Invalid storage')
    if (new Set(data.leads.map((lead) => lead.id)).size !== data.leads.length)
      throw new Error('Duplicate IDs')
    return data.leads
  } catch {
    throw new Error(
      'Los registros locales tienen un formato inválido. Se han conservado sin cambios; revisa el almacenamiento antes de registrar nuevos interesados.',
    )
  }
}

export function appendLead(lead: Lead): Lead[] {
  // Read immediately before writing so a stale UI does not overwrite earlier registrations.
  const current = readLeads()
  if (
    current.some(
      (item) =>
        item.email.toLowerCase() === lead.email.toLowerCase() &&
        item.programId === lead.programId,
    )
  ) {
    throw new Error(
      'Este correo ya está registrado en el programa seleccionado.',
    )
  }
  const next = [lead, ...current]
  try {
    writeLeads(next)
  } catch {
    throw new Error(
      'No pudimos guardar el registro. Revisa el espacio y los permisos del navegador e intenta de nuevo.',
    )
  }
  return next
}

export function removeLead(id: string): Lead[] {
  const current = readLeads()
  const next = current.filter((lead) => lead.id !== id)
  if (next.length === current.length) return current
  writeLeads(next)
  return next
}

export function clearLeads(): Lead[] {
  readLeads()
  try {
    window.localStorage.removeItem(LEADS_STORAGE_KEY)
  } catch {
    throw new Error(
      'No pudimos eliminar los registros. Revisa los permisos del navegador e intenta de nuevo.',
    )
  }
  return []
}
