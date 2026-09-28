import { useCallback, useEffect, useState } from 'react'
import {
  appendLead,
  clearLeads,
  LEADS_STORAGE_KEY,
  readLeads,
  removeLead,
} from '../storage/leadsStorage'
import type { Lead, LeadInput } from '../types'

function load(): { leads: Lead[]; error: string | null } {
  try {
    return { leads: readLeads(), error: null }
  } catch (error) {
    return {
      leads: [],
      error:
        error instanceof Error
          ? error.message
          : 'No se pudieron leer los registros.',
    }
  }
}

export function useLeads() {
  const [state, setState] = useState(load)
  useEffect(() => {
    function sync(event: StorageEvent) {
      if (event.key === LEADS_STORAGE_KEY || event.key === null)
        setState(load())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const addLead = useCallback((input: LeadInput): Lead => {
    const lead: Lead = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const leads = appendLead(lead)
    setState({ leads, error: null })
    return lead
  }, [])

  const deleteLead = useCallback((id: string) => {
    const leads = removeLead(id)
    setState({ leads, error: null })
  }, [])

  const deleteAllLeads = useCallback(() => {
    const leads = clearLeads()
    setState({ leads, error: null })
  }, [])

  return { ...state, addLead, deleteLead, deleteAllLeads }
}
