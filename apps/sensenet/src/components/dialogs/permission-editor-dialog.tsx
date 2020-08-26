import { EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Settings } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { Switcher } from '../field-controls'
import { DialogTitle, useDialog } from '.'

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    contentWrapper: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      padding: 0,
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
      flexBasis: '100%',
    },
    leftColumn: {
      flex: 1,
      padding: 0,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    rightColumn: {
      flex: 2,
      position: 'relative',
    },
    dialogActions: {
      padding: '16px',
    },
    secondaryListItem: {
      paddingLeft: '40px',
    },
    permissionContainer: {
      padding: '60px',
    },
    disabled: {
      color: theme.palette.grey[500],
    },
  })
})

export class PermissionGroupType {
  /* Permission elements */
  public groupObject!: { [permissionName: string]: string[] }
}

export class PermissionSettingType {
  /* Groups of permissions */
  public groups!: PermissionGroupType[]
}

export type PermissionEditorDialogProps = {
  entry: EntryType
}

const PERMISSION_SETTING_PATH = '/Root/System/Settings/Permission.settings'

export function PermissionEditorDialog(props: PermissionEditorDialogProps) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const repo = useRepository()
  const logger = useLogger('permissionEditorDialog')
  const localization = useLocalization()
  const { closeLastDialog } = useDialog()

  const [permissionSettingJSON, setPermissionSettingJSON] = useState<PermissionSettingType>()
  const [actualGroup, setActualGroup] = useState<string>('Read')

  useEffect(() => {
    async function getPermissionSettingJSON() {
      try {
        const result = await repo.load<Settings>({
          idOrPath: PERMISSION_SETTING_PATH,
        })

        const binaryPath = result.d.Binary && result.d.Binary.__mediaresource.media_src
        if (!binaryPath) {
          return
        }
        const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
        if (textFile.ok) {
          const text = await textFile.text()
          setPermissionSettingJSON(JSON.parse(text))
        }
      } catch (error) {
        logger.error({
          message: localization.permissionEditor.errorGetPermissionSetting,
          data: {
            details: { error },
          },
        })
      }
    }
    getPermissionSettingJSON()
  }, [localization.permissionEditor.errorGetPermissionSetting, logger, repo])

  const isPermissionDisabled = (permission: string) => {
    return (
      props.entry.permissions[permission] !== null &&
      props.entry.permissions[permission] !== undefined &&
      props.entry.permissions[permission]?.from !== null
    )
  }

  const isGroupDisabled = (selectedGroup: string) => {
    let disabledFlag = false
    permissionSettingJSON?.groups.map((group: PermissionGroupType) =>
      Object.entries(group)
        .filter(([groupname]) => selectedGroup === groupname)
        .forEach(([, groupItem]) => {
          disabledFlag = true
          groupItem.forEach((permission: string) => {
            disabledFlag = disabledFlag && isPermissionDisabled(permission)
          })
        }),
    )
    return disabledFlag
  }

  const isGroupChecked = (selectedGroup: string) => {
    let checkedFlag = false
    permissionSettingJSON?.groups.map((group: PermissionGroupType) =>
      Object.entries(group)
        .filter(([groupname]) => selectedGroup === groupname)
        .forEach(([, groupItem]) => {
          checkedFlag = true
          groupItem.forEach((permission: string) => {
            checkedFlag = checkedFlag && props.entry.permissions[permission]?.value === 'allow'
          })
        }),
    )
    return checkedFlag
  }

  return (
    <>
      <DialogTitle>{props.entry.identity.displayName}</DialogTitle>
      <DialogContent className={classes.contentWrapper}>
        <List
          className={clsx(classes.column, classes.leftColumn)}
          component="nav"
          aria-label={localization.permissionEditor.permissions}>
          <ListItem>
            <ListItemText primary={localization.permissionEditor.permissions} />
          </ListItem>
          <Divider />

          {permissionSettingJSON?.groups.map((group: PermissionGroupType) =>
            Object.entries(group).map(([groupname]) => {
              return (
                <ListItem
                  key={groupname}
                  button
                  className={classes.secondaryListItem}
                  onClick={() => setActualGroup(groupname)}>
                  <ListItemText disableTypography primary={groupname} />
                  <Switcher
                    checked={isGroupChecked(groupname)}
                    disabled={isGroupDisabled(groupname)}
                    size="small"
                    onClick={() => {}}
                  />
                </ListItem>
              )
            }),
          )}
          <Divider />
          <ListItem className={classes.secondaryListItem}>
            <ListItemText disableTypography primary={localization.permissionEditor.grantFullAccess} />
            <Switcher checked={true} size="small" onClick={() => {}} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={localization.permissionEditor.localOnly} />
            <Switcher checked={true} size="small" onClick={() => {}} />
          </ListItem>
        </List>
        <div className={clsx(classes.column, classes.rightColumn)}>
          <div className={classes.permissionContainer}>
            <List>
              {permissionSettingJSON?.groups.map((group: PermissionGroupType) =>
                Object.entries(group)
                  .filter(([groupname]) => actualGroup === groupname)
                  .map(([, groupItem]) => {
                    return groupItem.map((permission: string) => {
                      return (
                        <ListItem key={permission} onClick={() => {}}>
                          <ListItemText
                            disableTypography
                            primary={permission}
                            className={clsx({
                              [classes.disabled]: isPermissionDisabled(permission),
                            })}
                          />
                          <Switcher
                            checked={props.entry.permissions[permission]?.value === 'allow'}
                            disabled={isPermissionDisabled(permission)}
                            size="small"
                            onClick={() => {}}
                          />
                        </ListItem>
                      )
                    })
                  }),
              )}
            </List>
          </div>
          <DialogActions className={classes.dialogActions}>
            <Button
              aria-label={localization.forms.cancel}
              className={globalClasses.cancelButton}
              onClick={closeLastDialog}>
              {localization.forms.cancel}
            </Button>
            <Button aria-label={localization.forms.submit} color="primary" variant="contained" autoFocus={true}>
              {localization.forms.submit}
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </>
  )
}

export default PermissionEditorDialog
