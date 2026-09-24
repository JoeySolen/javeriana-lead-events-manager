import { beforeEach, describe, expect, it, vi } from 'vitest'
import { appendLead, LEADS_STORAGE_KEY, readLeads } from './leadsStorage'
import type { Lead } from '../types'

const lead: Lead = {
  id: '1',
  fullName: 'María Pérez',
  email: 'maria@example.com',
  programId: '1',
  createdAt: '2026-09-24T00:00:00.000Z',
}
beforeEach(() => localStorage.clear())

describe('persistencia de leads', () => {
  it('recupera registros previamente guardados y conserva los anteriores al añadir', () => {
    expect(readLeads()).toEqual([])
    appendLead(lead)
    appendLead({ ...lead, id: '2', programId: '2' })
    expect(readLeads()).toHaveLength(2)
    expect(readLeads()[1]).toEqual(lead)
  })
  it('impide duplicados por correo y programa', () => {
    appendLead(lead)
    expect(() =>
      appendLead({ ...lead, id: '2', email: 'MARIA@example.com' }),
    ).toThrow('ya está registrado')
    expect(readLeads()).toEqual([lead])
  })
  it.each([
    '{malformed',
    '{}',
    '{"version":2,"leads":[]}',
    '{"version":1,"leads":[{}]}',
  ])('conserva datos corruptos sin sobrescribir: %s', (raw) => {
    localStorage.setItem(LEADS_STORAGE_KEY, raw)
    expect(() => appendLead(lead)).toThrow('formato inválido')
    expect(localStorage.getItem(LEADS_STORAGE_KEY)).toBe(raw)
  })
  it('informa cuando el navegador bloquea la lectura', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'SecurityError')
    })
    expect(readLeads).toThrow('No se puede acceder')
  })
  it('informa un fallo de escritura y conserva los datos existentes', () => {
    appendLead(lead)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Full', 'QuotaExceededError')
    })
    expect(() => appendLead({ ...lead, id: '2', programId: '2' })).toThrow(
      'No pudimos guardar',
    )
    expect(readLeads()).toEqual([lead])
  })
})
