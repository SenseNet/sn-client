import React, { useState, useEffect } from 'react'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import Refresh from '@material-ui/icons/RefreshTwoTone'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { RouteComponentProps, withRouter } from 'react-router'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'
import { useRepository, useContentRouting, useLocalization } from '../../hooks'
import { CollectionComponent, isReferenceField } from '../ContentListPanel'
import {
  CurrentContentContext,
  CurrentChildrenContext,
  CurrentAncestorsContext,
  LoadSettingsContext,
} from '../../context'
import { useStringReplace } from '../../hooks/use-string-replace'

const QueryWidget: React.FunctionComponent<QueryWidgetModel<GenericContent> & RouteComponentProps> = props => {
  const [items, setItems] = useState<GenericContent[]>([])
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({})
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(Math.random())
  const repo = useRepository()
  const contentRouter = useContentRouting()
  const replacedTitle = useStringReplace(props.title)
  const localization = useLocalization().dashboard

  useEffect(() => {
    setLoadChildrenSettings({
      query: props.settings.query,
      top: props.settings.top,
      select: ['Actions', ...props.settings.columns],
      expand: ['Actions', ...props.settings.columns.filter(f => isReferenceField(f, repo))],
    })
  }, [props.settings.columns, props.settings.query, props.settings.top, repo])

  useEffect(() => {
    const ac = new AbortController()
    if (loadChildrenSettings.query) {
      ;(async () => {
        /** */
        try {
          setError('')
          const result = await repo.loadCollection({
            path: ConstantContent.PORTAL_ROOT.Path,
            oDataOptions: loadChildrenSettings,
            requestInit: {
              signal: ac.signal,
            },
          })
          setItems(result.d.results)
        } catch (e) {
          if (!ac.signal.aborted) {
            setError(e.toString())
          }
        }
      })()
      return () => ac.abort()
    }
  }, [repo, loadChildrenSettings, refreshToken])

  return (
    <div style={{ minHeight: 250 }}>
      <div style={{ display: 'flex' }}>
        <Typography gutterBottom={true} variant="h5">
          {replacedTitle}
        </Typography>
        <div style={{ flex: 1 }} />
        <Tooltip title={localization.refresh}>
          <IconButton onClick={() => setRefreshToken(Math.random())}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title={localization.openInSearch}>
          <IconButton
            onClick={() =>
              props.history.push(
                `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeURIComponent(props.settings.query)}`,
              )
            }>
            <OpenInNewTwoTone />
          </IconButton>
        </Tooltip>
      </div>
      <CurrentContentContext.Provider value={ConstantContent.PORTAL_ROOT}>
        <CurrentChildrenContext.Provider value={items}>
          <CurrentAncestorsContext.Provider value={[]}>
            <LoadSettingsContext.Provider
              value={{
                loadAncestorsSettings: {},
                loadSettings: {},
                loadChildrenSettings,
                setLoadChildrenSettings: newSettings => {
                  setLoadChildrenSettings({
                    ...loadChildrenSettings,
                    orderby: newSettings.orderby,
                  })
                },
                setLoadSettings: () => ({}),
                setLoadAncestorsSettings: () => ({}),
              }}>
              <CollectionComponent
                disableSelection={!props.settings.enableSelection}
                hideHeader={!props.settings.showColumnNames}
                fieldsToDisplay={props.settings.columns}
                style={{
                  height: 'calc(100% - 75px)',
                  overflow: 'auto',
                }}
                enableBreadcrumbs={false}
                parentId={0}
                onParentChange={() => {
                  // props.history.push(contentRouter.getPrimaryActionUrl(p))
                }}
                onActivateItem={p => {
                  props.history.push(contentRouter.getPrimaryActionUrl(p))
                }}
                onTabRequest={() => {
                  /** */
                }}
              />
              {error ? <Typography color="error">{error}</Typography> : null}
            </LoadSettingsContext.Provider>
          </CurrentAncestorsContext.Provider>
        </CurrentChildrenContext.Provider>
      </CurrentContentContext.Provider>
    </div>
  )
}

const routed = withRouter(QueryWidget)
export { routed as QueryWidget }
