import type { LeadInput } from '../types'

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

export function normalizeLead(input: LeadInput): LeadInput {
  return {
    fullName: input.fullName
      .normalize('NFC')
      .trim()
      .replace(/\s+/gu, ' ')
      .toLocaleLowerCase('es')
      .replace(
        /\p{L}[\p{L}\p{M}]*/gu,
        (word) => word.charAt(0).toLocaleUpperCase('es') + word.slice(1),
      ),
    email: input.email.trim().toLowerCase(),
    programId: input.programId.trim(),
  }
}

export function isValidEmail(email: string): boolean {
  const local = email.split('@')[0] ?? ''
  return (
    email.length <= 254 &&
    local.length <= 64 &&
    !local.startsWith('.') &&
    !local.endsWith('.') &&
    !local.includes('..') &&
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(
      email,
    )
  )
}

export function validateLead(
  input: LeadInput,
  programIds: readonly string[],
): LeadErrors {
  const errors: LeadErrors = {}
  if (
    input.fullName.length < 2 ||
    input.fullName.length > 100 ||
    !/^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u.test(input.fullName)
  ) {
    errors.fullName =
      'Escribe un nombre de 2 a 100 caracteres, sin números ni símbolos.'
  }
  if (!isValidEmail(input.email))
    errors.email =
      'Escribe un correo válido, por ejemplo nombre@javeriana.edu.co.'
  if (!programIds.includes(input.programId))
    errors.programId = 'Selecciona un programa disponible.'
  return errors
}
