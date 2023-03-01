import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import React, { CSSProperties, FC } from 'react'

export const UserAvatar: FC<{
  user: User
  avatarProps?: AvatarProps
  style?: CSSProperties
  repositoryUrl: string
}> = (props) => {
  const avatarUrl = props.user.Avatar?.Url
  if (avatarUrl) {
    return (
      <Avatar
        src={PathHelper.joinPaths(props.repositoryUrl, avatarUrl)}
        alt={props.user.DisplayName}
        {...props.avatarProps}
        style={props.style}
      />
    )
  }
  return (
    <Avatar style={props.style}>
      {(props.user.DisplayName && props.user.DisplayName[0]) || (props.user.Name && props.user.Name[0]) || 'U'}
    </Avatar>
  )
}
