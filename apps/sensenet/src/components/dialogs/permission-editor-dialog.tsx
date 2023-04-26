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
import { EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Switch } from '@sensenet/controls-react'
import { Group, PermissionRequestBody, PermissionValues, Settings, User } from '@sensenet/default-content-types'
import { useLogger, useRepository } from '@sensenet/hooks-react'
import { clsx } from 'clsx'
import React, { useEffect, useState } from 'react'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import {
  forcePermissionActions,
  PermissionEditorMembers,
  SetFullAccess,
  SetGroupPermission,
  SetValueForPermission,
} from './permission-editor'
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
      flex: 1.5,
    },
    dialogActions: {
      marginTop: 'auto',
      padding: '16px',
    },
    secondaryListItem: {
      paddingLeft: '35px',
    },
    secondaryTitle: {
      fontSize: '12px',
    },
    permissionContainer: {
      padding: '60px 20px',
      minHeight: '400px',
    },
    disabled: {
      color: theme.palette.grey[500],
    },
    selected: {
      backgroundColor: theme.palette.primary.main,
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
  submitCallback?: () => void
  cancelCallback?: () => void
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
  const [isLocalOnly, setIsLocalOnly] = useState<boolean>(!props.entry.propagates)
  const [groupContent, setGroupContent] = useState<Group>()
  const [canEdit, setCanEdit] = useState<boolean>(false)
  const [resetFlag, setResetFlag] = useState<boolean>(false)

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
            error,
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
  }, [props.entry.identity.path, props.entry.permissions, resetFlag])

  useEffect(() => {
    async function getMembersInfo() {
      try {
        const actions = await repo.getActions({ idOrPath: props.entry.identity.path })
        const content = await repo.load<Group>({
          idOrPath: props.entry.identity.path,
          oDataOptions: {
            select: ['Members'],
            expand: ['Members'],
          },
        })
        setGroupContent(content.d)
        const localCanEdit = actions.d.results.some((action) => action.Name === 'Edit')
        setCanEdit(localCanEdit)
      } catch (error) {
        logger.error({
          message: localization.permissionEditor.errorGetMembersInfo,
          data: {
            error,
          },
        })
      }
    }
    props.entry.identity.kind === 'group' && getMembersInfo()
  }, [localization.permissionEditor.errorGetMembersInfo, logger, props.entry, repo])

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

  const getGroupPermission = (selectedGroup: string) => {
    const allAllowed = getPermissionsFromGroupName(selectedGroup).every(
      (selectedGroupPermission: keyof PermissionRequestBody) =>
        responseBody[selectedGroupPermission] === PermissionValues.allow,
    )

    if (allAllowed) {
      return 'allow'
    }

    const allDeny = getPermissionsFromGroupName(selectedGroup).every(
      (selectedGroupPermission: keyof PermissionRequestBody) =>
        responseBody[selectedGroupPermission] === PermissionValues.deny,
    )

    if (allDeny) {
      return 'deny'
    }

    return 'undefined'
  }

  const fullAccessCheck = () => {
    const groupPermissions: string[] = []

    permissionSetting?.groups.forEach((groupsFromSettings: PermissionGroupType) => {
      Object.entries(groupsFromSettings).forEach(([groupName]) => {
        groupPermissions.push(getGroupPermission(groupName))
      })
    })

    const allAllowed = groupPermissions.every(
      (selectedGroupPermission: keyof typeof PermissionValues) => selectedGroupPermission === 'allow',
    )

    if (allAllowed) {
      return 'allow'
    }

    const allDeny = groupPermissions.every(
      (selectedGroupPermission: keyof typeof PermissionValues) => selectedGroupPermission === 'deny',
    )

    if (allDeny) {
      return 'deny'
    }

    return 'undefined'
  }

  const isFullAccessDisabled = () => {
    return !!permissionSetting?.groups.every((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings).every(([groupName]) => isGroupDisabled(groupName)),
    )
  }

  /**
   * Enable permissions required for the permission specified in the parameter and saved to localResponseBody
   * @param localResponseBody The local copy of the actual permission request body.
   * @param permissionNameParam Permission, for which we examine the required permissions
   */

  const setForcedPermissionsToAllowed = (localResponseBody: PermissionRequestBody, permissionNameParam: string) => {
    forcePermissionActions.forEach((forcePermObject) => {
      Object.entries(forcePermObject).forEach(([permissionName, forcedPermissions]) => {
        if (permissionName === permissionNameParam && forcedPermissions && forcedPermissions.length > 0) {
          forcedPermissions.forEach((forcedPermission: keyof PermissionRequestBody) => {
            Object.assign(localResponseBody, { [forcedPermission]: PermissionValues.allow })
            setForcedPermissionsToAllowed(localResponseBody, forcedPermission)
          })
        }
      })
    })
  }

  /**
   * Disable permissions for which the permission specified in the parameter is a condition and saved to localResponseBody
   * @param localResponseBody The local copy of the actual permission request body.
   * @param permissionNameParam Permission, which we examine as a condition for other permissions.
   * @param permissionValue The value of the permission to be set Allow|Deny .
   */

  const setForcedPermissionsToUndefinedOrDeny = (
    localResponseBody: PermissionRequestBody,
    permissionNameParam: string,
    permissionValue: 'deny' | 'undefined',
  ) => {
    forcePermissionActions.forEach((forcePermObject) => {
      Object.entries(forcePermObject).forEach(([permissionName, forcedPermissions]) => {
        if (forcedPermissions.includes(permissionNameParam)) {
          Object.assign(localResponseBody, { [permissionName]: PermissionValues[permissionValue] })
          setForcedPermissionsToUndefinedOrDeny(localResponseBody, permissionName, permissionValue)
        }
      })
    })
  }

  const setForcedPermissions = (
    localResponseBody: PermissionRequestBody,
    permissionNameParam: string,
    permissionValue: keyof typeof PermissionValues,
  ) => {
    if (permissionValue === 'allow') {
      setForcedPermissionsToAllowed(localResponseBody, permissionNameParam)
      return
    }

    setForcedPermissionsToUndefinedOrDeny(localResponseBody, permissionNameParam, permissionValue)
  }

  return (
    <>
      <DialogTitle data-test={'permission-dialog-title'}>
        <div>{props.entry.identity.displayName}</div>
        <div className={classes.secondaryTitle}>{props.entry.identity.path}</div>
      </DialogTitle>
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
                  data-test={`permission-group-${groupNameFromSettings.replace(/\s+/g, '-').toLowerCase()}`}
                  key={groupNameFromSettings}
                  button
                  className={clsx(classes.secondaryListItem, {
                    [classes.selected]: actualGroup === groupNameFromSettings,
                  })}
                  onClick={() => setActualGroup(groupNameFromSettings)}>
                  <ListItemText
                    disableTypography
                    primary={groupNameFromSettings}
                    className={clsx({
                      [classes.disabled]: isGroupDisabled(groupNameFromSettings),
                    })}
                  />
                  <SetGroupPermission
                    setResponseBody={setResponseBody}
                    setForcedPermissions={setForcedPermissions}
                    responseBody={responseBody}
                    groupName={groupNameFromSettings}
                    getGroupPermission={getGroupPermission}
                    getPermissionsFromGroupName={getPermissionsFromGroupName}
                    isGroupDisabled={isGroupDisabled}
                  />
                </ListItem>
              )
            }),
          )}
          <Divider />
          <ListItem>
            <ListItemText
              disableTypography
              primary={localization.permissionEditor.fullAccess}
              className={clsx({
                [classes.disabled]: isFullAccessDisabled(),
              })}
            />

            <SetFullAccess
              setResponseBody={setResponseBody}
              setForcedPermissions={setForcedPermissions}
              responseBody={responseBody}
              getPermissionsFromGroupName={getPermissionsFromGroupName}
              fullAccessCheck={fullAccessCheck}
              permissionSettingGroups={permissionSetting?.groups}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary={localization.permissionEditor.localOnly} />
            <Switch
              data-test="switcher-local-only"
              checked={isLocalOnly}
              size="small"
              onClick={() => {
                setIsLocalOnly(!isLocalOnly)
              }}
            />
          </ListItem>
          {props.entry.identity.kind === 'group' && (
            <>
              <Divider />
              <ListItem
                data-test={'members-tab'}
                button
                className={clsx({ [classes.selected]: actualGroup === 'Members' })}
                onClick={() => {
                  setActualGroup('Members')
                }}>
                <ListItemText primary={localization.permissionEditor.members} />
              </ListItem>
            </>
          )}
          <Divider />
          <ListItem button onClick={() => setResetFlag(!resetFlag)}>
            <ListItemText primary={localization.permissionEditor.reset} />
          </ListItem>
          <Divider />
        </List>
        <div className={clsx(classes.column, classes.rightColumn)}>
          {actualGroup === 'Members' ? (
            groupContent && (
              <PermissionEditorMembers
                items={groupContent.Members as User[]}
                parent={groupContent}
                fieldName="Members"
                canEdit={canEdit}
              />
            )
          ) : (
            <List className={classes.permissionContainer}>
              {getPermissionsFromGroupName(actualGroup).map((selectedGroupPermission: keyof PermissionRequestBody) => {
                return (
                  <ListItem
                    data-test={`permission-item-${selectedGroupPermission.replace(/\s+/g, '-').toLowerCase()}`}
                    key={selectedGroupPermission}>
                    <ListItemText
                      disableTypography
                      primary={selectedGroupPermission}
                      className={clsx({
                        [classes.disabled]: isPermissionDisabled(selectedGroupPermission),
                      })}
                    />
                    <SetValueForPermission
                      setForcedPermissions={setForcedPermissions}
                      responseBody={responseBody}
                      permisssionName={selectedGroupPermission}
                      setResponseBody={setResponseBody}
                    />
                  </ListItem>
                )
              })}
            </List>
          )}
          <DialogActions className={classes.dialogActions}>
            <Button
              data-test="permission-editor-cancel"
              aria-label={localization.forms.cancel}
              className={globalClasses.cancelButton}
              onClick={() => {
                closeLastDialog()
                props.cancelCallback?.()
              }}>
              {localization.forms.cancel}
            </Button>
            <Button
              data-test="permission-editor-submit"
              aria-label={localization.forms.submit}
              color="primary"
              variant="contained"
              autoFocus={true}
              onClick={async () => {
                try {
                  const localResponseBody = isLocalOnly ? { ...responseBody, localOnly: true } : responseBody
                  await repo.security.setPermissions(props.path, [localResponseBody])
                } catch (error) {
                  logger.error({
                    message: error.message,
                    data: {
                      error,
                    },
                  })
                  return false
                } finally {
                  props.submitCallback?.()
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
