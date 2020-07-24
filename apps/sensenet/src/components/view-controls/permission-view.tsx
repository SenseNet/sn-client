import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import {
  Button,
  Collapse,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import GroupOutlined from '@material-ui/icons/GroupOutlined'
import React, { useEffect, useState } from 'react'
import { useLocalization } from '../../hooks'
import { AclResponseType } from './permission-types'

const useStyles = makeStyles(() => {
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
      fontSize: '16px',
    },
    listTitle: {
      marginLeft: '16px',
    },
  })
})

export interface PermissionViewProps {
  contentPath: string
}

export const PermissionView: React.FC<PermissionViewProps> = (props) => {
  const classes = useStyles()
  const repo = useRepository()
  const localization = useLocalization()
  const [permissions, setPermissions] = useState<AclResponseType | undefined>(undefined)
  const [currentContent, setCurrentContent] = useState<GenericContent | undefined>()
  const [openInheritedList, setOpenInheritedList] = useState<boolean>(false)
  const [openSetOnThisList, setOpenSetOnThisList] = useState<boolean>(false)

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
      const result = await repo.executeAction<any, AclResponseType>({
        idOrPath: props.contentPath,
        name: 'GetPermissions',
        method: 'GET',
      })

      //TODO: this part can be removed cause the getAcl action will contains this info
      result.entries.forEach((entry) => {
        let isInherited = false
        for (const permissionName in entry.permissions) {
          if (entry.permissions[permissionName]?.from) {
            isInherited = true
          }
        }
        entry.inherited = isInherited
      })
      setPermissions(result)
    }
    getAllPermissions()
  }, [props.contentPath, repo])

  return (
    <div className={classes.permissionEditorContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}> {currentContent?.DisplayName}</div>
        <Button aria-label={localization.permissionEditor.assign} color="primary" variant="contained">
          {localization.permissionEditor.assign}
        </Button>
      </div>
      <List component="nav">
        <ListItem button onClick={() => setOpenInheritedList(!openInheritedList)}>
          {openInheritedList ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary="Inherited from ancestors" className={classes.listTitle} />
        </ListItem>
        <Collapse in={openInheritedList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {permissions?.entries
              .filter((entry) => entry.inherited === true)
              .map((inheritedEntry) => {
                return (
                  <ListItem button key={inheritedEntry.identity.id}>
                    {inheritedEntry.identity.kind === 'group' && (
                      <ListItemIcon>
                        <GroupOutlined />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={inheritedEntry.identity.displayName} />
                  </ListItem>
                )
              })}
          </List>
        </Collapse>
        <ListItem button onClick={() => setOpenSetOnThisList(!openSetOnThisList)}>
          {openSetOnThisList ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary="Set on this content" className={classes.listTitle} />
        </ListItem>
        <Collapse in={openSetOnThisList} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {permissions?.entries
              .filter((entry) => entry.inherited === false)
              .map((setOnThisEntry) => {
                return (
                  <ListItem button key={setOnThisEntry.identity.id}>
                    {setOnThisEntry.identity.kind === 'group' && (
                      <ListItemIcon>
                        <GroupOutlined />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={setOnThisEntry.identity.displayName} />
                  </ListItem>
                )
              })}
          </List>
        </Collapse>
      </List>
    </div>
  )
}
