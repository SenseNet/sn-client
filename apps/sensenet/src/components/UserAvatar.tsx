import { PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import React from 'react'

export const UserAvatar: React.FC<{
  user: User
  avatarProps?: AvatarProps
  style?: React.CSSProperties
  repositoryUrl: string
}> = (props) => {
  const avatarUrl = props.user.Avatar?.Url
  if (avatarUrl) {
    return (
      <Avatar src={PathHelper.joinPaths(props.repositoryUrl, avatarUrl)} {...props.avatarProps} style={props.style} />
    )
  }
  return (
    <Avatar style={props.style}>
      {(props.user.DisplayName && props.user.DisplayName[0]) || (props.user.Name && props.user.Name[0]) || 'U'}
    </Avatar>
  )
}
