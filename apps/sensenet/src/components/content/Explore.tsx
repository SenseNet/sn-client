import { ODataParams } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  useRepository,
} from '@sensenet/hooks-react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useContext, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ContentList } from '../content-list/content-list'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { DocumentViewer } from '../document-viewer'
import { EditBinary } from '../edit/edit-binary'
import { FullScreenLoader } from '../full-screen-loader'
import TreeWithData from '../tree/tree-with-data'
import { BrowseView, EditView, NewView, PermissionView, VersionView } from '../view-controls'
import WopiPage from '../wopi-page'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    exploreWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      paddingLeft: '15px',
      justifyContent: 'space-between',
    },
    treeAndDatagridWrapper: {
      display: 'flex',
      width: '100%',
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
      position: 'relative',
    },
    exploreContainer: {
      display: 'flex',
      flexFlow: 'column',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    },
  })
})

export type ExploreProps = {
  currentPath: string
  rootPath: string
  onNavigate: (content: GenericContent) => void
  fieldsToDisplay?: Array<keyof GenericContent>
  schema?: string
  loadTreeSettings?: ODataParams<GenericContent>
  loadChildrenSettings?: ODataParams<GenericContent>
  renderBeforeGrid?: () => JSX.Element
  hasTree?: boolean
}

export function Explore({
  currentPath,
  onNavigate,
  rootPath,
  fieldsToDisplay,
  schema,
  loadChildrenSettings,
  loadTreeSettings,
  renderBeforeGrid,
  hasTree = true,
}: ExploreProps) {
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const repository = useRepository()
  const history = useHistory()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const activeContent = useQuery().get('content') ?? ''
  const contentTypeName = useQuery().get('content-type')
  const snRoute = useSnRoute()
  const activeAction = snRoute.match!.params.action

  const onActivateItemOverride = (activeItem: GenericContent) => {
    const { location } = history
    history.push(getPrimaryActionUrl({ content: activeItem, repository, uiSettings, location, snRoute }))
  }

  const onTreeLoadingChange = useCallback((isLoading) => setIsTreeLoading(isLoading), [])

  const renderContent = () => {
    switch (activeAction) {
      case 'browse':
        return <BrowseView contentPath={`${rootPath}${activeContent}`} />
      case 'edit':
        return (
          <EditView
            actionName={activeAction}
            contentPath={`${rootPath}${activeContent}`}
            submitCallback={() => navigateToAction({ history, routeMatch: snRoute.match })}
          />
        )
      case 'new':
        if (contentTypeName) {
          return (
            <NewView
              contentTypeName={contentTypeName!}
              currentContentPath={currentPath}
              submitCallback={() => navigateToAction({ history, routeMatch: snRoute.match })}
            />
          )
        }
        break
      case 'version':
        return <VersionView contentPath={`${rootPath}${activeContent}`} />

      case 'setpermissions':
        return <PermissionView contentPath={`${rootPath}${activeContent}`} />
      case 'preview':
        return <DocumentViewer contentPath={`${rootPath}${activeContent}`} />

      case 'edit-binary':
        return <EditBinary contentPath={`${rootPath}${activeContent}`} />
      case 'wopi-edit':
      case 'wopi-view':
        return <WopiPage contentPath={`${rootPath}${activeContent}`} />
      default:
    }

    if (isTreeLoading) {
      return <FullScreenLoader />
    }

    return (
      <>
        {renderBeforeGrid?.()}
        <ContentList
          style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
          enableBreadcrumbs={false}
          fieldsToDisplay={fieldsToDisplay}
          schema={schema}
          onParentChange={onNavigate}
          onActivateItem={onActivateItemOverride}
          onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
          parentIdOrPath={currentPath}
        />
      </>
    )
  }

  return (
    <LoadSettingsContextProvider>
      <CurrentContentProvider idOrPath={currentPath}>
        <CurrentChildrenProvider loadSettings={loadChildrenSettings}>
          <CurrentAncestorsProvider root={rootPath}>
            <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
              <ContentBreadcrumbs
                onItemClick={(i) => {
                  onNavigate(i.content)
                }}
                batchActions={true}
              />
            </div>
            <div className={classes.treeAndDatagridWrapper}>
              {hasTree && (
                <TreeWithData
                  onItemClick={(item) => {
                    onNavigate(item)
                  }}
                  parentPath={PathHelper.isAncestorOf(rootPath, currentPath) ? rootPath : currentPath}
                  activeItemPath={currentPath}
                  onTreeLoadingChange={onTreeLoadingChange}
                  loadSettings={loadTreeSettings}
                />
              )}
              <div className={classes.exploreContainer}>{renderContent()}</div>
            </div>
          </CurrentAncestorsProvider>
        </CurrentChildrenProvider>
      </CurrentContentProvider>
    </LoadSettingsContextProvider>
  )
}
