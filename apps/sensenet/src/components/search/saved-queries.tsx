import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { Query } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useInjector,
  useRepositoryEvents,
} from '@sensenet/hooks-react'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useLocalization } from '../../hooks'
import { useRepoState } from '../../services'
import { CollectionComponent } from '../content-list'
import { encodeQueryData } from '.'

const Search: React.FunctionComponent<RouteComponentProps> = props => {
  const repo = useRepoState().getCurrentRepoState()!.repository
  const localization = useLocalization().search
  const injector = useInjector()

  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])

  const [reloadToken, setReloadToken] = useState(Math.random())
  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const loadSettingsContext = useContext(LoadSettingsContext)

  const eventHub = useRepositoryEvents()

  useEffect(() => {
    const subscriptions = [
      eventHub.onContentModified.subscribe(() => requestReload()),
      eventHub.onContentCopied.subscribe(() => requestReload()),
      eventHub.onContentCreated.subscribe(() => requestReload()),
      eventHub.onContentDeleted.subscribe(() => requestReload()),
    ]
    return () => subscriptions.forEach(s => s.dispose())
  }, [
    eventHub.onContentCopied,
    eventHub.onContentCreated,
    eventHub.onContentDeleted,
    eventHub.onContentModified,
    injector,
    repo,
    requestReload,
  ])

  useEffect(() => {
    repo
      .executeAction<undefined, { d: { results: Query[] } }>({
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'GetQueries',
        method: 'GET',
        oDataOptions: {
          ...loadSettingsContext.loadChildrenSettings,
          select: ['Query', 'Icon'],
          onlyPublic,
        } as any,
        body: undefined,
      })
      .then(result => setQueries(result.d.results))
  }, [reloadToken, loadSettingsContext.loadChildrenSettings, repo, onlyPublic])
  return (
    <div style={{ padding: '1em', margin: '1em', overflow: 'hidden' }}>
      <div>
        <Typography variant="h5">{localization.savedQueries}</Typography>
        <FormControlLabel
          label={localization.onlyPublic}
          control={
            <Checkbox
              onChange={ev => {
                setOnlyPublic(ev.target.checked)
                requestReload()
              }}
            />
          }
        />
      </div>
      <div>
        {queries.length > 0 ? (
          <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
            <CurrentChildrenContext.Provider value={queries}>
              <CurrentAncestorsContext.Provider value={[]}>
                <CollectionComponent
                  style={{
                    height: 'calc(100% - 75px)',
                    overflow: 'auto',
                  }}
                  enableBreadcrumbs={false}
                  parentIdOrPath={0}
                  onParentChange={() => {
                    // ignore, only queries will be listed
                  }}
                  onActivateItem={p => {
                    props.history.push(
                      `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeQueryData({
                        term: (p as Query).Query || '',
                      })}`,
                    )
                  }}
                  onTabRequest={() => {
                    /** */
                  }}
                />
              </CurrentAncestorsContext.Provider>
            </CurrentChildrenContext.Provider>
          </CurrentContentContext.Provider>
        ) : (
          <Typography variant="subtitle1" style={{ marginTop: '3em' }}>
            {localization.noSavedQuery}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default withRouter(Search)
