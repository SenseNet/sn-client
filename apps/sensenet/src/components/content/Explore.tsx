import { createStyles, IconButton, makeStyles, SwipeableDrawer, Theme, Tooltip, useTheme } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { ODataFieldParameter, ODataParams } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentContext,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  useRepository,
} from '@sensenet/hooks-react'
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { ColDef } from 'ag-grid-community'
import { clsx } from 'clsx'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { GridKeyEnum } from '../../../src/components/grid/enums/GridKey.enum'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { useRepositoryColumnSettings } from '../../hooks/use-repository-column-settings'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ColumnSettingsSource, LegacyColumnSetting, LegacyColumnSettings } from '../../services/column-settings-service'
import { resolveContentLinkTarget } from '../../services/favorites'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { DocumentViewer } from '../document-viewer'
import { EditBinary } from '../edit/edit-binary'
import { Grid } from '../grid/Grid'
import { SimpleTree } from '../tree/simpletree'
import { BrowseView, EditView, ImageView, NewView, PermissionView, VersionView } from '../view-controls'
import WopiPage from '../wopi-page'
import { AUI_APPLICATION_CONTENT_TYPE, AUIApplicationView } from './AUIApplicationView'
import { ContentInfo } from './ContentInfo'

const requiredGridLoadFields: ODataFieldParameter<GenericContent> = [
  'Id',
  'ParentId',
  'Path',
  'Name',
  'DisplayName',
  'Type',
  'Icon',
  'IsFolder',
  'IsFile',
  'Actions',
  'CreatedBy',
  'CreationDate',
  'ModifiedBy',
  'ModificationDate',
  'Index',
  'Locked',
]

const getGridLoadChildrenSettings = (
  colDef: ColDef[],
  columnSettings?: LegacyColumnSetting[],
): ODataParams<GenericContent> => {
  const selectFields = new Set<string>(requiredGridLoadFields)
  const expandFields = new Set<string>(['CreatedBy', 'ModifiedBy'])

  colDef.forEach((columnDefinition) => {
    if (columnDefinition.field && columnDefinition.field !== '0') {
      selectFields.add(columnDefinition.field)
    }
  })

  columnSettings?.forEach(({ field }) => {
    if (!field || field === 'Actions') {
      return
    }
    selectFields.add(field)
    if (field.includes('/')) {
      expandFields.add(field.split('/')[0])
    }
  })

  return {
    orderby: [['DisplayName', 'asc']],
    select: Array.from(selectFields) as ODataFieldParameter<GenericContent>,
    expand: Array.from(expandFields) as ODataFieldParameter<GenericContent>,
    onlyselectList: true,
  }
}

const useStyles = makeStyles<Theme, { width: number }>((theme) =>
  createStyles({
    breadcrumbsWrapper: {
      boxSizing: 'border-box',
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      justifyContent: 'start',
      minHeight: globals.common.drawerItemHeight,
      overflow: 'hidden',
    },
    breadcrumbsContent: {
      minWidth: 0,
      overflow: 'hidden',
      flexGrow: 1,
    },
    treeAndDatagridWrapper: {
      display: 'flex',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
    },
    exploreContainer: {
      display: 'flex',
      flexFlow: 'column',
      width: '100%',
      minWidth: 0,
      flexGrow: 1,
      position: 'relative',
      overflow: 'hidden',
      borderLeft: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      [theme.breakpoints.down('sm')]: {
        borderLeft: 'none',
      },
    },
    simpleTree: {
      width: ({ width }) => `${width}px`,
      overflow: 'hidden',
      position: 'relative',
      flex: 'none',
      boxSizing: 'border-box',
      paddingRight: '12px',
      backgroundColor: theme.palette.background.paper,
      height: '100%',
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
    mobileTreeButton: {
      display: 'none',
      flexShrink: 0,
      marginLeft: '4px',
      [theme.breakpoints.down('sm')]: {
        display: 'inline-flex',
      },
    },
    mobileTreePaper: {
      width: '86vw',
      maxWidth: 360,
      backgroundColor: theme.palette.background.default,
      overflow: 'hidden',
    },
    mobileTreeHeader: {
      height: globals.common.drawerItemHeight,
      borderBottom: theme.palette.type === 'light' ? '1px solid #DBDBDB' : '1px solid rgba(255, 255, 255, 0.11)',
      padding: '0 12px',
      fontWeight: 500,
    },
    mobileTreeContent: {
      height: `calc(100% - ${globals.common.drawerItemHeight}px)`,
      overflow: 'auto',
    },
    treeViewport: {
      height: '100%',
      overflow: 'auto',
    },
    resizeButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: '12px',
      minWidth: '12px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'ew-resize',
      zIndex: 999,
      touchAction: 'none',
      backgroundColor: 'rgba(127, 127, 127, 0.12)',
      '&:hover': {
        backgroundColor: 'rgba(127, 127, 127, 0.18)',
      },
      '&:active': {
        backgroundColor: 'rgba(127, 127, 127, 0.24)',
      },
      '&:focus': {
        outline: '1px solid rgba(25, 118, 210, 0.85)',
        outlineOffset: '-1px',
      },
      '&::before': {
        content: '""',
        width: '3px',
        height: '48px',
        borderRadius: '2px',
        backgroundColor: 'rgba(127, 127, 127, 0.6)',
      },
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
  colDef: ColDef[]
  gridKey: GridKeyEnum
}

type ExploreGridOrApplicationProps = {
  currentPath: string
  fieldsToDisplay?: LegacyColumnSetting[]
  schema?: string
  disableColumnSettings?: boolean
  colDef: ColDef[]
  gridKey: GridKeyEnum
  onNavigate: (content: GenericContent) => void
  onActivateItem: (activeItem: GenericContent) => Promise<void>
  onColumnSettingsChange: (settings: LegacyColumnSettings, targetIdOrPath?: string | number) => Promise<void>
  columnSettingsSource?: ColumnSettingsSource
  isColumnSettingsLoading: boolean
}

const ActiveContentRouteSync: React.FC = () => {
  const currentContent = useContext(CurrentContentContext)
  const selectionService = useSelectionService()

  useEffect(() => {
    const activeContent = selectionService.activeContent.getValue()

    if (currentContent && (!activeContent || !PathHelper.isInSubTree(activeContent.Path, currentContent.Path))) {
      selectionService.activeContent.setValue(currentContent)
    }
  }, [currentContent, selectionService.activeContent])

  return null
}

const ExploreGridOrApplication: React.FC<ExploreGridOrApplicationProps> = ({
  currentPath,
  fieldsToDisplay,
  schema,
  disableColumnSettings,
  colDef,
  gridKey,
  onNavigate,
  onActivateItem,
  onColumnSettingsChange,
  columnSettingsSource,
  isColumnSettingsLoading,
}) => {
  const selectionService = useSelectionService()
  const currentContent = useContext(CurrentContentContext)

  if (currentContent.Type === AUI_APPLICATION_CONTENT_TYPE) {
    return <AUIApplicationView />
  }

  return (
    <Grid
      disableColumnSettings={disableColumnSettings}
      style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
      enableBreadcrumbs={false}
      fieldsToDisplay={fieldsToDisplay}
      onColumnSettingsChange={onColumnSettingsChange}
      columnSettingsSource={columnSettingsSource}
      isColumnSettingsLoading={isColumnSettingsLoading}
      schema={schema}
      onParentChange={onNavigate}
      onActivateItem={onActivateItem}
      onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
      parentIdOrPath={currentPath}
      colDef={colDef}
      gridKey={gridKey}
    />
  )
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
  gridKey,
}: ExploreProps) {
  const theme = useTheme()
  const [width, setWidth] = useState<number>(Number(localStorage.getItem('treeWidth') ?? '400'))
  const classes = useStyles({ width })
  const globalClasses = useGlobalStyles()
  const isResizing = useRef(false)
  const device = useContext(ResponsiveContext)
  const [mobileTreeOpened, setMobileTreeOpened] = useState(false)
  const isMobile = device === 'mobile'

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    isResizing.current = true
    const previousCursor = document.body.style.cursor
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
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
      document.body.style.cursor = previousCursor
      const newWidth = parseInt(resizeElement.style.width, 10)
      if (newWidth !== null && !isNaN(newWidth)) {
        setWidth(newWidth)
        localStorage.setItem('treeWidth', String(newWidth))
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
      return
    }

    e.preventDefault()
    const nextWidth = Math.max(width + (e.key === 'ArrowLeft' ? -20 : 20), 26)
    const resizeElement = e.currentTarget.parentElement as HTMLDivElement | null
    if (resizeElement) {
      resizeElement.style.width = `${nextWidth}px`
    }
    setWidth(nextWidth)
    localStorage.setItem('treeWidth', String(nextWidth))
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
  const explicitColumnSettings = useMemo(
    () =>
      fieldsToDisplay?.map(({ field, title }) => ({
        field: String(field),
        title,
      })),
    [fieldsToDisplay],
  )
  const { columnSettings, columnSettingsSource, isColumnSettingsLoading, saveColumnSettings } =
    useRepositoryColumnSettings(currentPath, explicitColumnSettings)
  const currentChildrenLoadSettings = useMemo(
    () => loadChildrenSettings || getGridLoadChildrenSettings(colDef, columnSettings),
    [colDef, columnSettings, loadChildrenSettings],
  )
  const onActivateItemOverride = async (activeItem: GenericContent) => {
    const contentToOpen = await resolveContentLinkTarget(repository, activeItem)
    const expandedItem = await repository.load({
      idOrPath: contentToOpen.Id || contentToOpen.Path,
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
        <ExploreGridOrApplication
          disableColumnSettings={disableColumnSettings}
          fieldsToDisplay={columnSettings}
          onColumnSettingsChange={saveColumnSettings}
          columnSettingsSource={columnSettingsSource}
          isColumnSettingsLoading={isColumnSettingsLoading}
          schema={schema}
          onNavigate={onNavigate}
          onActivateItem={onActivateItemOverride}
          currentPath={currentPath}
          colDef={colDef}
          gridKey={gridKey}
        />
      </>
    )
  }

  const handleTreeNavigate = (item: GenericContent) => {
    onNavigate(item)
    setMobileTreeOpened(false)
  }

  const renderTree = () => (
    <SimpleTree
      onItemClick={handleTreeNavigate}
      parentPath={PathHelper.isAncestorOf(rootPath, currentPath) ? rootPath : currentPath}
      activeItemPath={currentPath}
      loadSettings={loadTreeSettings}
      onNavigate={handleTreeNavigate}
      rootLoaded={false}
    />
  )

  return (
    <LoadSettingsContextProvider
      key={JSON.stringify(currentChildrenLoadSettings)}
      loadChildrenSettings={currentChildrenLoadSettings}>
      <CurrentContentProvider idOrPath={currentPath}>
        <ActiveContentRouteSync />
        <CurrentChildrenProvider loadSettings={loadChildrenSettings} alwaysRefresh={alwaysRefreshChildren}>
          <CurrentAncestorsProvider root={rootPath}>
            <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
              {hasTree && isMobile ? (
                <Tooltip title="Open tree" placement="bottom">
                  <IconButton
                    className={classes.mobileTreeButton}
                    size="small"
                    aria-label="Open tree"
                    onClick={() => setMobileTreeOpened(true)}>
                    <MenuIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : null}
              <div className={classes.breadcrumbsContent}>
                <ContentBreadcrumbs
                  onItemClick={(i) => {
                    onNavigate(i.content)
                  }}
                  batchActions={true}
                />
              </div>
            </div>

            <div className={`${classes.treeAndDatagridWrapper} leftTree theme-${theme.palette.type} `}>
              {hasTree && !isMobile && (
                <div className={classes.simpleTree}>
                  <div className={classes.treeViewport}>{renderTree()}</div>
                  <div
                    className={classes.resizeButton}
                    onMouseDown={handleMouseDown}
                    onKeyDown={handleResizeKeyDown}
                    role="separator"
                    aria-label="Resize tree panel"
                    aria-orientation="vertical"
                    tabIndex={0}
                  />
                </div>
              )}
              <div className={classes.exploreContainer}>{renderContent()}</div>
              {hasTree && isMobile ? (
                <SwipeableDrawer
                  open={mobileTreeOpened}
                  onOpen={() => setMobileTreeOpened(true)}
                  onClose={() => setMobileTreeOpened(false)}
                  ModalProps={{ keepMounted: true }}
                  PaperProps={{ className: classes.mobileTreePaper }}>
                  <div className={clsx(classes.mobileTreeHeader, globalClasses.centeredVertical)}>Content tree</div>
                  <div className={classes.mobileTreeContent}>{renderTree()}</div>
                </SwipeableDrawer>
              ) : null}
            </div>
          </CurrentAncestorsProvider>
        </CurrentChildrenProvider>
      </CurrentContentProvider>
    </LoadSettingsContextProvider>
  )
}
