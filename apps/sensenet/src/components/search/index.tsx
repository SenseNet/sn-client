import { ConstantContent } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useLogger,
  useRepository,
} from '@sensenet/hooks-react'
import { debounce } from '@sensenet/client-utils'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Save from '@material-ui/icons/Save'
import clsx from 'clsx'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { useQuery } from '../../hooks/use-query'
import { getPrimaryActionUrl } from '../../services'
import { ContentList } from '../content-list'
import { useDialog } from '../dialogs'
import { applicationPaths } from '../../application-paths'

const searchDebounceTime = 700

const useStyles = makeStyles(() => {
  return createStyles({
    searchBar: {
      display: 'flex',
      width: '100%',
      marginLeft: '1em',
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
  const personalSettings = useContext(ResponsivePersonalSettings)

  const debouncedQuery = useCallback(
    debounce((a: string) => setQuery(a), searchDebounceTime),
    [],
  )

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!query) {
        history.push(applicationPaths.search)
        setResult([])
        return
      }
      try {
        setResult([])
        history.push(`${applicationPaths.search}?term=${encodeURIComponent(query)}`)

        const r = await repo.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...loadSettingsContext.loadChildrenSettings,
            select: ['Actions'],
            expand: ['Actions'],
            query: personalSettings.commandPalette.wrapQuery.replace('{0}', query),
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
  }, [
    history,
    loadSettingsContext.loadChildrenSettings,
    logger,
    personalSettings.commandPalette.wrapQuery,
    query,
    repo,
  ])

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{localization.title}</span>
      </div>
      <div className={globalClasses.centeredVertical}>
        <div className={classes.searchBar}>
          <TextField
            label={localization.queryLabel}
            helperText={localization.queryHelperText}
            defaultValue={query}
            fullWidth={true}
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
              onTabRequest={() => {
                /** */
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
