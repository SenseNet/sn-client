import {
  Avatar,
  Button,
  Collapse,
  createStyles,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core'
import DesktopMac from '@material-ui/icons/DesktopMac'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import GroupOutlined from '@material-ui/icons/GroupOutlined'
import { AclResponseModel, ConstantContent, EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent, PermissionValues } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { getUrlForContent, navigateToAction } from '../../services'
import { useDialog } from '../dialogs'
import { useViewControlStyles } from './common/styles'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    permissionEditorContainer: {
      padding: '0px 80px',
      overflowY: 'auto',
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      alignItems: 'center',
    },
    title: {
      fontSize: '20px',
      paddingRight: '10px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contentName: {
      fontWeight: 500,
    },
    listTitle: {
      marginLeft: '16px',
    },
    iconWrapper: {
      height: '40px',
      width: '40px',
    },
    collapseWrapper: {
      paddingLeft: '30px',
    },
    anchor: {
      fontSize: '14px',
      paddingLeft: '15px',
    },
    localOnlyIcon: {
      marginLeft: '20px',
    },
    assignButton: {
      marginLeft: '20px',
    },
    publicButton: {
      backgroundColor: '#12cdd4',
      color: theme.palette.common.white,
      '&:hover': {
        backgroundColor: '#00838f',
      },
    },
    buttonWrapper: {
      display: 'inline-flex',
      whiteSpace: 'nowrap',
    },
  })
})

export interface PermissionViewProps {
  contentPath: string
}

export const PermissionView: React.FC<PermissionViewProps> = (props) => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const controlClasses = useViewControlStyles()
  const repo = useRepository()
  const localization = useLocalization()
  const history = useHistory()
  const logger = useLogger('PermissionEditor')
  const uiSettings = useContext(ResponsivePersonalSettings)
  const { openDialog } = useDialog()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const [permissions, setPermissions] = useState<AclResponseModel>()
  const [currentContent, setCurrentContent] = useState<GenericContent>()
  const [openInheritedList, setOpenInheritedList] = useState<boolean>(false)
  const [openSetOnThisList, setOpenSetOnThisList] = useState<boolean>(true)
  const [refreshFlag, setRefreshFlag] = useState<boolean>(false)
  const [selectedListItem, setSelectedListItem] = useState<string>()
  const [isPrivate, setIsPrivate] = useState<boolean>(false)

  const setOnThisArray = permissions?.entries.filter((entry) => entry.inherited === false)
  const inheritedArray = permissions?.entries.filter((entry) => entry.inherited === true)

  useEffect(() => {
    async function getCurrentContent() {
      const result = await repo.load({
        idOrPath: props.contentPath,
      })
      setCurrentContent(result.d)
    }
    getCurrentContent()
  }, [props.contentPath, repo])

  useEffect(() => {
    async function getAllPermissions() {
      try {
        const result = await repo.security.getAcl(props.contentPath)
        setPermissions(result)
      } catch (error) {
        logger.error({
          message: localization.permissionEditor.errorGetAcl,
          data: {
            error,
          },
        })
      }
    }
    getAllPermissions()
  }, [localization.permissionEditor.errorGetAcl, logger, props.contentPath, repo, refreshFlag])

  useEffect(() => {
    const visitorEntries = permissions?.entries.filter(
      (entry) => entry.identity.path === ConstantContent.VISITOR_USER.Path && entry.permissions.Open?.value === 'allow',
    )
    visitorEntries && visitorEntries.length > 0 ? setIsPrivate(false) : setIsPrivate(true)
  }, [permissions])

  const selectMemberFunction = (newEntry: EntryType) => {
    if (permissions) {
      permissions.entries.push(newEntry)
    }
    setSelectedListItem(`${newEntry.identity.id}${newEntry.propagates}`)
    openDialog({
      name: 'permission-editor',
      props: {
        entry: newEntry,
        path: currentContent!.Path,
        submitCallback: () => {
          setRefreshFlag(!refreshFlag)
        },
        cancelCallback: () => {
          permissions?.entries.pop()
        },
      },
      dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
    })
  }

  return (
    <>
      <div className={classes.permissionEditorContainer}>
        <div className={classes.titleContainer}>
          <Tooltip title={localization.permissionEditor.setPermissons + currentContent?.DisplayName} placement="top">
            <div className={classes.title}>
              <span data-test={'permission-view-title-first'}>{localization.permissionEditor.setPermissons} </span>
              <span data-test={'permission-view-title-second'} className={classes.contentName}>
                {currentContent?.DisplayName}
              </span>
            </div>
          </Tooltip>
          <div className={classes.buttonWrapper}>
            <Tooltip
              title={
                isPrivate
                  ? localization.permissionEditor.makePublicTooltip
                  : localization.permissionEditor.makePrivateTooltip
              }
              placement="right">
              <Button
                data-test={'make-content-public-or-private'}
                aria-label={
                  isPrivate ? localization.permissionEditor.makePublic : localization.permissionEditor.makePrivate
                }
                className={classes.publicButton}
                variant="contained"
                onClick={async () => {
                  if (permissions) {
                    try {
                      if (isPrivate) {
                        await repo.security.setPermissions(permissions.path, [
                          { identity: ConstantContent.VISITOR_USER.Path, Open: PermissionValues.allow },
                        ])
                      } else {
                        await repo.security.setPermissions(permissions.path, [
                          { identity: ConstantContent.VISITOR_USER.Path, See: PermissionValues.undefined },
                        ])
                      }
                    } catch (error) {
                      logger.error({
                        message: error.message,
                        data: {
                          error,
                        },
                      })
                      return false
                    } finally {
                      setRefreshFlag(!refreshFlag)
                    }
                  }
                }}>
                {isPrivate ? localization.permissionEditor.makePublic : localization.permissionEditor.makePrivate}
              </Button>
            </Tooltip>
            <Button
              data-test={'assign-new-permission'}
              className={classes.assignButton}
              aria-label={localization.permissionEditor.assign}
              color="primary"
              variant="contained"
              onClick={() => {
                setSelectedListItem(undefined)
                openDialog({
                  name: 'member-select',
                  props: {
                    currentContentPath: currentContent?.Path,
                    callbackAfterSelect: (newEntry) => {
                      selectMemberFunction(newEntry)
                    },
                  },
                  dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
                })
              }}>
              {localization.permissionEditor.assign}
            </Button>
          </div>
        </div>
        <List component="nav">
          <ListItem
            data-test={'permission-inherited-list'}
            button
            onClick={() => setOpenInheritedList(!openInheritedList)}>
            {openInheritedList ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={localization.permissionEditor.inherited} className={classes.listTitle} />
          </ListItem>
          <Collapse className={classes.collapseWrapper} in={openInheritedList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {inheritedArray?.map((inheritedEntry) => {
                return (
                  <Tooltip key={inheritedEntry.identity.id} title={inheritedEntry.identity.path} placement="left">
                    <ListItem
                      selected={selectedListItem === `${inheritedEntry.identity.id}${inheritedEntry.propagates}`}
                      button
                      onClick={() => {
                        setSelectedListItem(`${inheritedEntry.identity.id}${inheritedEntry.propagates}`)
                        openDialog({
                          name: 'permission-editor',
                          props: {
                            entry: inheritedEntry,
                            path: currentContent!.Path,
                            submitCallback: () => {
                              setRefreshFlag(!refreshFlag)
                            },
                          },
                          dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
                        })
                      }}>
                      <ListItemIcon
                        data-test={`inherited-${inheritedEntry.identity.displayName
                          ?.replace(/\s+/g, '-')
                          .toLowerCase()}`}>
                        {inheritedEntry.identity.kind === 'group' ? (
                          <div className={clsx(classes.iconWrapper, globalClasses.centered)}>
                            <GroupOutlined />
                          </div>
                        ) : inheritedEntry.identity.kind === 'user' && inheritedEntry.identity.avatar ? (
                          <Avatar
                            src={PathHelper.joinPaths(repo.configuration.repositoryUrl, inheritedEntry.identity.avatar)}
                          />
                        ) : null}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <div>
                            {inheritedEntry.identity.displayName}
                            <Link
                              data-test={`inherited-${inheritedEntry.identity.displayName
                                ?.replace(/\s+/g, '-')
                                .toLowerCase()}-link`}
                              component="button"
                              onClick={async (event: React.MouseEvent<HTMLElement>) => {
                                event.stopPropagation()
                                const response = await repo.load({
                                  idOrPath: inheritedEntry.ancestor!,
                                  oDataOptions: { select: 'all' },
                                })
                                history.push(
                                  getUrlForContent({
                                    content: response.d,
                                    uiSettings,
                                    location: history.location,
                                    action: 'setpermissions',
                                  }),
                                )
                              }}
                              className={classes.anchor}>
                              ({inheritedEntry.ancestor})
                            </Link>
                          </div>
                        }
                      />
                    </ListItem>
                  </Tooltip>
                )
              })}
            </List>
          </Collapse>
          <ListItem
            data-test={'permission-set-on-this-list'}
            button
            onClick={() => setOpenSetOnThisList(!openSetOnThisList)}>
            {openSetOnThisList ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={localization.permissionEditor.setOnThis} className={classes.listTitle} />
          </ListItem>
          <Collapse className={classes.collapseWrapper} in={openSetOnThisList} timeout="auto" unmountOnExit>
            {setOnThisArray?.length === 0 ? (
              <ListItem>
                <ListItemText primary={localization.permissionEditor.noContent} />
              </ListItem>
            ) : (
              <List id="setOnThisList" component="div" disablePadding>
                {setOnThisArray?.map((setOnThisEntry) => {
                  return (
                    <Tooltip
                      key={`${setOnThisEntry.identity.id}${setOnThisEntry.propagates}`}
                      title={setOnThisEntry.identity.path}
                      placement="left">
                      <ListItem
                        data-test={`set-on-this-${setOnThisEntry.identity.displayName
                          ?.replace(/\s+/g, '-')
                          .toLowerCase()}${!setOnThisEntry.propagates ? '-local-only' : ''}`}
                        selected={selectedListItem === `${setOnThisEntry.identity.id}${setOnThisEntry.propagates}`}
                        button
                        key={`${setOnThisEntry.identity.id}${setOnThisEntry.propagates}`}
                        onClick={() => {
                          setSelectedListItem(`${setOnThisEntry.identity.id}${setOnThisEntry.propagates}`)
                          openDialog({
                            name: 'permission-editor',
                            props: {
                              entry: setOnThisEntry,
                              path: currentContent!.Path,
                              submitCallback: () => {
                                setRefreshFlag(!refreshFlag)
                              },
                            },
                            dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
                          })
                        }}>
                        <ListItemIcon>
                          {setOnThisEntry.identity.kind === 'group' ? (
                            <div className={clsx(classes.iconWrapper, globalClasses.centered)}>
                              <GroupOutlined />
                            </div>
                          ) : setOnThisEntry.identity.kind === 'user' && setOnThisEntry.identity.avatar ? (
                            <Avatar
                              src={PathHelper.joinPaths(
                                repo.configuration.repositoryUrl,
                                setOnThisEntry.identity.avatar,
                              )}
                            />
                          ) : null}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <div className={globalClasses.centeredVertical}>
                              {setOnThisEntry.identity.displayName}
                              {!setOnThisEntry.propagates && (
                                <Tooltip title={localization.permissionEditor.localOnly} placement="top">
                                  <DesktopMac className={classes.localOnlyIcon} />
                                </Tooltip>
                              )}
                            </div>
                          }
                        />
                      </ListItem>
                    </Tooltip>
                  )
                })}
              </List>
            )}
          </Collapse>
        </List>
      </div>
      <div className={controlClasses.actionButtonWrapper}>
        <Button
          aria-label={localization.permissionEditor.cancel}
          color="default"
          className={globalClasses.cancelButton}
          onClick={() => {
            navigateToAction({ history, routeMatch })
          }}>
          {localization.permissionEditor.cancel}
        </Button>
      </div>
    </>
  )
}
