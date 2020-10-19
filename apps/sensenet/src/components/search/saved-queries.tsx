import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { Query } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useRepository,
  useRepositoryEvents,
} from '@sensenet/hooks-react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization, useQuery, useSelectionService } from '../../hooks'
import { navigateToAction } from '../../services'
import { pathWithQueryParams } from '../../services/query-string-builder'
import { ContentList } from '../content-list/content-list'
import { BrowseView, EditView, VersionView } from '../view-controls'

export default function SavedQueries() {
  const repo = useRepository()
  const localization = useLocalization().search
  const history = useHistory()
  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])

  const [reloadToken, setReloadToken] = useState(Math.random())
  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const loadSettingsContext = useContext(LoadSettingsContext)

  const eventHub = useRepositoryEvents()
  const globalClasses = useGlobalStyles()
  const selectionService = useSelectionService()

  const activeContent = useQuery().get('content') ?? ''
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const activeAction = routeMatch.params.action

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentModified.subscribe(() => requestReload()),
      eventHub.onContentCopied.subscribe(() => requestReload()),
      eventHub.onContentCreated.subscribe(() => requestReload()),
      eventHub.onContentDeleted.subscribe(() => requestReload()),
    ]
    return () => subscriptions.forEach((s) => s.dispose())
  }, [
    eventHub.onContentCopied,
    eventHub.onContentCreated,
    eventHub.onContentDeleted,
    eventHub.onContentModified,
    requestReload,
  ])

  useEffect(() => {
    repo
      .executeAction<undefined, { d: { results: Query[] } }>({
        idOrPath: '/Root/Content',
        name: 'GetQueries',
        method: 'GET',
        oDataOptions: {
          ...loadSettingsContext.loadChildrenSettings,
          select: ['Query', 'Icon'],
          onlyPublic,
        } as any,
        body: undefined,
      })
      .then((result) => setQueries(result.d.results))
  }, [reloadToken, loadSettingsContext.loadChildrenSettings, repo, onlyPublic])

  const renderContent = () => {
    switch (activeAction) {
      case 'browse':
        return <BrowseView contentPath={`${PATHS.savedQueries.snPath}${activeContent}`} />
      case 'edit':
        return (
          <EditView
            actionName={activeAction}
            contentPath={`${PATHS.savedQueries.snPath}${activeContent}`}
            submitCallback={() => navigateToAction({ history, routeMatch })}
          />
        )
      case 'version':
        return <VersionView contentPath={`${PATHS.savedQueries.snPath}${activeContent}`} />
      default:
        return (
          <>
            <div style={{ padding: '0 15px', marginBottom: '2rem' }}>
              <FormControlLabel
                label={localization.onlyPublic}
                control={
                  <Checkbox
                    color="primary"
                    onChange={(ev) => {
                      setOnlyPublic(ev.target.checked)
                    }}
                  />
                }
              />
            </div>
            <>
              {queries.length > 0 ? (
                <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
                  <CurrentChildrenContext.Provider value={queries}>
                    <CurrentAncestorsContext.Provider value={[]}>
                      <ContentList
                        style={{
                          height: 'calc(100% - 107px)',
                          overflow: 'auto',
                        }}
                        enableBreadcrumbs={false}
                        parentIdOrPath={0}
                        onParentChange={() => {
                          // ignore, only queries will be listed
                        }}
                        onActivateItem={(p: Query) => {
                          history.push(
                            pathWithQueryParams({ path: PATHS.search.appPath, newParams: { term: p.Query } }),
                          )
                        }}
                        onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
                      />
                    </CurrentAncestorsContext.Provider>
                  </CurrentChildrenContext.Provider>
                </CurrentContentContext.Provider>
              ) : (
                <Typography variant="subtitle1" style={{ padding: '0 15px' }}>
                  {localization.noSavedQuery}
                </Typography>
              )}
            </>
          </>
        )
    }
  }

  return (
    <>
      <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)} style={{ padding: '0 15px' }}>
        <span style={{ fontSize: '20px' }}>{localization.savedQueries}</span>
      </div>
      {renderContent()}
    </>
  )
}
