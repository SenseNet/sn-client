import React from 'react'
import { IconButton, Tooltip, Typography } from '@material-ui/core'
import Refresh from '@material-ui/icons/RefreshTwoTone'
import OpenInNewTwoTone from '@material-ui/icons/OpenInNewTwoTone'
import { GenericContent } from '@sensenet/default-content-types'
import { ConstantContent } from '@sensenet/client-core'
import { RouteComponentProps, withRouter } from 'react-router'
import { QueryWidget as QueryWidgetModel } from '../../services/PersonalSettings'
import { useContentRouting, useLocalization, useRepository, useSelectionService, useStringReplace } from '../../hooks'
import { CollectionComponent } from '../content-list'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
} from '../../context'
import { encodeQueryData } from '../search'
import { useQuery } from '../../hooks/use-query'

const QueryWidget: React.FunctionComponent<QueryWidgetModel<GenericContent> & RouteComponentProps> = props => {
  const { error, loadChildrenSettings, setLoadChildrenSettings, count, items, refresh } = useQuery(props.settings)
  const repo = useRepository()
  const contentRouter = useContentRouting()
  const replacedTitle = useStringReplace(props.title)
  const localization = useLocalization().dashboard
  const selectionService = useSelectionService()

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
            <IconButton onClick={refresh} style={{ padding: '0', margin: '0 0 0 1em' }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        ) : null}
        {props.settings.showOpenInSearch ? (
          <Tooltip title={localization.openInSearch}>
            <IconButton
              style={{ padding: '0', margin: '0 0 0 1em' }}
              onClick={() =>
                props.history.push(
                  `/${btoa(repo.configuration.repositoryUrl)}/search/${encodeQueryData({
                    term: props.settings.query,
                  })}`,
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
                  parentIdOrPath={0}
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
