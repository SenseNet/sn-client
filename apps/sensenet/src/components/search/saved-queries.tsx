import { Typography } from '@material-ui/core'
import { debounce } from '@sensenet/client-utils'
import { Query } from '@sensenet/default-content-types'
import { LoadSettingsContext, useRepository, useRepositoryEvents } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { useLocalization, useQuery, useSelectionService } from '../../hooks'
import { navigateToAction } from '../../services'
import { Content } from '../content'
import { savedQueriesColumnDefs } from '../grid/Cols/ColumnDefs.'
import { PageTitle } from '../PageTitle'
import { BrowseView, EditView, VersionView } from '../view-controls'

export default function SavedQueries() {
  const repo = useRepository()
  const { search: localization, pageTitles } = useLocalization()
  const history = useHistory()
  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])

  const [reloadToken, setReloadToken] = useState(Math.random())
  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const loadSettingsContext = useContext(LoadSettingsContext)

  const eventHub = useRepositoryEvents()
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
      .then((result) => {
        setQueries(result.d.results)
      })
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
            {queries.length > 0 ? (
              <Content rootPath={PATHS.savedQueries.snPath} colDef={savedQueriesColumnDefs} />
            ) : (
              <Typography variant="subtitle1" style={{ padding: '0 15px' }}>
                {localization.noSavedQuery}
              </Typography>
            )}
          </>
        )
    }
  }

  return (
    <>
      <PageTitle title={pageTitles.savedQueries} />
      {renderContent()}
    </>
  )
}
