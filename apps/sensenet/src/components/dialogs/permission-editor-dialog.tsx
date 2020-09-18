import { EntryType } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { Group, PermissionRequestBody, PermissionValues, Settings, User } from '@sensenet/default-content-types'
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
import { PermissionEditorMembers } from './permission-editor/permission-editor-members'
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
      minHeight: '360px',
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
  path: string | undefined
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

  const [permissionSettingJSON, setPermissionSettingJSON] = useState<PermissionSettingType>()
  const [actualGroup, setActualGroup] = useState<string>('Read')
  const [responseBody, setResponseBody] = useState<PermissionRequestBody>({ identity: props.entry.identity.path })
  const [isLocalOnly, setIsLocalOnly] = useState<boolean>(!props.entry.propagates)
  const [groupContent, setGroupContent] = useState<Group>()
  const [canEdit, setCanEdit] = useState<boolean>(false)

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
            details: { error },
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
    let permissionsFromSettings
    permissionSettingJSON?.groups.forEach((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings)
        .filter(([groupNameFromSettings]) => selectedGroup === groupNameFromSettings)
        .forEach(([, selectedGroupPermissionsFromSettings]) => {
          permissionsFromSettings = selectedGroupPermissionsFromSettings
        }),
    )
    return permissionsFromSettings || []
  }

  const isGroupDisabled = (selectedGroup: string) => {
    let disabledFlag = true

    getPermissionsFromGroupName(selectedGroup).forEach((selectedGroupPermission: string) => {
      disabledFlag = disabledFlag && isPermissionDisabled(selectedGroupPermission)
    })

    return disabledFlag
  }

  const isGroupChecked = (selectedGroup: string) => {
    let checkedFlag = true

    if (isGroupDisabled(selectedGroup)) {
      getPermissionsFromGroupName(selectedGroup).forEach((selectedGroupPermission: string) => {
        checkedFlag = checkedFlag && props.entry.permissions[selectedGroupPermission]?.value === 'allow'
      })
    } else {
      getPermissionsFromGroupName(selectedGroup).forEach((selectedGroupPermission: keyof PermissionRequestBody) => {
        checkedFlag =
          checkedFlag &&
          (responseBody[selectedGroupPermission] === undefined ||
            (responseBody[selectedGroupPermission] !== undefined &&
              responseBody[selectedGroupPermission] === PermissionValues.allow))
      })
    }

    return checkedFlag
  }

  const isFullAccessChecked = () => {
    let checkedFlag = true

    permissionSettingJSON?.groups.forEach((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings).forEach(([groupName]) => {
        checkedFlag = checkedFlag && isGroupChecked(groupName)
      }),
    )

    return checkedFlag
  }

  const isFullAccessDisabled = () => {
    let disabledFlag = true

    permissionSettingJSON?.groups.forEach((groupsFromSettings: PermissionGroupType) =>
      Object.entries(groupsFromSettings).forEach(([groupName]) => {
        disabledFlag = disabledFlag && isGroupDisabled(groupName)
      }),
    )

    return disabledFlag
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

          {permissionSettingJSON?.groups.map((groupsFromSettings: PermissionGroupType) =>
            Object.entries(groupsFromSettings).map(([groupNameFromSettings]) => {
              return (
                <ListItem
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
                permissionSettingJSON?.groups.forEach((groupsFromSettings: PermissionGroupType) =>
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
            <ListItemText primary={localization.permissionEditor.localOnly} />
            <Switcher
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
                button
                className={clsx({ [classes.selected]: actualGroup === 'Members' })}
                onClick={() => {
                  setActualGroup('Members')
                }}>
                <ListItemText primary={localization.permissionEditor.members} />
              </ListItem>
            </>
          )}
        </List>
        <div className={clsx(classes.column, classes.rightColumn)}>
          {actualGroup === 'Members' ? (
            <PermissionEditorMembers
              items={groupContent?.Members as User[]}
              parent={groupContent!}
              fieldName="Members"
              canEdit={canEdit}
            />
          ) : (
            <div className={classes.permissionContainer}>
              <List>
                {getPermissionsFromGroupName(actualGroup).map(
                  (selectedGroupPermission: keyof PermissionRequestBody) => {
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
                  },
                )}
              </List>
            </div>
          )}
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
                if (props.path) {
                  //TODO: rewrite this when it will has a return value (JSON)
                  try {
                    const localResponseBody = isLocalOnly ? { ...responseBody, localOnly: true } : responseBody
                    await repo.security.setPermissions(props.path, [localResponseBody])
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
