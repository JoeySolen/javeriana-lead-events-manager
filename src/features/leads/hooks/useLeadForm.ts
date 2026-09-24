import { useState, type FormEvent } from 'react'
import type { Program } from '../../programs/types'
import type { Lead, LeadInput } from '../types'
import {
  normalizeLead,
  validateLead,
  type LeadErrors,
} from '../utils/validation'

export function useLeadForm(
  programs: Program[],
  programId: string,
  onProgramChange: (id: string) => void,
  addLead: (input: LeadInput) => Lead,
) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<LeadErrors>({})
  const [notice, setNotice] = useState<{
    kind: 'success' | 'error'
    text: string
  } | null>(null)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)
    const input = normalizeLead({ fullName, email, programId })
    const nextErrors = validateLead(
      input,
      programs.map((program) => program.id),
    )
    setErrors(nextErrors)
    const firstError = (['fullName', 'email', 'programId'] as const).find(
      (field) => nextErrors[field],
    )
    if (firstError) {
      document.getElementById(`lead-${firstError}`)?.focus()
      return
    }
    try {
      const lead = addLead(input)
      const program = programs.find((item) => item.id === lead.programId)
      setNotice({
        kind: 'success',
        text: `${lead.fullName}, tu interés en ${program?.name ?? 'el programa'} quedó registrado con ${lead.email}.`,
      })
      setFullName('')
      setEmail('')
      onProgramChange('')
    } catch (error: unknown) {
      setNotice({
        kind: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'No pudimos guardar el registro. Intenta de nuevo.',
      })
    }
  }

  function clearFeedback(field: keyof LeadInput) {
    setNotice(null)
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      return next
    })
  }
  // A card can change the selection outside the form's own change handler.
  const visibleErrors = { ...errors }
  if (programs.some((program) => program.id === programId))
    delete visibleErrors.programId
  return {
    fullName,
    email,
    errors: visibleErrors,
    notice,
    submit,
    changeName: (value: string) => {
      setFullName(value)
      clearFeedback('fullName')
    },
    changeEmail: (value: string) => {
      setEmail(value)
      clearFeedback('email')
    },
    changeProgram: (value: string) => {
      onProgramChange(value)
      clearFeedback('programId')
    },
  }
}
