import { describe, expect, it } from 'vitest'
import { normalizeLead, validateLead } from './validation'

const valid = {
  fullName: 'María Pérez',
  email: 'maria@javeriana.edu.co',
  programId: '1',
}

describe('validación y normalización de leads', () => {
  it('limpia espacios y capitaliza nombres con tildes, guiones y apóstrofos', () => {
    expect(
      normalizeLead({
        fullName: "  MARÍA-jOSÉ   d'ÁVILA  ",
        email: '  MARIA@JAVERIANA.EDU.CO  ',
        programId: ' 1 ',
      }),
    ).toEqual({
      fullName: "María-José D'Ávila",
      email: 'maria@javeriana.edu.co',
      programId: '1',
    })
  })
  it.each(['maria@javeriana.edu.co', 'maria+prueba@example.com'])(
    'acepta correo institucional o externo: %s',
    (email) => {
      expect(validateLead({ ...valid, email }, ['1'])).toEqual({})
    },
  )
  it.each([
    'maria@',
    'maria.example.com',
    'maria @example.com',
    'maria@example',
    'maria@-example.com',
    'maria..perez@example.com',
    '.maria@example.com',
  ])('rechaza correo inválido: %s', (email) => {
    expect(validateLead({ ...valid, email }, ['1']).email).toBeDefined()
  })
  it.each(['', 'A', '123', 'María <script>', 'A'.repeat(101)])(
    'rechaza nombre inválido: %s',
    (fullName) => {
      expect(validateLead({ ...valid, fullName }, ['1']).fullName).toBeDefined()
    },
  )
  it('rechaza programas que no pertenecen al catálogo', () => {
    expect(validateLead(valid, ['2']).programId).toBeDefined()
  })
})
