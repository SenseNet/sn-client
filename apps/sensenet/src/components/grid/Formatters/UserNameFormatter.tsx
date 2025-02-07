import { User } from '@sensenet/default-content-types'
import React from 'react'
import { SimpleContentProps } from '../Props/SimpleContentProps'

export function UserNameFormatter(props: SimpleContentProps) {
  function IsUserExists(user: any) {
    if ((user as User).Domain === undefined || (user as User).LoginName === undefined) {
      return false
    }
    return true
  }
  function GetUserName(user: any) {
    if ((user as User).Domain === undefined || (user as User).LoginName === undefined) {
      return 'Somebody'
    }
    return `${(user as User).Domain}\\${(user as User).LoginName}`
  }
  function GetEditLink(user: any) {
    return `/users-and-groups/explorer/edit?content=${(user as User).Path?.replace('/Root/IMS', '')}`
  }
  if (IsUserExists(props.value)) {
    return (
      <a href={GetEditLink(props.value)} title={`Open ${props.value?.Path} for Edit`} target="_blank" rel="noreferrer">
        {GetUserName(props.value)}
      </a>
    )
  } else {
    return <span>{GetUserName(props.value)}</span>
  }
}
