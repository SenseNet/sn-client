import { AclResponseModel, ConstantContent } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent, PermissionValues } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
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
import clsx from 'clsx'
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
      margin: '0px 80px',
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
    },
    title: {
      fontSize: '20px',
    },
    textBolder: {
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
            details: { error },
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

  return (
    <>
      <div className={classes.permissionEditorContainer}>
        <div className={classes.titleContainer}>
          <div className={classes.title}>
            {localization.permissionEditor.setPermissons}{' '}
            <span className={classes.textBolder}>{currentContent?.DisplayName}</span>
          </div>
          <div>
            <Tooltip
              title={
                isPrivate
                  ? localization.permissionEditor.makePublicTooltip
                  : localization.permissionEditor.makePrivateTooltip
              }
              placement="right">
              <Button
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
                          details: { error },
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
              aria-label={localization.permissionEditor.assign}
              className={classes.assignButton}
              color="primary"
              variant="contained">
              {localization.permissionEditor.assign}
            </Button>
          </div>
        </div>
        <List component="nav">
          <ListItem button onClick={() => setOpenInheritedList(!openInheritedList)}>
            {openInheritedList ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={localization.permissionEditor.inherited} className={classes.listTitle} />
          </ListItem>
          <Collapse className={classes.collapseWrapper} in={openInheritedList} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {inheritedArray?.map((inheritedEntry) => {
                return (
                  <ListItem
                    button
                    key={inheritedEntry.identity.id}
                    onClick={() =>
                      openDialog({
                        name: 'permission-editor',
                        props: {
                          entry: inheritedEntry,
                          path: currentContent!.Path,
                          callBackFunction: () => {
                            setRefreshFlag(!refreshFlag)
                          },
                        },
                        dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
                      })
                    }>
                    {inheritedEntry.identity.kind === 'group' ? (
                      <div className={clsx(classes.iconWrapper, globalClasses.centered)}>
                        <GroupOutlined />
                      </div>
                    ) : inheritedEntry.identity.kind === 'user' && inheritedEntry.identity.avatar ? (
                      <Avatar
                        src={PathHelper.joinPaths(repo.configuration.repositoryUrl, inheritedEntry.identity.avatar)}
                      />
                    ) : null}
                    <ListItemText
                      primary={
                        <div>
                          {inheritedEntry.identity.displayName}
                          <Link
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
                )
              })}
            </List>
          </Collapse>
          <ListItem button onClick={() => setOpenSetOnThisList(!openSetOnThisList)}>
            {openSetOnThisList ? <ExpandLess /> : <ExpandMore />}
            <ListItemText primary={localization.permissionEditor.setOnThis} className={classes.listTitle} />
          </ListItem>
          <Collapse className={classes.collapseWrapper} in={openSetOnThisList} timeout="auto" unmountOnExit>
            {setOnThisArray?.length === 0 ? (
              <ListItem>
                <ListItemText primary={localization.permissionEditor.noContent} />
              </ListItem>
            ) : (
              <List component="div" disablePadding>
                {setOnThisArray?.map((setOnThisEntry) => {
                  return (
                    <ListItem
                      button
                      key={setOnThisEntry.identity.id}
                      onClick={() =>
                        openDialog({
                          name: 'permission-editor',
                          props: {
                            entry: setOnThisEntry,
                            path: currentContent!.Path,
                            callBackFunction: () => {
                              setRefreshFlag(!refreshFlag)
                            },
                          },
                          dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
                        })
                      }>
                      <ListItemIcon>
                        {setOnThisEntry.identity.kind === 'group' ? (
                          <div className={clsx(classes.iconWrapper, globalClasses.centered)}>
                            <GroupOutlined />
                          </div>
                        ) : setOnThisEntry.identity.kind === 'user' && setOnThisEntry.identity.avatar ? (
                          <Avatar
                            src={PathHelper.joinPaths(repo.configuration.repositoryUrl, setOnThisEntry.identity.avatar)}
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
