import { useMemo, useState } from 'react'
import { PROGRAM_CATEGORIES, type Program } from '../types'

export const PAGE_SIZE = 12

const searchable = (value: string) =>
  value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('es').trim()

export function useProgramFilters(programs: Program[]) {
  const [query, setQueryState] = useState('')
  const [category, setCategoryState] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const matching = useMemo(
    () =>
      programs.filter((program) =>
        searchable(program.name).includes(searchable(query)),
      ),
    [programs, query],
  )
  const filtered = useMemo(
    () =>
      category
        ? matching.filter((program) => program.category === category)
        : matching,
    [matching, category],
  )
  // Only categories present in the catalog; counts follow the current search.
  const categories = useMemo(
    () =>
      PROGRAM_CATEGORIES.filter((item) =>
        programs.some((program) => program.category === item),
      ).map((item) => ({
        value: item,
        count: matching.filter((program) => program.category === item).length,
      })),
    [programs, matching],
  )

  function setQuery(value: string) {
    setQueryState(value)
    setLimit(PAGE_SIZE)
  }
  function setCategory(value: string) {
    setCategoryState(value)
    setLimit(PAGE_SIZE)
  }
  function clearFilters() {
    setQuery('')
    setCategory('')
  }
  return {
    query,
    setQuery,
    category,
    setCategory,
    categories,
    filtered,
    visible: filtered.slice(0, limit),
    showMore: () => setLimit((value) => value + PAGE_SIZE),
    clearFilters,
  }
}
