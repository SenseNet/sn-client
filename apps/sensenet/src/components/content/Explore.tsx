import { createStyles, makeStyles, SwipeableDrawer, Theme, useTheme } from '@material-ui/core'
import FolderOpenOutlined from '@material-ui/icons/FolderOpenOutlined'
import { ODataFieldParameter, ODataParams } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenContext,
  CurrentChildrenIsLoadingContext,
  CurrentChildrenProvider,
  CurrentContentContext,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  useLogger,
  useRepository,
} from '@sensenet/hooks-react'
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { ColDef } from 'ag-grid-community'
import { clsx } from 'clsx'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router'
import { GridKeyEnum } from '../../../src/components/grid/enums/GridKey.enum'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, usePersonalSettings, useQuery, useSelectionService, useSnRoute } from '../../hooks'
import { useRepositoryColumnSettings } from '../../hooks/use-repository-column-settings'
import { getPrimaryActionUrl, navigateToAction } from '../../services'
import { ColumnSettingsSource, LegacyColumnSetting, LegacyColumnSettings } from '../../services/column-settings-service'
import { resolveContentLinkTarget } from '../../services/favorites'
import { ContentViewMode } from '../../services/PersonalSettings'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { DocumentViewer } from '../document-viewer'
import { EditBinary } from '../edit/edit-binary'
import { Grid } from '../grid/Grid'
import { SimpleTree } from '../tree/simpletree'
import { BrowseView, EditView, ImageView, NewView, PermissionView, VersionView } from '../view-controls'
import WopiPage from '../wopi-page'
import { AUI_APPLICATION_CONTENT_TYPE, AUIApplicationView } from './AUIApplicationView'
import { ContentItemsView } from './ContentItemsView'
import { ContentViewToolbar, ExplorerStatusBar } from './ContentViewToolbar'
import { ExplorerDragDrop } from './ExplorerDragDrop'
import './explorer.css'

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
  'Version',
]

const getGridLoadChildrenSettings = (
  colDef: ColDef[],
  columnSettings?: LegacyColumnSetting[],
): ODataParams<GenericContent> => {
  const selectFields = new Set<string>(requiredGridLoadFields)
  selectFields.add('Binary')
  selectFields.add('PageCount')
  const expandFields = new Set<string>(['CreatedBy', 'ModifiedBy'])
  const hasInlineEditColumn = colDef.some((column) => column.colId === 'edit-binary')

  colDef.forEach((columnDefinition) => {
    if (columnDefinition.field && columnDefinition.field !== '0') {
      selectFields.add(columnDefinition.field)
    }
  })

  columnSettings?.forEach(({ field }) => {
    if (
      !field ||
      field === 'Actions' ||
      (hasInlineEditColumn && ['edit-binary', 'EditBinary', 'edit', 'Edit'].includes(field))
    ) {
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

const mergeGridLoadChildrenSettings = (
  generatedSettings: ODataParams<GenericContent>,
  explicitSettings?: ODataParams<GenericContent>,
): ODataParams<GenericContent> => {
  if (!explicitSettings) return generatedSettings

  const generatedSelect = generatedSettings.select === 'all' ? [] : generatedSettings.select || []
  const explicitSelect = explicitSettings.select === 'all' ? [] : explicitSettings.select || []
  const generatedExpand = generatedSettings.expand || []
  const explicitExpand = explicitSettings.expand || []
  const select =
    generatedSettings.select === 'all' || explicitSettings.select === 'all'
      ? 'all'
      : (Array.from(
          new Set([...generatedSelect, ...explicitSelect, ...explicitExpand]),
        ) as ODataFieldParameter<GenericContent>)

  return {
    ...generatedSettings,
    ...explicitSettings,
    select,
    expand: Array.from(new Set([...generatedExpand, ...explicitExpand])) as ODataFieldParameter<GenericContent>,
  }
}

const useStyles = makeStyles<Theme, { width: number }>((theme) =>
  createStyles({
    breadcrumbsWrapper: {
      boxSizing: 'border-box',
      borderBottom: '1px solid var(--sn-explorer-border)',
      background: 'var(--sn-explorer-bg)',
      justifyContent: 'start',
      minHeight: 54,
      flexShrink: 0,
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
      flex: '1 1 0',
      minHeight: 0,
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
      background: 'var(--sn-explorer-surface)',
      borderLeft: '1px solid var(--sn-explorer-border)',
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
      paddingRight: '6px',
      backgroundColor: 'var(--sn-explorer-sidebar)',
      height: '100%',
    },
    mobileTreeButton: {
      display: 'none',
      flexShrink: 0,
      marginLeft: '10px',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      padding: 0,
      color: 'var(--sn-explorer-text)',
      background: 'var(--sn-explorer-surface)',
      border: '1px solid var(--sn-explorer-border)',
      borderRadius: 7,
      cursor: 'pointer',
      '&:hover': { background: 'var(--sn-explorer-hover)' },
      '&:focus-visible': { outline: '2px solid var(--sn-explorer-accent)', outlineOffset: 2 },
      [theme.breakpoints.down('sm')]: {
        display: 'inline-flex',
      },
    },
    mobileTreePaper: {
      width: '86vw',
      maxWidth: 360,
      backgroundColor: 'var(--sn-explorer-sidebar)',
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
      width: '6px',
      minWidth: '6px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'ew-resize',
      zIndex: 999,
      touchAction: 'none',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'var(--sn-explorer-hover)',
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
        width: '2px',
        height: '32px',
        borderRadius: '2px',
        backgroundColor: 'var(--sn-explorer-border)',
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
  viewMode: ContentViewMode
}

const ActiveContentRouteSync: React.FC = () => {
  const currentContent = useContext(CurrentContentContext)
  const currentChildren = useContext(CurrentChildrenContext)
  const isChildrenLoading = useContext(CurrentChildrenIsLoadingContext)
  const selectionService = useSelectionService()

  useEffect(() => {
    selectionService.selection.setValue([])
  }, [currentContent.Id, selectionService.selection])

  useEffect(() => {
    if (isChildrenLoading) return
    const selected = selectionService.selection.getValue()
    const childrenById = new Map(currentChildren.map((item) => [item.Id, item]))
    const refreshedSelection = selected
      .map((item) => childrenById.get(item.Id))
      .filter((item): item is GenericContent => Boolean(item))
    if (
      refreshedSelection.length !== selected.length ||
      refreshedSelection.some((item, index) => item !== selected[index])
    ) {
      selectionService.selection.setValue(refreshedSelection)
    }
  }, [currentChildren, isChildrenLoading, selectionService.selection])

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
  viewMode,
}) => {
  const selectionService = useSelectionService()
  const currentContent = useContext(CurrentContentContext)

  if (currentContent.Type === AUI_APPLICATION_CONTENT_TYPE) {
    return <AUIApplicationView />
  }

  const contentViewProps = {
    disableColumnSettings,
    enableBreadcrumbs: false,
    fieldsToDisplay,
    onColumnSettingsChange,
    columnSettingsSource,
    isColumnSettingsLoading,
    schema,
    onParentChange: onNavigate,
    onActivateItem,
    onActiveItemChange: (item: GenericContent) => selectionService.activeContent.setValue(item),
    parentIdOrPath: currentPath,
    colDef,
    gridKey,
    rowHeight: 40,
    headerHeight: 38,
  }

  return (
    <>
      <div className="sn-explorer-content-view" style={{ flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
        {viewMode === 'details' ? (
          <Grid {...contentViewProps} />
        ) : (
          <ContentItemsView {...contentViewProps} viewMode={viewMode} />
        )}
      </div>
    </>
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
  const personalSettings = usePersonalSettings()
  const localization = useLocalization().contentViews
  const logger = useLogger('Explore')
  const [viewMode, setViewMode] = useState<ContentViewMode>(personalSettings.defaultContentView)
  useEffect(() => {
    setViewMode(personalSettings.defaultContentView)
  }, [personalSettings.defaultContentView])
  const [width, setWidth] = useState<number>(Number(localStorage.getItem('treeWidth') ?? '280'))
  const classes = useStyles({ width })
  const globalClasses = useGlobalStyles()
  const isResizing = useRef(false)
  const device = useContext(ResponsiveContext)
  const [mobileTreeOpened, setMobileTreeOpened] = useState(false)
  const [refreshToken, setRefreshToken] = useState(0)
  const [loadFailure, setLoadFailure] = useState<{ path: string; error: Error }>()
  useEffect(() => setLoadFailure(undefined), [currentPath])
  const currentLoadError = loadFailure?.path === currentPath ? loadFailure.error : undefined
  const onLoadError = useCallback(
    (error: Error) => {
      logger.debug({ message: localization.loadFailed, data: { error, currentPath } })
      setLoadFailure({ path: currentPath, error })
    },
    [currentPath, localization.loadFailed, logger],
  )
  const refreshContent = () => {
    setLoadFailure(undefined)
    setRefreshToken((value) => value + 1)
  }
  const activationRequest = useRef<AbortController>()
  useEffect(() => () => activationRequest.current?.abort(), [currentPath])
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
  const routeLocation = useLocation()
  useEffect(() => setMobileTreeOpened(false), [routeLocation.pathname, routeLocation.search])
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
    useRepositoryColumnSettings(currentPath, explicitColumnSettings, refreshToken)
  const currentChildrenLoadSettings = useMemo(
    () => mergeGridLoadChildrenSettings(getGridLoadChildrenSettings(colDef, columnSettings), loadChildrenSettings),
    [colDef, columnSettings, loadChildrenSettings],
  )
  const onActivateItemOverride = async (activeItem: GenericContent) => {
    activationRequest.current?.abort()
    const ac = new AbortController()
    activationRequest.current = ac
    try {
      const contentToOpen = await resolveContentLinkTarget(repository, activeItem)
      if (ac.signal.aborted) return
      const expandedItem = await repository.load({
        idOrPath: contentToOpen.Id || contentToOpen.Path,
        requestInit: { signal: ac.signal },
        oDataOptions: {
          select: Array.isArray(repository.configuration.requiredSelect)
            ? ([...repository.configuration.requiredSelect, 'Actions/Name'] as ODataFieldParameter<GenericContent>)
            : repository.configuration.requiredSelect,
          expand: ['Actions'] as ODataFieldParameter<GenericContent>,
        },
      })
      if (ac.signal.aborted) return
      const { location } = history
      history.push(getPrimaryActionUrl({ content: expandedItem.d, repository, uiSettings, location, snRoute }))
    } catch (error) {
      if (!ac.signal.aborted) onLoadError(error)
    }
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
        <ExploreGridOrApplication
          viewMode={viewMode}
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
      rootPath={rootPath}
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
      <CurrentContentProvider key={refreshToken} idOrPath={currentPath} onError={onLoadError}>
        <CurrentChildrenProvider alwaysRefresh={alwaysRefreshChildren} onError={onLoadError}>
          <ActiveContentRouteSync />
          <CurrentAncestorsProvider root={rootPath}>
            <div className={`sn-explorer theme-${theme.palette.type}`} data-test="explorer-workspace">
              <ExplorerDragDrop
                enabled={!activeAction && !currentLoadError}
                onNavigate={onNavigate}
                onTouchDrop={() => setMobileTreeOpened(false)}>
                <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
                  {hasTree && isMobile ? (
                    <button
                      type="button"
                      className={classes.mobileTreeButton}
                      title={localization.openTree}
                      aria-label={localization.openTree}
                      onClick={() => setMobileTreeOpened(true)}>
                      <FolderOpenOutlined fontSize="small" />
                    </button>
                  ) : null}
                  <div className={classes.breadcrumbsContent}>
                    <ContentBreadcrumbs
                      rootPath={rootPath}
                      onItemClick={(i) => {
                        onNavigate(i.content)
                      }}
                      explorerNavigation
                      onRefresh={!activeAction ? refreshContent : undefined}
                    />
                  </div>
                </div>

                {!activeAction && <ContentViewToolbar viewMode={viewMode} onViewModeChange={setViewMode} />}

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
                  <div className={classes.exploreContainer}>
                    {currentLoadError ? (
                      <div className="sn-explorer-load-error" data-test="explorer-load-error" role="alert">
                        <p>{localization.loadFailed}</p>
                        <button type="button" data-test="explorer-load-retry" onClick={refreshContent}>
                          {localization.retry}
                        </button>
                      </div>
                    ) : (
                      renderContent()
                    )}
                  </div>
                  {hasTree && isMobile ? (
                    <SwipeableDrawer
                      open={mobileTreeOpened}
                      onOpen={() => setMobileTreeOpened(true)}
                      onClose={() => setMobileTreeOpened(false)}
                      ModalProps={{ keepMounted: true }}
                      PaperProps={{
                        className: clsx(classes.mobileTreePaper, 'sn-explorer', `theme-${theme.palette.type}`),
                        style: { width: '86vw', maxWidth: 360 },
                      }}>
                      <div className={clsx(classes.mobileTreeHeader, globalClasses.centeredVertical)}>
                        {localization.folders}
                      </div>
                      <div className={classes.mobileTreeContent}>{renderTree()}</div>
                    </SwipeableDrawer>
                  ) : null}
                </div>
                {!activeAction && <ExplorerStatusBar />}
              </ExplorerDragDrop>
            </div>
          </CurrentAncestorsProvider>
        </CurrentChildrenProvider>
      </CurrentContentProvider>
    </LoadSettingsContextProvider>
  )
}
