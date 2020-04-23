import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Save from '@material-ui/icons/Save'
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
import clsx from 'clsx'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { generatePath, useHistory, useRouteMatch } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { ContentList, isReferenceField } from '../content-list'
import { useDialog } from '../dialogs'

const searchDebounceTime = 400
export interface QueryData {
  term: string
  title?: string
  hideSearchBar?: boolean
  fieldsToDisplay?: Array<keyof GenericContent>
  showAddButton?: boolean
  parentPath?: string
  allowedTypes?: string[]
}

export const encodeQueryData = (data: QueryData) => encodeURIComponent(btoa(JSON.stringify(data)))
export const decodeQueryData = (encoded?: string) =>
  encoded ? (JSON.parse(atob(decodeURIComponent(encoded))) as QueryData) : { term: '' }

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
  const match = useRouteMatch<{ queryData?: string }>()
  const history = useHistory()
  const { openDialog } = useDialog()
  const logger = useLogger('Search')
  const [queryData, setQueryData] = useState<QueryData>(decodeQueryData(match.params.queryData))
  const selectionService = useSelectionService()
  const localization = useLocalization().search
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [result, setResult] = useState<GenericContent[]>([])
  const [error, setError] = useState('')
  const loadSettingsContext = useContext(LoadSettingsContext)
  const personalSettings = useContext(ResponsivePersonalSettings)

  const requestReload = useCallback(
    debounce((qd: QueryData, term: string) => {
      setQueryData({ ...qd, term })
    }, searchDebounceTime),
    [],
  )

  useEffect(() => {
    try {
      const data = decodeQueryData(match.params.queryData || '{}')
      setQueryData(data)
    } catch {
      logger.warning({ message: 'Wrong link :(' })
    }
  }, [logger, match.params.queryData])

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setResult([])
        history.push(generatePath(match.path, { ...match.params, queryData: encodeQueryData(queryData) }))

        const r = await repo.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            ...loadSettingsContext.loadChildrenSettings,
            select: ['Actions', ...(queryData.fieldsToDisplay || [])],
            expand: ['Actions', ...(queryData.fieldsToDisplay || []).filter((f) => isReferenceField(f, repo))],
            query: personalSettings.commandPalette.wrapQuery.replace('{0}', queryData.term),
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
    })()
    // loadSettings should be excluded :(
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadSettingsContext.loadChildrenSettings,
    queryData.term,
    repo,
    personalSettings.commandPalette.wrapQuery,
    logger,
  ])

  return (
    <div className={globalClasses.contentWrapper}>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
        <span style={{ fontSize: '20px' }}>{queryData.title || localization.title}</span>
      </div>
      <div className={globalClasses.centeredVertical}>
        {queryData.hideSearchBar ? null : (
          <div className={classes.searchBar}>
            <TextField
              label={localization.queryLabel}
              helperText={localization.queryHelperText}
              defaultValue={queryData.term}
              fullWidth={true}
              onChange={(ev) => {
                if (queryData.term !== ev.target.value) {
                  // setQueryData({ ...queryData, term: ev.target.value })
                  requestReload(queryData, ev.target.value)
                }
              }}
            />
            <Button
              style={{ flexShrink: 0 }}
              title={localization.saveQuery}
              onClick={() => {
                openDialog({
                  name: 'save-query',
                  props: { queryData, saveName: `Search results for '${queryData.term}'` },
                })
              }}>
              <Save style={{ marginRight: 8 }} />
              {localization.saveQuery}
            </Button>
          </div>
        )}
      </div>
      {error ? (
        <Typography color="error" variant="subtitle1" style={{ margin: '1em' }}>
          {error}
        </Typography>
      ) : null}
      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={result}>
          <CurrentAncestorsContext.Provider value={[]}>
            <ContentList
              style={{
                height: '100%',
                overflow: 'auto',
              }}
              enableBreadcrumbs={false}
              fieldsToDisplay={queryData.fieldsToDisplay}
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
