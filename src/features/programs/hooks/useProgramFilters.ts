import { useMemo, useState } from 'react'
import type { Program } from '../types'

const searchable = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es').trim()

export function useProgramFilters(programs: Program[]) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const filtered = useMemo(
    () =>
      programs.filter(
        (program) =>
          (!category || program.category === category) &&
          searchable(program.name).includes(searchable(query)),
      ),
    [programs, query, category],
  )
  function clearFilters() {
    setQuery('')
    setCategory('')
  }
  return { query, setQuery, category, setCategory, filtered, clearFilters }
}
