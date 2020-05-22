import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  useRepository,
} from '@sensenet/hooks-react'
import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { ContentList } from '../content-list/content-list'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { FullScreenLoader } from '../full-screen-loader'
import { editviewFileResolver, Icon } from '../Icon'
import { ActionNameType } from '../react-control-mapper'
import TreeWithData from '../tree/tree-with-data'
import { EditView } from '../view-controls/edit-view'

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
    title: {
      height: '68px',
      fontSize: '20px',
    },
    exploreContainer: {
      display: 'flex',
      flexFlow: 'column',
      width: '100%',
      position: 'relative',
    },
  })
})

type ExploreProps = {
  currentPath: string
  rootPath: string
  onNavigate: (content: GenericContent) => void
  onActivateItem: (content: GenericContent) => void
  fieldsToDisplay?: Array<keyof GenericContent>
}

export function Explore({ currentPath, onActivateItem, onNavigate, rootPath, fieldsToDisplay }: ExploreProps) {
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [isFormOpened, setIsFormOpened] = useState(false)
  const [action, setAction] = useState<ActionNameType>()
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const repo = useRepository()

  const setFormOpen = (actionName: ActionNameType) => {
    setAction(actionName)
    setIsFormOpened(true)
  }

  return (
    <>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={currentPath}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={rootPath}>
              <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
                <ContentBreadcrumbs
                  setFormOpen={(actionName) => setFormOpen(actionName)}
                  onItemClick={(i) => {
                    onNavigate(i.content)
                    setIsFormOpened(false)
                    selectionService.activeContent.setValue(i.content)
                  }}
                  batchActions={true}
                />
              </div>
              <div className={classes.treeAndDatagridWrapper}>
                <TreeWithData
                  onItemClick={(item) => {
                    selectionService.activeContent.setValue(item)
                    setIsFormOpened(false)
                    onNavigate(item)
                  }}
                  parentPath={PathHelper.isAncestorOf(rootPath, currentPath) ? rootPath : currentPath}
                  activeItemPath={currentPath}
                  setFormOpen={(actionName) => setFormOpen(actionName)}
                  onTreeLoadingChange={(isLoading) => setIsTreeLoading(isLoading)}
                />
                <div className={classes.exploreContainer}>
                  {isFormOpened ? (
                    <>
                      {action === 'edit' || action === 'browse' ? (
                        <div className={clsx(classes.title, globalClasses.centered)}>
                          {action === 'edit'
                            ? `Edit ${selectionService.activeContent.getValue()?.DisplayName}`
                            : `Info about ${selectionService.activeContent.getValue()?.DisplayName}`}
                          <Icon
                            resolvers={editviewFileResolver}
                            style={{ marginLeft: '9px', height: '24px', width: '24px' }}
                            item={selectionService.activeContent.getValue()}
                          />
                        </div>
                      ) : null}

                      <EditView
                        uploadFolderpath="/Root/Content/demoavatars"
                        handleCancel={async () => {
                          setIsFormOpened(false)
                          setAction(undefined)
                          if (selectionService.activeContent.getValue() !== undefined) {
                            const parentContent = await repo.load({
                              idOrPath: PathHelper.getParentPath(selectionService.activeContent.getValue()!.Path),
                            })
                            selectionService.activeContent.setValue(parentContent.d)
                          }
                        }}
                        actionName={action}
                        submitCallback={() => setIsFormOpened(false)}
                      />
                    </>
                  ) : isTreeLoading ? (
                    <FullScreenLoader />
                  ) : (
                    <ContentList
                      style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
                      enableBreadcrumbs={false}
                      fieldsToDisplay={fieldsToDisplay}
                      onParentChange={onNavigate}
                      onActivateItem={onActivateItem}
                      onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
                      parentIdOrPath={currentPath}
                      onSelectionChange={(sel) => {
                        selectionService.selection.setValue(sel)
                      }}
                      isOpenFrom="explore"
                      setFormOpen={(actionName) => setFormOpen(actionName)}
                    />
                  )}
                </div>
              </div>
            </CurrentAncestorsProvider>
          </CurrentChildrenProvider>
        </CurrentContentProvider>
      </LoadSettingsContextProvider>
    </>
  )
}
