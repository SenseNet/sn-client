import { permissionKeys, PermissionRequestBody, PermissionValues } from '@sensenet/default-content-types'
import React from 'react'
import { PermissionSelector } from './permissionSelector'

interface selectorProps {
  groupName: string
  responseBody: PermissionRequestBody
  setResponseBody(value: React.SetStateAction<PermissionRequestBody>): void
  setForcedPermissions(
    localResponseBody: PermissionRequestBody,
    permissionNameParam: string,
    permissionValue: keyof typeof PermissionValues,
  ): void
  getGroupPermission: (groupName: string) => keyof typeof PermissionValues
  getPermissionsFromGroupName: (groupName: string) => string[]
  isGroupChecked: (selectedGroup: string) => boolean
  isGroupDisabled: (selectedGroup: string) => boolean
}

export const SetGroupPermission = (props: selectorProps) => {
  const {
    groupName,
    responseBody,
    getGroupPermission,
    getPermissionsFromGroupName,
    setForcedPermissions,
    setResponseBody,
    isGroupChecked,
  } = props

  const localResponseBody = { ...responseBody }

  const permissionStringValue = getGroupPermission(groupName)

  const isDiabled = isGroupChecked(groupName)

  const setPermission = (selectedPermission: keyof typeof PermissionValues) => {
    getPermissionsFromGroupName(groupName).forEach((selectedGroupPermission: keyof PermissionRequestBody) => {
      Object.assign(localResponseBody, {
        [selectedGroupPermission]: PermissionValues[selectedPermission],
      })
      setForcedPermissions(localResponseBody, selectedGroupPermission, selectedPermission)
    })

    setResponseBody(localResponseBody)
  }

  return (
    <PermissionSelector disabled={isDiabled} permissionValue={permissionStringValue} setPermission={setPermission} />
  )
}
