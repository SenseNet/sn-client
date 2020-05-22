import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsProvider,
  CurrentChildrenProvider,
  CurrentContentProvider,
  LoadSettingsContextProvider,
  useRepository,
} from '@sensenet/hooks-react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { applicationPaths, resolvePathParams } from '../../application-paths'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useSelectionService } from '../../hooks'
import { useDialogActionService } from '../../hooks/use-dialogaction-service'
import { getPrimaryActionUrl } from '../../services'
import { ContentList } from '../content-list/content-list'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { FullScreenLoader } from '../full-screen-loader'
import { editviewFileResolver, Icon } from '../Icon'
import { ActionNameType } from '../react-control-mapper'
import TreeWithData from '../tree/tree-with-data'
import { VersionView } from '../view-controls'
import { EditView } from '../view-controls/edit-view'
import { NewView } from '../view-controls/new-view'

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
  fieldsToDisplay?: Array<keyof GenericContent>
}

export function Explore({ currentPath, onNavigate, rootPath, fieldsToDisplay }: ExploreProps) {
  const selectionService = useSelectionService()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const [action, setAction] = useState<ActionNameType>()
  const [isTreeLoading, setIsTreeLoading] = useState(false)
  const repo = useRepository()
  const history = useHistory()
  const dialogActionService = useDialogActionService()

  const onActivateItemOverride = (activeItem: GenericContent) => {
    getPrimaryActionUrl(activeItem, repo) === 'openEdit'
      ? dialogActionService.activeAction.setValue('edit')
      : history.push(getPrimaryActionUrl(activeItem, repo))
  }

  useEffect(() => {
    const activeDialogActionObserve = dialogActionService.activeAction.subscribe((newDialogAction) =>
      setAction(newDialogAction),
    )

    return function cleanup() {
      activeDialogActionObserve.dispose()
    }
  }, [dialogActionService.activeAction])

  const getContentTypeId = async (contentType: string) => {
    const result = await repo.loadCollection({
      path: '/Root/System/Schema/ContentTypes',
      oDataOptions: {
        query: `+TypeIs:'ContentType' AND Name:${contentType} .AUTOFILTERS:OFF`,
      },
    })
    return result.d
  }

  return (
    <>
      <LoadSettingsContextProvider>
        <CurrentContentProvider idOrPath={currentPath}>
          <CurrentChildrenProvider>
            <CurrentAncestorsProvider root={rootPath}>
              <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
                <ContentBreadcrumbs
                  onItemClick={(i) => {
                    onNavigate(i.content)
                    dialogActionService.activeAction.setValue(undefined)
                    selectionService.activeContent.setValue(i.content)
                  }}
                  batchActions={true}
                />
              </div>
              <div className={classes.treeAndDatagridWrapper}>
                <TreeWithData
                  onItemClick={(item) => {
                    selectionService.activeContent.setValue(item)
                    dialogActionService.activeAction.setValue(undefined)
                    onNavigate(item)
                  }}
                  parentPath={PathHelper.isAncestorOf(rootPath, currentPath) ? rootPath : currentPath}
                  activeItemPath={currentPath}
                  onTreeLoadingChange={(isLoading) => setIsTreeLoading(isLoading)}
                />
                <div className={classes.exploreContainer}>
                  {action ? (
                    <>
                      {action === 'edit' || action === 'browse' ? (
                        <>
                          <div className={clsx(classes.title, globalClasses.centered)}>
                            {action === 'edit' ? (
                              <span>
                                Edit{' '}
                                <span style={{ fontWeight: 500 }}>
                                  {selectionService.activeContent.getValue()?.DisplayName}
                                </span>
                              </span>
                            ) : (
                              <span>
                                Info about{' '}
                                <span style={{ fontWeight: 500 }}>
                                  {selectionService.activeContent.getValue()?.DisplayName}
                                </span>
                              </span>
                            )}
                            <span
                              onClick={async () => {
                                dialogActionService.activeAction.setValue(undefined)
                                selectionService.activeContent.getValue() &&
                                  history.push(
                                    resolvePathParams({
                                      path: applicationPaths.editBinary,
                                      params: {
                                        contentId: (
                                          await getContentTypeId(selectionService.activeContent.getValue()!.Type)
                                        ).results[0].Id,
                                      },
                                    }),
                                  )
                              }}>
                              <Icon
                                resolvers={editviewFileResolver}
                                style={{ marginLeft: '9px', height: '24px', width: '24px', cursor: 'pointer' }}
                                item={selectionService.activeContent.getValue()}
                              />
                            </span>
                          </div>
                          <EditView
                            uploadFolderpath="/Root/Content/demoavatars"
                            actionName={action}
                            submitCallback={() => dialogActionService.activeAction.setValue(undefined)}
                          />
                        </>
                      ) : action === 'new' ? (
                        dialogActionService.contentTypeNameForNewContent.getValue() && (
                          <>
                            <div className={clsx(classes.title, globalClasses.centered)}>
                              <span>
                                New{' '}
                                <span style={{ fontWeight: 500 }}>
                                  {dialogActionService.contentTypeNameForNewContent.getValue()}
                                </span>
                              </span>
                            </div>
                            <NewView
                              contentTypeName={dialogActionService.contentTypeNameForNewContent.getValue()!}
                              currentContent={selectionService.activeContent.getValue()}
                              uploadFolderpath="/Root/Content/demoavatars"
                              submitCallback={() => {
                                dialogActionService.activeAction.setValue(undefined)
                                dialogActionService.contentTypeNameForNewContent.setValue(undefined)
                              }}
                            />
                          </>
                        )
                      ) : (
                        action === 'version' && (
                          <>
                            <div className={clsx(classes.title, globalClasses.centered)}>
                              Versions of {selectionService.activeContent.getValue()?.DisplayName}
                            </div>
                            <VersionView />
                          </>
                        )
                      )}
                    </>
                  ) : isTreeLoading ? (
                    <FullScreenLoader />
                  ) : (
                    <ContentList
                      style={{ flexGrow: 7, flexShrink: 0, maxHeight: '100%' }}
                      enableBreadcrumbs={false}
                      fieldsToDisplay={fieldsToDisplay}
                      onParentChange={onNavigate}
                      onActivateItem={onActivateItemOverride}
                      onActiveItemChange={(item) => selectionService.activeContent.setValue(item)}
                      parentIdOrPath={currentPath}
                      onSelectionChange={(sel) => {
                        selectionService.selection.setValue(sel)
                      }}
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
