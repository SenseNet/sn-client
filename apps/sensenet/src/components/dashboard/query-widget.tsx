import { ConstantContent, ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useRepository,
} from '@sensenet/hooks-react'
import { IconButton, Tooltip, Typography } from '@material-ui/core'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import Refresh from '@material-ui/icons/RefreshTwoTone'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../../application-paths'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization, useSelectionService, useStringReplace } from '../../hooks'
import { getPrimaryActionUrl, pathWithQueryParams } from '../../services'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'
import { ContentList, isReferenceField } from '../content-list'

export const QueryWidget = (props: QueryWidgetModel<GenericContent>) => {
  const [items, setItems] = useState<GenericContent[]>([])
  const history = useHistory()
  const [loadChildrenSettings, setLoadChildrenSettings] = useState<ODataParams<GenericContent>>({})
  const [error, setError] = useState('')
  const [refreshToken, setRefreshToken] = useState(Math.random())
  const [count, setCount] = useState(0)
  const repository = useRepository()
  const replacedTitle = useStringReplace(props.title)
  const localization = useLocalization().dashboard
  const selectionService = useSelectionService()
  const uiSettings = useContext(ResponsivePersonalSettings)

  useEffect(() => {
    setLoadChildrenSettings({
      query: props.settings.query,
      top: props.settings.countOnly ? 1 : props.settings.top,
      inlinecount: 'allpages',
      select: ['Actions', ...props.settings.columns],
      expand: ['Actions', ...props.settings.columns.filter((f) => isReferenceField(f, repository))],
    })
  }, [props.settings.columns, props.settings.countOnly, props.settings.query, props.settings.top, repository])

  useEffect(() => {
    const ac = new AbortController()
    if (loadChildrenSettings.query) {
      ;(async () => {
        /** */
        try {
          setError('')
          const result = await repository.loadCollection({
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
  }, [repository, loadChildrenSettings, refreshToken])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          marginBottom: props.settings.showColumnNames ? '0.35em' : '.5em',
        }}>
        {replacedTitle ? (
          <Tooltip title={replacedTitle}>
            <Typography variant="h5" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {replacedTitle}
            </Typography>
          </Tooltip>
        ) : null}
        <div style={{ flex: 1 }} />
        {props.settings.showRefresh ? (
          <Tooltip title={localization.refresh}>
            <IconButton onClick={() => setRefreshToken(Math.random())} style={{ padding: '0', margin: '0 0 0 1em' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        ) : null}
        {props.settings.showOpenInSearch ? (
          <Tooltip title={localization.openInSearch}>
            <IconButton
              style={{ padding: '0', margin: '0 0 0 1em' }}
              onClick={() =>
                history.push(
                  pathWithQueryParams({ path: PATHS.search.appPath, newParams: { term: props.settings.query } }),
                )
              }>
              <OpenInNewTwoTone />
            </IconButton>
          </Tooltip>
        ) : null}
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
                  setLoadChildrenSettings: (newSettings) => {
                    setLoadChildrenSettings({
                      ...loadChildrenSettings,
                      orderby: newSettings.orderby,
                    })
                  },
                  setLoadSettings: () => ({}),
                  setLoadAncestorsSettings: () => ({}),
                }}>
                <ContentList
                  disableSelection={!props.settings.enableSelection}
                  hideHeader={!props.settings.showColumnNames}
                  fieldsToDisplay={props.settings.columns}
                  style={{
                    overflow: 'auto',
                    height: props.settings.countOnly || items.length < 1 ? 0 : '100%',
                  }}
                  enableBreadcrumbs={false}
                  parentIdOrPath={0}
                  onParentChange={() => {
                    // props.history.push(contentRouter.getPrimaryActionUrl(p))
                  }}
                  onActivateItem={(p) => {
                    history.push(getPrimaryActionUrl({ content: p, repository, uiSettings }))
                  }}
                  onActiveItemChange={(item) => {
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
