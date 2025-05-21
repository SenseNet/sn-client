import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core'
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
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { ColDef } from 'ag-grid-community'
import { clsx } from 'clsx'
import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { DocumentViewer } from '../document-viewer'
import { EditBinary } from '../edit/edit-binary'
import { contentColumnDefs } from '../grid/Cols/ColumnDefs.'
import { Grid } from '../grid/Grid'
import ExpandedItemsProvider from '../tree/Contexts/ExpandedItemsProvider'
import { SimpleTree } from '../tree/simpletree'
import { BrowseView, EditView, ImageView, NewView, PermissionView, VersionView } from '../view-controls'
import WopiPage from '../wopi-page'
import { ContentInfo } from './ContentInfo'

const useStyles = makeStyles<Theme, { width: number }>((theme) =>
  createStyles({
    exploreWrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    breadcrumbsWrapper: {
      boxSizing: 'border-box',
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      justifyContent: 'start',
    },
    treeAndDatagridWrapper: {
      display: 'flex',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'auto',
    },
    exploreContainer: {
      display: 'flex',
      flexFlow: 'column',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      borderLeft: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
    },
    simpleTree: {
      width: ({ width }) => `${width}px`,
      overflow: 'auto',
      position: 'relative',
      flex: 'none',
      '& .MuiTypography-body1': {
        fontSize: '12px !important',
        display: 'flex',
        alignSelf: 'center',
        paddingRight: '4px',
      },
      '& .MuiListItemIcon-root': {
        display: 'flex',
        alignSelf: 'center',
        minWidth: '25px',
        marginRight: '3px',
      },
      '& .MuiSvgIcon-root': {
        height: '16px',
      },
      '& .svgicon': {
        width: '24px',
        height: '24px',
      },
      '& .MuiSvgIcon-root svg': {
        height: '16px !important',
      },
      '& .MuiCollapse-container.MuiTreeItem-group': {
        marginLeft: '7px',
        paddingLeft: '18px',
        borderLeft: '1px dashed #cececeff',
      },
    },
    resizeButton: {
      position: 'sticky',
      top: 0,
      right: 0,
      width: '26px',
      height: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 9999,
      margin: '-1px 0.5px -24px auto',
      border: `1px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.type === 'light' ? 'white' : 'black',
      '&:hover': {
        backgroundColor: theme.palette.type === 'light' ? '#f0f0f0' : '#222222',
      },
      '&:active': {
        backgroundColor: theme.palette.type === 'light' ? '#f0f0f0' : '#222222',
      },
    },
    symbol: {
      color: theme.palette.primary.main,
      fontSize: '18px',
      paddingBottom: '3px',
    },
  }),
)

export type ExploreProps = {
  currentPath: string
  rootPath: string
  onNavigate: (content: GenericContent) => void
  fieldsToDisplay?: Array<ColumnSetting<GenericContent>>
  schema?: string
  loadTreeSettings?: ODataParams<GenericContent>
  loadChildrenSettings?: ODataParams<GenericContent>
  renderBeforeGrid?: () => JSX.Element
  hasTree?: boolean
  alwaysRefreshChildren?: boolean
  showPageTitle?: boolean
  disableColumnSettings?: boolean
  colDef?: ColDef[]
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
  disableColumnSettings,
  colDef,
}: ExploreProps) {
  const theme = useTheme()
  const selectionService = useSelectionService()
  const [width, setWidth] = useState<number>(Number(localStorage.getItem('treeWidth') ?? '400'))
  const classes = useStyles({ width })
  const globalClasses = useGlobalStyles()
  const isResizing = useRef(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isResizing.current = true
    document.body.style.userSelect = 'none'
    const startX = e.clientX
    const resizeElement = e.currentTarget.parentElement as HTMLDivElement
    const handleMouseMove = (event: MouseEvent) => {
      if (isResizing.current) {
        const newWidth = width + (event.clientX - startX)
        resizeElement.style.width = `${Math.max(newWidth, 26)}px`
      }
    }
    const handleMouseUp = () => {
      isResizing.current = false
      document.body.style.userSelect = ''
      const newWidth = parseInt(resizeElement.style.width, 10)
      setWidth(newWidth)
      localStorage.setItem('treeWidth', String(newWidth))
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const repository = useRepository()
  const history = useHistory()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const activeContent = useQuery().get('content') ?? ''
  const needRoot = useQuery().get('needRoot') !== 'false'
  const contentTypeName = useQuery().get('content-type')
  const pathFromUrl = useQuery().get('path')
  const snRoute = useSnRoute()
  const activeAction = snRoute.match!.params.action
  const isNewGrid =
    window.location.pathname === '/content/explorer/' ||
    window.location.pathname === '/custom/explorer/root/' ||
    window.location.pathname === '/content/explorer/edit' ||
    window.location.pathname === '/content/explorer/new' ||
    window.location.pathname === '/content/explorer/version' ||
    window.location.pathname === '/content/explorer/setpermissions' ||
    window.location.pathname === '/content/explorer/image' ||
    window.location.pathname === '/content/explorer/preview' ||
    window.location.pathname === '/content/explorer/edit-binary'
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
      case 'image':
        return <ImageView key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'preview':
        return <DocumentViewer key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'edit-binary':
        return <EditBinary key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      case 'wopi-edit':
      case 'wopi-view':
        return <WopiPage key={activeContent} contentPath={`${rootPath}${activeContent}`} />
      default:
    }

    return (
      <>
        {renderBeforeGrid?.()}
        <ContentInfo />
        <Grid
          disableColumnSettings={disableColumnSettings}
          style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
          enableBreadcrumbs={false}
          fieldsToDisplay={fieldsToDisplay}
          schema={schema}
          onParentChange={onNavigate}
          onActivateItem={onActivateItemOverride}
          onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
          parentIdOrPath={currentPath}
          colDef={colDef ?? contentColumnDefs}
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

            <div className={`${classes.treeAndDatagridWrapper} leftTree theme-${theme.palette.type} `}>
              {hasTree && (
                <ExpandedItemsProvider>
                  <div className={classes.simpleTree}>
                    <div className={classes.resizeButton} onMouseDown={handleMouseDown}>
                      <div className={classes.symbol}>&#8596;</div>
                    </div>
                    <SimpleTree
                      onItemClick={(item) => {
                        onNavigate(item)
                      }}
                      parentPath={PathHelper.isAncestorOf(rootPath, currentPath) ? rootPath : currentPath}
                      activeItemPath={currentPath}
                      loadSettings={loadTreeSettings}
                      onNavigate={onNavigate}
                      rootLoaded={false}
                    />
                  </div>
                </ExpandedItemsProvider>
              )}
              <div className={classes.exploreContainer}>{renderContent()}</div>
            </div>
          </CurrentAncestorsProvider>
        </CurrentChildrenProvider>
      </CurrentContentProvider>
    </LoadSettingsContextProvider>
  )
}
