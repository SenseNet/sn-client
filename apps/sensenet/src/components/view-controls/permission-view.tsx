import { AclResponseModel } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
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
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import GroupOutlined from '@material-ui/icons/GroupOutlined'
import clsx from 'clsx'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ResponsivePersonalSettings } from '../../context'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { getUrlForContent } from '../../services'
import { useDialog } from '../dialogs'

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
      color: theme.palette.primary.main,
      paddingLeft: '15px',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline',
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
  const repo = useRepository()
  const localization = useLocalization()
  const history = useHistory()
  const logger = useLogger('PermissionEditor')
  const uiSettings = useContext(ResponsivePersonalSettings)
  const { openDialog } = useDialog()
  const [permissions, setPermissions] = useState<AclResponseModel | undefined>(undefined)
  const [currentContent, setCurrentContent] = useState<GenericContent | undefined>()
  const [openInheritedList, setOpenInheritedList] = useState<boolean>(false)
  const [openSetOnThisList, setOpenSetOnThisList] = useState<boolean>(true)

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
  }, [localization.permissionEditor.errorGetAcl, logger, props.contentPath, repo])

  return (
    <div className={classes.permissionEditorContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          {localization.permissionEditor.setPermissons}{' '}
          <span className={classes.textBolder}>{currentContent?.DisplayName}</span>
        </div>
        <Button aria-label={localization.permissionEditor.assign} color="primary" variant="contained">
          {localization.permissionEditor.assign}
        </Button>
      </div>
      <List component="nav">
        <ListItem button onClick={() => setOpenInheritedList(!openInheritedList)}>
          {openInheritedList ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={localization.permissionEditor.inherited} className={classes.listTitle} />
        </ListItem>
        <Collapse className={classes.collapseWrapper} in={openInheritedList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {permissions?.entries
              .filter((entry) => entry.inherited === true)
              .map((inheritedEntry) => {
                return (
                  <ListItem
                    button
                    key={inheritedEntry.identity.id}
                    onClick={() =>
                      openDialog({
                        name: 'permission-editor',
                        props: { entry: inheritedEntry },
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
                            onClick={async () => {
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
          {permissions?.entries.filter((entry) => entry.inherited === false).length === 0 ? (
            <ListItem>
              <ListItemText primary={localization.permissionEditor.noContent} />
            </ListItem>
          ) : (
            <List component="div" disablePadding>
              {permissions?.entries
                .filter((entry) => entry.inherited === false)
                .map((setOnThisEntry) => {
                  return (
                    <ListItem
                      button
                      key={setOnThisEntry.identity.id}
                      onClick={() =>
                        openDialog({
                          name: 'permission-editor',
                          props: { entry: setOnThisEntry },
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

                      <ListItemText primary={setOnThisEntry.identity.displayName} />
                    </ListItem>
                  )
                })}
            </List>
          )}
        </Collapse>
      </List>
    </div>
  )
}
