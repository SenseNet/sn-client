import { Query } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { Filters as FiltersInterface, SearchProvider } from '../../context/search'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useQuery } from '../../hooks/use-query'
import { createSearchQuery } from '../../services/search-query-builder'
import { FullScreenLoader } from '../full-screen-loader'
import { Filters } from './filters'
import { defaultDateFilter } from './filters/date-filter'
import { defaultReferenceFilter } from './filters/reference-filter'
import { SearchBar } from './search-bar'
import { SearchResults } from './search-results'

export interface SearchFilters {
  term: string
  filters: FiltersInterface
}

const useStyles = makeStyles(() => {
  return createStyles({
    contentWrapper: {
      paddingRight: 30,
    },
  })
})

export const Search = () => {
  const queryFromUrl = useQuery().get('query') ?? undefined
  const termFromUrl = useQuery().get('term') ?? undefined
  const logger = useLogger('search')
  const history = useHistory()
  const localization = useLocalization().search
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const repository = useRepository()
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>()

  useEffect(() => {
    ;(async () => {
      if (!queryFromUrl) {
        return
      }

      try {
        const response = await repository.load<Query>({
          idOrPath: queryFromUrl,
          oDataOptions: {
            select: ['Query', 'UiFilters'] as any,
          },
        })

        if (response.d.UiFilters) {
          const filters = JSON.parse(response.d.UiFilters)

          if (response.d.Query !== createSearchQuery(filters).toString()) {
            throw new Error(localization.invalidSavedQuery)
          }
          setSearchFilters(filters)
        } else {
          setSearchFilters({ term: undefined, filters: undefined })
        }
      } catch (error) {
        history.push(PATHS.search.appPath)
        logger.error({
          message: error.message || localization.errorGetQuery,
          data: {
            error,
          },
        })
        return false
      }
    })()
  }, [repository, queryFromUrl, history, logger, localization.errorGetQuery, localization.invalidSavedQuery])

  if (queryFromUrl && !searchFilters) {
    return <FullScreenLoader />
  }

  return (
    <SearchProvider
      defaultTerm={queryFromUrl ? searchFilters?.term ?? '' : termFromUrl}
      defaultFilters={searchFilters?.filters}>
      <div className={clsx(globalClasses.contentWrapper, classes.contentWrapper)}>
        <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
          <span style={{ fontSize: '20px' }}>{localization.title}</span>
        </div>

        <SearchBar />

        <Filters
          defaultFilterVisibility={
            queryFromUrl
              ? !!searchFilters?.filters?.path ||
                searchFilters?.filters?.date.name !== defaultDateFilter.name ||
                searchFilters?.filters?.reference.name !== defaultReferenceFilter.name
              : false
          }
        />

        <SearchResults />
      </div>
    </SearchProvider>
  )
}

export default Search
