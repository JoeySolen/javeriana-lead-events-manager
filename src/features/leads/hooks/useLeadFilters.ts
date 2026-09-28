import { useMemo, useState } from 'react'
import type { Program } from '../../programs/types'
import type { Lead } from '../types'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

export function useLeadFilters(leads: Lead[], programs: Program[]) {
  const [query, setQuery] = useState('')
  const [programId, setProgramId] = useState('')

  const programNames = useMemo(
    () => new Map(programs.map((program) => [program.id, program.name])),
    [programs],
  )

  const availablePrograms = useMemo(() => {
    const registeredIds = new Set(leads.map((lead) => lead.programId))
    return programs.filter((program) => registeredIds.has(program.id))
  }, [leads, programs])

  const activeProgramId = availablePrograms.some(
    (program) => program.id === programId,
  )
    ? programId
    : ''

  const filteredLeads = useMemo(() => {
    const normalizedQuery = normalize(query)
    return leads.filter((lead) => {
      const matchesProgram =
        !activeProgramId || lead.programId === activeProgramId
      const matchesQuery =
        !normalizedQuery ||
        normalize(lead.fullName).includes(normalizedQuery) ||
        normalize(lead.email).includes(normalizedQuery)
      return matchesProgram && matchesQuery
    })
  }, [activeProgramId, leads, query])

  return {
    query,
    programId: activeProgramId,
    programNames,
    availablePrograms,
    filteredLeads,
    setQuery,
    setProgramId,
    clearFilters: () => {
      setQuery('')
      setProgramId('')
    },
  }
}
