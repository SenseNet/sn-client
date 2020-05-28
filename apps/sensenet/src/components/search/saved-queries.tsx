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
  useRepository,
  useRepositoryEvents,
} from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { applicationPaths } from '../../application-paths'
import { useGlobalStyles } from '../../globalStyles'
import { useDialogActionSubscribe, useLocalization, useSelectionService } from '../../hooks'
import { ContentList } from '../content-list/content-list'

export default function Search() {
  const repo = useRepository()
  const localization = useLocalization().search
  const injector = useInjector()
  const history = useHistory()
  const [onlyPublic, setOnlyPublic] = useState(false)
  const [queries, setQueries] = useState<Query[]>([])

  const [reloadToken, setReloadToken] = useState(Math.random())
  const [requestReload] = useState(() => debounce(() => setReloadToken(Math.random()), 250))
  const loadSettingsContext = useContext(LoadSettingsContext)

  const eventHub = useRepositoryEvents()
  const globalClasses = useGlobalStyles()
  const selectionService = useSelectionService()
  useDialogActionSubscribe()

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
    injector,
    repo,
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
  return (
    <div style={{ padding: '0 15px', overflow: 'hidden', height: '100%' }}>
      <>
        <div className={clsx(globalClasses.contentTitle, globalClasses.centeredVertical)}>
          <span style={{ fontSize: '20px' }}>{localization.savedQueries}</span>
        </div>
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
      </>
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
                  onActivateItem={(p) => {
                    history.push(`${applicationPaths.search}?term=${(p as Query).Query}`)
                  }}
                  onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
                  onSelectionChange={(sel) => {
                    selectionService.selection.setValue(sel)
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
      </>
    </div>
  )
}
