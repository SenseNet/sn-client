import { ODataFieldParameter, ODataParams } from '@sensenet/client-core'
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
import { clsx } from 'clsx'
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
      justifyContent: 'start',
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
  alwaysRefreshChildren?: boolean
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
  alwaysRefreshChildren,
}: ExploreProps) {
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const repository = useRepository()
  const history = useHistory()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const activeContent = useQuery().get('content') ?? ''
  const needRoot = useQuery().get('needRoot') !== 'false'
  const contentTypeName = useQuery().get('content-type')
  const pathFromUrl = useQuery().get('path')
  const snRoute = useSnRoute()
  const activeAction = snRoute.match!.params.action

  const onActivateItemOverride = async (activeItem: GenericContent) => {
    const expandedItem = await repository.load({
      idOrPath: activeItem.Id,
      oDataOptions: {
        select: Array.isArray(repository.configuration.requiredSelect)
          ? ([...repository.configuration.requiredSelect, 'Actions/Name'] as ODataFieldParameter<GenericContent>)
          : repository.configuration.requiredSelect,
        expand: ['Actions'] as ODataFieldParameter<GenericContent>,
      },
    })
    const { location } = history
    history.push(getPrimaryActionUrl({ content: expandedItem.d, repository, uiSettings, location, snRoute }))
  }

  const onTreeLoadingChange = useCallback((isLoading) => setIsTreeLoading(isLoading), [])

  const renderContent = () => {
    switch (activeAction) {
      case 'browse':
        return <BrowseView key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'edit':
        return (
          <EditView
            key={activeContent}
            actionName={activeAction}
            contentPath={`${needRoot ? rootPath : ''}${activeContent}`}
            submitCallback={(savedContent) => {
              const contentNameBeforeEdit = PathHelper.getSegments(activeContent).pop()
              if (contentNameBeforeEdit && contentNameBeforeEdit !== savedContent.Name && pathFromUrl) {
                return navigateToAction({
                  history,
                  routeMatch: snRoute.match,
                  queryParams: { path: pathFromUrl.replace(contentNameBeforeEdit, savedContent.Name) },
                })
              }

              navigateToAction({ history, routeMatch: snRoute.match })
            }}
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
        return <VersionView key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'setpermissions':
        return <PermissionView key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'preview':
        return <DocumentViewer key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'edit-binary':
        return <EditBinary key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'wopi-edit':
      case 'wopi-view':
        return <WopiPage key={activeContent} contentPath={`${rootPath}${activeContent}`} />
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
        <CurrentChildrenProvider loadSettings={loadChildrenSettings} alwaysRefresh={alwaysRefreshChildren}>
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
