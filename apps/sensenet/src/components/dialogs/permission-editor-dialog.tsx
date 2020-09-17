import { EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { PermissionRequestBody, PermissionValues, Settings } from '@sensenet/default-content-types'
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

export interface PermissionGroupType {
  /* Permission elements */
  groupObject: { [permissionName: string]: string[] }
}

export interface PermissionSettingType {
  /* Groups of permissions */
  groups: PermissionGroupType[]
}

export type PermissionEditorDialogProps = {
  path: string
  entry: EntryType
  callBackFunction?: () => void
}

const PERMISSION_SETTING_PATH = '/Root/System/Settings/Permission.settings'

export function PermissionEditorDialog(props: PermissionEditorDialogProps) {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  const repo = useRepository()
  const logger = useLogger('permissionEditorDialog')
  const localization = useLocalization()
  const { closeLastDialog } = useDialog()

  const [permissionSetting, setPermissionSetting] = useState<PermissionSettingType>()
  const [actualGroup, setActualGroup] = useState<string>('Read')
  const [responseBody, setResponseBody] = useState<PermissionRequestBody>({ identity: props.entry.identity.path })

  useEffect(() => {
    async function getPermissionSettingJSON() {
      try {
        const result = await repo.load<Settings>({
          idOrPath: PERMISSION_SETTING_PATH,
        })

        const binaryPath = result.d.Binary?.__mediaresource.media_src
        if (!binaryPath) {
          return
        }
        const textFile = await repo.fetch(PathHelper.joinPaths(repo.configuration.repositoryUrl, binaryPath))
        if (textFile.ok) {
          const setting = await textFile.json()
          setPermissionSetting(setting)
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

  useEffect(() => {
    const localResponseBody = { identity: props.entry.identity.path }
    Object.entries(props.entry.permissions).forEach(([permissionFromAcl, permissionValueFromAcl]) => {
      if (permissionValueFromAcl !== null) {
        permissionValueFromAcl.from === null &&
          Object.assign(localResponseBody, {
            [permissionFromAcl]:
              permissionValueFromAcl.value === 'allow'
                ? PermissionValues.allow
                : permissionValueFromAcl.value === 'deny'
                ? PermissionValues.deny
                : PermissionValues.undefined,
          })
      } else {
        Object.assign(localResponseBody, { [permissionFromAcl]: PermissionValues.undefined })
      }
    })
    setResponseBody(localResponseBody)
  }, [props.entry.identity.path, props.entry.permissions])

  const isPermissionDisabled = (permission: string) => {
    return (
      props.entry.permissions[permission] !== null &&
      props.entry.permissions[permission] !== undefined &&
      props.entry.permissions[permission]?.from !== null
    )
  }

  const getPermissionsFromGroupName = (selectedGroup: string): string[] => {
    return (
      permissionSetting?.groups.reduce(
        (permissionsFromSettings, groupsFromSettings: PermissionGroupType) =>
          Object.entries(groupsFromSettings).find(
            ([groupNameFromSettings]) => selectedGroup === groupNameFromSettings,
          )?.[1] || permissionsFromSettings,
        [],
      ) || []
    )
  }

  const isGroupDisabled = (selectedGroup: string) => {
    return !!getPermissionsFromGroupName(selectedGroup).every((selectedGroupPermission: string) =>
      isPermissionDisabled(selectedGroupPermission),
    )
  }

  const isGroupChecked = (selectedGroup: string) => {
    return isGroupDisabled(selectedGroup)
      ? !!getPermissionsFromGroupName(selectedGroup).every(
          (selectedGroupPermission: string) => props.entry.permissions[selectedGroupPermission]?.value === 'allow',
        )
      : !!getPermissionsFromGroupName(selectedGroup).every(
          (selectedGroupPermission: keyof PermissionRequestBody) =>
            responseBody[selectedGroupPermission] === undefined ||
            (responseBody[selectedGroupPermission] !== undefined &&
              responseBody[selectedGroupPermission] === PermissionValues.allow),
        )
  }

  const isFullAccessChecked = () => {
    return !!permissionSetting?.groups.every((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings).every(([groupName]) => isGroupChecked(groupName)),
    )
  }

  const isFullAccessDisabled = () => {
    return !!permissionSetting?.groups.every((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings).every(([groupName]) => isGroupDisabled(groupName)),
    )
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

          {permissionSetting?.groups.map((groupsFromSettings: PermissionGroupType) =>
            Object.entries(groupsFromSettings).map(([groupNameFromSettings]) => {
              return (
                <ListItem
                  key={groupNameFromSettings}
                  button
                  className={classes.secondaryListItem}
                  onClick={() => setActualGroup(groupNameFromSettings)}>
                  <ListItemText
                    disableTypography
                    primary={groupNameFromSettings}
                    className={clsx({
                      [classes.disabled]: isGroupDisabled(groupNameFromSettings),
                    })}
                  />
                  <Switcher
                    checked={isGroupChecked(groupNameFromSettings)}
                    disabled={isGroupDisabled(groupNameFromSettings)}
                    size="small"
                    onClick={() => {
                      const localResponseBody = { ...responseBody }
                      getPermissionsFromGroupName(groupNameFromSettings).forEach(
                        (selectedGroupPermission: keyof PermissionRequestBody) => {
                          if (responseBody[selectedGroupPermission] !== undefined) {
                            if (isGroupChecked(groupNameFromSettings)) {
                              Object.assign(localResponseBody, {
                                [selectedGroupPermission]: PermissionValues.undefined,
                              })
                            } else {
                              Object.assign(localResponseBody, {
                                [selectedGroupPermission]: PermissionValues.allow,
                              })
                            }
                          }
                        },
                      )
                      setResponseBody(localResponseBody)
                    }}
                  />
                </ListItem>
              )
            }),
          )}
          <Divider />
          <ListItem className={classes.secondaryListItem}>
            <ListItemText
              disableTypography
              primary={localization.permissionEditor.grantFullAccess}
              className={clsx({
                [classes.disabled]: isFullAccessDisabled(),
              })}
            />
            <Switcher
              checked={isFullAccessChecked()}
              disabled={isFullAccessDisabled()}
              size="small"
              onClick={() => {
                const localResponseBody = { ...responseBody }
                permissionSetting?.groups.forEach((groupsFromSettings: PermissionGroupType) =>
                  Object.entries(groupsFromSettings).forEach(([groupName]) => {
                    getPermissionsFromGroupName(groupName).forEach(
                      (selectedGroupPermission: keyof PermissionRequestBody) => {
                        if (responseBody[selectedGroupPermission] !== undefined) {
                          if (isFullAccessChecked()) {
                            Object.assign(localResponseBody, {
                              [selectedGroupPermission]: PermissionValues.undefined,
                            })
                          } else {
                            Object.assign(localResponseBody, {
                              [selectedGroupPermission]: PermissionValues.allow,
                            })
                          }
                        }
                      },
                    )
                  }),
                )

                setResponseBody(localResponseBody)
              }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={localization.permissionEditor.localOnly} className={classes.disabled} />
            <Switcher checked={false} size="small" disabled onClick={() => {}} />
          </ListItem>
        </List>
        <div className={clsx(classes.column, classes.rightColumn)}>
          <List className={classes.permissionContainer}>
            {getPermissionsFromGroupName(actualGroup).map((selectedGroupPermission: keyof PermissionRequestBody) => {
              return (
                <ListItem key={selectedGroupPermission} onClick={() => {}}>
                  <ListItemText
                    disableTypography
                    primary={selectedGroupPermission}
                    className={clsx({
                      [classes.disabled]: isPermissionDisabled(selectedGroupPermission),
                    })}
                  />
                  <Switcher
                    checked={
                      (responseBody[selectedGroupPermission] !== undefined &&
                        responseBody[selectedGroupPermission] === PermissionValues.allow) ||
                      (responseBody[selectedGroupPermission] === undefined &&
                        props.entry.permissions[selectedGroupPermission]?.value === 'allow')
                    }
                    disabled={isPermissionDisabled(selectedGroupPermission)}
                    size="small"
                    onClick={() => {
                      const localResponseBody = { ...responseBody }
                      if (responseBody[selectedGroupPermission] === PermissionValues.allow) {
                        Object.assign(localResponseBody, {
                          [selectedGroupPermission]: PermissionValues.undefined,
                        })
                      } else {
                        Object.assign(localResponseBody, {
                          [selectedGroupPermission]: PermissionValues.allow,
                        })
                      }
                      setResponseBody(localResponseBody)
                    }}
                  />
                </ListItem>
              )
            })}
          </List>
          <DialogActions className={classes.dialogActions}>
            <Button
              aria-label={localization.forms.cancel}
              className={globalClasses.cancelButton}
              onClick={closeLastDialog}>
              {localization.forms.cancel}
            </Button>
            <Button
              aria-label={localization.forms.submit}
              color="primary"
              variant="contained"
              autoFocus={true}
              onClick={async () => {
                try {
                  await repo.security.setPermissions(props.path, [responseBody])
                } catch (error) {
                  logger.error({
                    message: error.message,
                    data: {
                      details: { error },
                    },
                  })
                  return false
                } finally {
                  props.callBackFunction?.()
                  closeLastDialog()
                }
              }}>
              {localization.forms.submit}
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </>
  )
}

export default PermissionEditorDialog
