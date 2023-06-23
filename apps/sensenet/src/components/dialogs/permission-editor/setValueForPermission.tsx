import { permissionKeys, PermissionRequestBody, PermissionValues } from '@sensenet/default-content-types'
import React from 'react'
import { PermissionSelector } from './permissionSelector'

interface selectorProps {
  permisssionName: keyof PermissionRequestBody
  responseBody: PermissionRequestBody
  setForcedPermissions(
    localResponseBody: PermissionRequestBody,
    permissionNameParam: string,
    permissionValue: keyof typeof PermissionValues,
  ): void
  setResponseBody(value: React.SetStateAction<PermissionRequestBody>): void
}

export const SetValueForPermission = (props: selectorProps) => {
  const { permisssionName, responseBody, setForcedPermissions, setResponseBody } = props

  const localResponseBody = { ...responseBody }

  const selectedGroupValue = responseBody[permisssionName] as keyof typeof permissionKeys

  const permissionStringValue = permissionKeys[selectedGroupValue] as keyof typeof PermissionValues

  const setPermission = (selectedPermission: keyof typeof PermissionValues) => {
    Object.assign(localResponseBody, {
      [permisssionName]: PermissionValues[selectedPermission],
    })
    setForcedPermissions(localResponseBody, permisssionName, selectedPermission)
    setResponseBody(localResponseBody)
  }

  const isDiabled = typeof responseBody[permisssionName] === 'undefined'

  return (
    <PermissionSelector disabled={isDiabled} permissionValue={permissionStringValue} setPermission={setPermission} />
  )
}
