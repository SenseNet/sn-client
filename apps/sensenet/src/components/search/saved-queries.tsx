import Checkbox from '@material-ui/core/Checkbox'
import Fab from '@material-ui/core/Fab'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import SearchIcon from '@material-ui/icons/Search'
import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { Query } from '@sensenet/default-content-types'
import React, { useContext, useEffect, useState } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
} from '../../context'
import { useInjector, useLocalization, useRepository } from '../../hooks'
import { CollectionComponent } from '../content-list'

const Search: React.FunctionComponent<RouteComponentProps> = props => {
  const repo = useRepository()
  const localization = useLocalization().search
  const injector = useInjector()

  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])
  const [repoToken, setRepoToken] = useState(btoa(repo.configuration.repositoryUrl))

  const [reloadToken, setReloadToken] = useState(Math.random())
  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const loadSettingsContext = useContext(LoadSettingsContext)

  useEffect(() => {
    setRepoToken(btoa(repo.configuration.repositoryUrl))
  }, [repo.configuration.repositoryUrl])

  useEffect(() => {
    const eventHub = injector.getEventHub(repo.configuration.repositoryUrl)
    const subscriptions = [
      eventHub.onContentModified.subscribe(() => requestReload()),
      eventHub.onContentCopied.subscribe(() => requestReload()),
      eventHub.onContentCreated.subscribe(() => requestReload()),
      eventHub.onContentDeleted.subscribe(() => requestReload()),
    ]
    return () => subscriptions.forEach(s => s.dispose())
  }, [injector, repo, requestReload])

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
        <Tooltip title={localization.newSearch}>
          <Link
            style={{ textDecoration: 'none', position: 'fixed', bottom: '2em', right: '2em' }}
            to={`/${repoToken}/search`}>
            <Fab color="primary" title={localization.newSearch}>
              <SearchIcon />
            </Fab>
          </Link>
        </Tooltip>
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
                      `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeURIComponent(
                        (p as Query).Query || '',
                      )}`,
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
