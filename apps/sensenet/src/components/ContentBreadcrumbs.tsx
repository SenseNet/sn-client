import { useTheme } from '@material-ui/core/styles'
import { ArrowBack, ArrowForward, ArrowUpward, Refresh } from '@material-ui/icons'
import { GenericContent } from '@sensenet/default-content-types'
import { CurrentAncestorsContext, CurrentContentContext, useRepository } from '@sensenet/hooks-react'
import React, { useContext, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { ResponsiveContext, ResponsivePersonalSettings } from '../context'
import { useLocalization, useSelectionService, useSnRoute } from '../hooks'
import { getPrimaryActionUrl, getUrlForContent } from '../services'
import { BreadcrumbItem, Breadcrumbs } from './Breadcrumbs'
import CopyPath from './CopyPath'
import { EditableBreadcrumbPath } from './EditableBreadcrumbPath'
import { getTreeModeAction, getTreeModeTargetPath, isTreeEditAction } from './tree/tree-mode-navigation'
import './explorer-header.css'

type ContentBreadcrumbsProps<T extends GenericContent> = {
  onItemClick?: (item: BreadcrumbItem<T>) => void
  explorerNavigation?: boolean
  onRefresh?: () => void
  rootPath?: string
}

export const ContentBreadcrumbs = <T extends GenericContent = GenericContent>(props: ContentBreadcrumbsProps<T>) => {
  const ancestors = useContext(CurrentAncestorsContext) as T[]
  const parent = useContext(CurrentContentContext) as T
  const uiSettings = useContext(ResponsivePersonalSettings)
  const repository = useRepository()
  const history = useHistory()
  const { location } = history
  const localization = useLocalization()
  const theme = useTheme()
  const pathSegments = useRef<HTMLDivElement>(null)
  const selectionService = useSelectionService()
  const device = useContext(ResponsiveContext)
  const snRoute = useSnRoute()
  const rootPath = props.rootPath || snRoute.path || '/Root'
  const action = snRoute.match?.params.action
  const locationPath = getTreeModeTargetPath({ rootPath, currentPath: parent.Path, action, search: location.search })

  useEffect(() => {
    if (pathSegments.current) pathSegments.current.scrollLeft = pathSegments.current.scrollWidth
  }, [ancestors, device, parent.Path])

  const items = [
    ...ancestors.map((content) => ({
      displayName: content.DisplayName || content.Name,
      title: content.Path,
      url: getPrimaryActionUrl({ content, repository, uiSettings, location }),
      content,
    })),
    {
      displayName: parent.DisplayName || parent.Name,
      title: parent.Path,
      url: getPrimaryActionUrl({ content: parent, repository, uiSettings, location }),
      content: parent,
    },
  ]

  const handleItemClick = (item: BreadcrumbItem<T>) => {
    selectionService.activeContent.setValue(item.content)
    props.onItemClick
      ? props.onItemClick(item)
      : history.push(getPrimaryActionUrl({ content: item.content, repository, uiSettings, location }))
  }

  const ancestorItem = items[items.length - 2]
  const pathContents = (
    <>
      <div className="sn-explorer-location__segments" ref={pathSegments}>
        <Breadcrumbs<T> items={items} onItemClick={(_ev, item) => handleItemClick(item)} />
      </div>
      <div className="sn-explorer-location__copy">
        <CopyPath copyText={props.explorerNavigation ? locationPath : parent.Path} />
      </div>
    </>
  )

  return (
    <div
      className="sn-explorer-location"
      style={
        {
          '--sn-location-surface': theme.palette.background.paper,
          '--sn-location-hover': theme.palette.action.hover,
          '--sn-location-border': theme.palette.divider,
          '--sn-location-text': theme.palette.text.primary,
          '--sn-location-muted': theme.palette.text.secondary,
          '--sn-location-accent': theme.palette.primary.main,
        } as React.CSSProperties
      }>
      <div className="sn-explorer-location__address" data-test="explorer-address-bar">
        <div className="sn-explorer-location__navigation">
          {props.explorerNavigation && (
            <button
              type="button"
              className="sn-explorer-location__nav-button"
              aria-label={localization.contentViews.goBack}
              title={localization.contentViews.goBack}
              data-test="breadcrumb-go-back"
              onClick={() => history.goBack()}>
              <ArrowBack aria-hidden="true" />
            </button>
          )}
          {props.explorerNavigation && device !== 'mobile' && (
            <button
              type="button"
              className="sn-explorer-location__nav-button"
              aria-label={localization.contentViews.goForward}
              title={localization.contentViews.goForward}
              data-test="breadcrumb-go-forward"
              onClick={() => history.goForward()}>
              <ArrowForward aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="sn-explorer-location__nav-button"
            aria-label={localization.contentViews.goUp}
            title={ancestorItem?.title || localization.contentViews.goUp}
            disabled={!ancestorItem}
            data-test="breadcrumb-go-up"
            onClick={() => ancestorItem && handleItemClick(ancestorItem)}>
            <ArrowUpward aria-hidden="true" />
          </button>
          {props.explorerNavigation && props.onRefresh && device !== 'mobile' && (
            <button
              type="button"
              className="sn-explorer-location__nav-button"
              aria-label={localization.contentViews.refresh}
              title={localization.contentViews.refresh}
              data-test="breadcrumb-refresh"
              disabled={!parent.Path}
              onClick={props.onRefresh}>
              <Refresh aria-hidden="true" />
            </button>
          )}
        </div>
        {props.explorerNavigation ? (
          <EditableBreadcrumbPath
            path={locationPath}
            currentFolder={parent.Path}
            onNavigate={(content) => {
              history.push(
                getUrlForContent({
                  content,
                  uiSettings,
                  location,
                  snRoute: { ...snRoute, path: rootPath },
                  action: getTreeModeAction(content, isTreeEditAction(action)),
                }),
              )
            }}>
            {pathContents}
          </EditableBreadcrumbPath>
        ) : (
          <div className="sn-explorer-location__path">{pathContents}</div>
        )}
      </div>
    </div>
  )
}
