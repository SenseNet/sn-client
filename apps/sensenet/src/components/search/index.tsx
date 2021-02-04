import { ConstantContent, ODataFieldParameter } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useLogger,
  useRepository,
} from '@sensenet/hooks-react'
import { createStyles, IconButton, InputAdornment, makeStyles, TextField, Theme, Typography } from '@material-ui/core'
import Bookmark from '@material-ui/icons/Bookmark'
import Cancel from '@material-ui/icons/Cancel'
import clsx from 'clsx'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService, useSnRoute } from '../../hooks'
import { useQuery } from '../../hooks/use-query'
import { getPrimaryActionUrl, pathWithQueryParams } from '../../services'
import { ContentList } from '../content-list'
import { useDialog } from '../dialogs'

const searchDebounceTime = 400

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    contentWrapper: {
      paddingRight: 30,
    },
    inputButton: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
    },
    searchBar: {
      display: 'flex',
      width: '100%',
      marginLeft: '1em',
      marginBottom: '1rem',
    },
  })
})

export const Search = () => {
  const repository = useRepository()
  const termFromQuery = useQuery().get('term')
  const history = useHistory()
  const { location } = history
  const { openDialog } = useDialog()
  const logger = useLogger('Search')
  const [query, setQuery] = useState(termFromQuery || undefined)
  const selectionService = useSelectionService()
  const localization = useLocalization().search
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [result, setResult] = useState<GenericContent[]>()
  const [resultCount, setResultCount] = useState(0)
  const [error, setError] = useState<string>()
  const loadSettingsContext = useContext(LoadSettingsContext)
  const uiSettings = useContext(ResponsivePersonalSettings)
  const searchInputRef = useRef<HTMLInputElement>()
  const snRoute = useSnRoute()

  const debouncedQuery = useCallback(
    debounce((a: string) => setQuery(a), searchDebounceTime),
    [],
  )

  useEffect(() => {
    if (!termFromQuery) {
      if (searchInputRef.current) {
        setResult([])
        searchInputRef.current.value = ''
        searchInputRef.current.focus()
      }
      return
    }

    if (searchInputRef.current) {
      searchInputRef.current.value = termFromQuery
    }
    setQuery((currentState) => (currentState !== termFromQuery ? termFromQuery : currentState))
  }, [termFromQuery])

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!query) {
        history.push(PATHS.search.appPath)
        setResult([])
        setResultCount(0)
        return
      }
      try {
        history.push(pathWithQueryParams({ path: PATHS.search.appPath, newParams: { term: query } }))

        const extendedQuery = `${query.trim()}* .AUTOFILTERS:OFF`
        const r = await repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...loadSettingsContext.loadChildrenSettings,
            select: Array.isArray(repository.configuration.requiredSelect)
              ? [
                  'DisplayName',
                  'Path',
                  ...(repository.configuration.requiredSelect as string[]).map((field) => `ModifiedBy/${field}`),
                ]
              : repository.configuration.requiredSelect,
            expand: ['ModifiedBy'],
            query: extendedQuery,
          },
          requestInit: { signal: ac.signal },
        })
        setError('')
        setResult(r.d.results)
        setResultCount(r.d.__count)
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e.message)
          setResult([])
          setResultCount(0)
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [history, loadSettingsContext.loadChildrenSettings, logger, query, repository])

  return (
    <div className={clsx(globalClasses.contentWrapper, classes.contentWrapper)}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localization.title}</span>
      </div>
      <div className={globalClasses.centeredVertical}>
        <div className={classes.searchBar}>
          <TextField
            data-test="input-search"
            helperText={localization.queryHelperText}
            defaultValue={query}
            fullWidth={true}
            inputRef={searchInputRef}
            onChange={(ev) => {
              debouncedQuery(ev.target.value)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {query && (
                    <IconButton
                      className={classes.inputButton}
                      aria-label={localization.clearTerm}
                      onClick={() => null}>
                      <Cancel onClick={() => setQuery(undefined)} />
                    </IconButton>
                  )}
                  <IconButton
                    className={classes.inputButton}
                    aria-label={localization.saveQuery}
                    title={localization.saveQuery}
                    onClick={() => {
                      // We don't want to save empty queries
                      if (!query) {
                        return
                      }
                      openDialog({
                        name: 'save-query',
                        props: { query, saveName: `Search results for '${query}'` },
                      })
                    }}>
                    <Bookmark />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      {error ? (
        <Typography color="error" variant="caption" style={{ margin: '0 1rem 1rem' }}>
          {error}
        </Typography>
      ) : null}
      <Typography style={{ margin: '1rem' }}>About {resultCount} results</Typography>
      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={result || []}>
          <CurrentAncestorsContext.Provider value={[]}>
            <ContentList
              style={{
                height: '100%',
                overflow: 'auto',
              }}
              fieldsToDisplay={['DisplayName', 'Path', 'ModifiedBy', 'Actions']}
              enableBreadcrumbs={false}
              parentIdOrPath={0}
              onParentChange={(p) => {
                history.push(getPrimaryActionUrl({ content: p, repository, uiSettings, location, snRoute }))
              }}
              onActivateItem={async (item) => {
                const expandedItem = await repository.load({
                  idOrPath: item.Id,
                  oDataOptions: {
                    select: Array.isArray(repository.configuration.requiredSelect)
                      ? ([...repository.configuration.requiredSelect, 'Actions/Name'] as ODataFieldParameter<
                          GenericContent
                        >)
                      : repository.configuration.requiredSelect,
                    expand: ['Actions'] as ODataFieldParameter<GenericContent>,
                  },
                })
                history.push(
                  getPrimaryActionUrl({ content: expandedItem.d, repository, uiSettings, location, snRoute }),
                )
              }}
              onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
            />
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>
    </div>
  )
}

export default Search
