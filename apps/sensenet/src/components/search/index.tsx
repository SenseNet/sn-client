import { ConstantContent } from '@sensenet/client-core'
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
import { Button, createStyles, makeStyles, TextField, Typography } from '@material-ui/core'
import Save from '@material-ui/icons/Save'
import clsx from 'clsx'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { useQuery } from '../../hooks/use-query'
import { getPrimaryActionUrl, pathWithQueryParams } from '../../services'
import { ContentList } from '../content-list'
import { useDialog } from '../dialogs'

const searchDebounceTime = 400

const useStyles = makeStyles(() => {
  return createStyles({
    searchBar: {
      display: 'flex',
      width: '100%',
      marginLeft: '1em',
      marginBottom: '1rem',
    },
  })
})

export const Search = () => {
  const repo = useRepository()
  const termFromQuery = useQuery().get('term')
  const history = useHistory()
  const { openDialog } = useDialog()
  const logger = useLogger('Search')
  const [query, setQuery] = useState(termFromQuery ? decodeURIComponent(termFromQuery) : undefined)
  const selectionService = useSelectionService()
  const localization = useLocalization().search
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [result, setResult] = useState<GenericContent[]>()
  const [error, setError] = useState<string>()
  const loadSettingsContext = useContext(LoadSettingsContext)
  const searchInputRef = useRef<HTMLInputElement>()

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

    const term = decodeURIComponent(termFromQuery)

    if (searchInputRef.current) {
      searchInputRef.current.value = term
    }
    setQuery((currentState) => (currentState !== term ? term : currentState))
  }, [termFromQuery])

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!query) {
        history.push(PATHS.search.appPath)
        setResult([])
        return
      }
      try {
        setResult([])
        history.push(pathWithQueryParams({ path: PATHS.search.appPath, newParams: { term: query } }))

        const extendedQuery = `${query.trim()}* .AUTOFILTERS:OFF`
        const r = await repo.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...loadSettingsContext.loadChildrenSettings,
            select: undefined,
            query: extendedQuery,
          },
          requestInit: { signal: ac.signal },
        })
        setError('')
        setResult(r.d.results)
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e.message)
          setResult([])
          logger.warning({ message: 'Error executing search', data: { details: { error: e }, isDismissed: true } })
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [history, loadSettingsContext.loadChildrenSettings, logger, query, repo])

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localization.title}</span>
      </div>
      <div className={globalClasses.centeredVertical}>
        <div className={classes.searchBar}>
          <TextField
            helperText={localization.queryHelperText}
            defaultValue={query}
            fullWidth={true}
            inputRef={searchInputRef}
            onChange={(ev) => {
              debouncedQuery(ev.target.value)
            }}
          />
          <Button
            style={{ flexShrink: 0 }}
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
            <Save style={{ marginRight: 8 }} />
            {localization.saveQuery}
          </Button>
        </div>
      </div>
      {error ? (
        <Typography color="error" variant="subtitle1" style={{ margin: '1em' }}>
          {error}
        </Typography>
      ) : null}
      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={result || []}>
          <CurrentAncestorsContext.Provider value={[]}>
            <ContentList
              style={{
                height: '100%',
                overflow: 'auto',
              }}
              enableBreadcrumbs={false}
              parentIdOrPath={0}
              onParentChange={(p) => {
                history.push(getPrimaryActionUrl(p, repo))
              }}
              onActivateItem={(p) => {
                history.push(getPrimaryActionUrl(p, repo))
              }}
              onSelectionChange={(sel) => {
                selectionService.selection.setValue(sel)
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
