import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { PATHS } from '../application-paths'
import { Filter as DateFilterInterface, defaultDateFilter } from '../components/search/filters/date-filter'
import {
  defaultReferenceFilter,
  Filter as ReferenceFilterInterface,
} from '../components/search/filters/reference-filter'
import { defaultTypeFilter, Filter as TypeFilterInterface } from '../components/search/filters/type-filter'
import { pathWithQueryParams } from '../services'
import { createSearchQuery } from '../services/search-query-builder'

export interface Filters {
  type: TypeFilterInterface
  path?: GenericContent
  date: DateFilterInterface
  reference: ReferenceFilterInterface
}

const SearchContext = createContext<{
  term: string
  setTerm: React.Dispatch<React.SetStateAction<string>>
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  result: GenericContent[]
  error: string
}>({
  term: '',
  setTerm: () => null,
  filters: {
    type: defaultTypeFilter,
    path: undefined,
    date: defaultDateFilter,
    reference: defaultReferenceFilter,
  },
  setFilters: () => null,
  result: [],
  error: '',
})

export function SearchProvider({
  defaultTerm,
  defaultFilters,
  children,
}: PropsWithChildren<{ defaultTerm?: string; defaultFilters?: Filters }>) {
  const repository = useRepository()
  const history = useHistory()

  const [term, setTerm] = useState(defaultTerm ?? '')
  const [result, setResult] = useState<GenericContent[]>([])
  const [error, setError] = useState('')

  const [filters, setFilters] = useState<Filters>(
    defaultFilters ?? {
      type: defaultTypeFilter,
      path: undefined,
      date: defaultDateFilter,
      reference: defaultReferenceFilter,
    },
  )

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!term) {
        setResult([])
        history.push(PATHS.search.appPath)
        return
      }

      try {
        const response = await repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            query: createSearchQuery({ term, filters }).toString(),
          },
          requestInit: { signal: ac.signal },
        })
        setError('')
        setResult(response.d.results)
        history.push(pathWithQueryParams({ path: PATHS.search.appPath, newParams: { term } }))
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e.message)
          setResult([])
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [term, repository, history, filters])

  return (
    <SearchContext.Provider value={{ term, setTerm, filters, setFilters, result, error }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)

  if (!context) {
    throw new Error('useSearchFilter must be used within a SearchFilterProvider')
  }
  return context
}
