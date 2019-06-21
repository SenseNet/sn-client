import React, { useState, useEffect } from 'react'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import Refresh from '@material-ui/icons/RefreshTwoTone'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { RouteComponentProps, withRouter } from 'react-router'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'
import { useRepository, useContentRouting, useLocalization, useSelectionService } from '../../hooks'
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
  const [count, setCount] = useState(0)
  const repo = useRepository()
  const contentRouter = useContentRouting()
  const replacedTitle = useStringReplace(props.title)
  const localization = useLocalization().dashboard
  const selectionService = useSelectionService()

  useEffect(() => {
    setLoadChildrenSettings({
      query: props.settings.query,
      top: props.settings.countOnly ? 1 : props.settings.top,
      inlinecount: 'allpages',
      select: ['Actions', ...props.settings.columns],
      expand: ['Actions', ...props.settings.columns.filter(f => isReferenceField(f, repo))],
    })
  }, [props.settings.columns, props.settings.countOnly, props.settings.query, props.settings.top, repo])

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
          setCount(result.d.__count)
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: props.settings.showColumnNames ? '0.35em' : '.5em',
        }}>
        <Tooltip title={replacedTitle}>
          <Typography variant="h5" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {replacedTitle}
          </Typography>
        </Tooltip>
        <div style={{ flex: 1 }} />
        <Tooltip title={localization.refresh}>
          <IconButton onClick={() => setRefreshToken(Math.random())} style={{ padding: '0', margin: '0 0 0 1em' }}>
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title={localization.openInSearch}>
          <IconButton
            style={{ padding: '0', margin: '0 0 0 1em' }}
            onClick={() =>
              props.history.push(
                `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeURIComponent(props.settings.query)}`,
              )
            }>
            <OpenInNewTwoTone />
          </IconButton>
        </Tooltip>
      </div>
      {props.settings.countOnly ? (
        <div
          style={{
            minHeight: 100,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Typography variant="h2">{count}</Typography>
        </div>
      ) : (
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
                    overflow: 'auto',
                    height: props.settings.countOnly || items.length < 1 ? 0 : '100%',
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
                  onSelectionChange={sel => {
                    selectionService.selection.setValue(sel)
                  }}
                  onActiveItemChange={item => {
                    selectionService.activeContent.setValue(item)
                  }}
                />
                {error ? <Typography color="error">{error}</Typography> : null}
                {items && items.length === 0 && props.settings.emptyPlaceholderText ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography style={{ textAlign: 'center' }}>{props.settings.emptyPlaceholderText}</Typography>
                  </div>
                ) : null}
              </LoadSettingsContext.Provider>
            </CurrentAncestorsContext.Provider>
          </CurrentChildrenContext.Provider>
        </CurrentContentContext.Provider>
      )}
    </div>
  )
}

const routed = withRouter(QueryWidget)
export { routed as QueryWidget }
