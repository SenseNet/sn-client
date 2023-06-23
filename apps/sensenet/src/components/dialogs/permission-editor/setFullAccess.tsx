import { PermissionRequestBody, PermissionValues } from '@sensenet/default-content-types'
import React from 'react'
import { PermissionGroupType } from '../permission-editor-dialog'
import { PermissionSelector } from './permissionSelector'

interface selectorProps {
  responseBody: PermissionRequestBody
  setResponseBody(value: React.SetStateAction<PermissionRequestBody>): void
  setForcedPermissions(
    localResponseBody: PermissionRequestBody,
    permissionNameParam: string,
    permissionValue: keyof typeof PermissionValues,
  ): void
  fullAccessCheck: () => keyof typeof PermissionValues
  permissionSettingGroups: PermissionGroupType[] | undefined
  getPermissionsFromGroupName: (groupName: string) => string[]
}

export const SetFullAccess = (props: selectorProps) => {
  const {
    responseBody,
    setForcedPermissions,
    setResponseBody,
    fullAccessCheck,
    getPermissionsFromGroupName,
    permissionSettingGroups,
  } = props

  const localResponseBody = { ...responseBody }

  const permissionStringValue = fullAccessCheck()

  const isDiabled = false

  // console.log(localResponseBody)

  const setPermission = (selectedPermission: keyof typeof PermissionValues) => {
    permissionSettingGroups?.forEach((groupsFromSettings: PermissionGroupType) => {
      Object.entries(groupsFromSettings).forEach(([groupName]) => {
        getPermissionsFromGroupName(groupName).forEach((selectedGroupPermission: keyof PermissionRequestBody) => {
          Object.assign(localResponseBody, {
            [selectedGroupPermission]: PermissionValues[selectedPermission],
          })
          setForcedPermissions(localResponseBody, selectedGroupPermission, selectedPermission)
        })
      })
    })

    setResponseBody(localResponseBody)
  }

  return (
    <PermissionSelector disabled={isDiabled} permissionValue={permissionStringValue} setPermission={setPermission} />
  )
}
