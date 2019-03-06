import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import React from 'react'

export const UserAvatar: React.StatelessComponent<{
  user: User
  repositoryUrl: string
  avatarProps?: AvatarProps
  style?: React.CSSProperties
}> = props => {
  const { user, repositoryUrl, avatarProps } = props
  const avatarUrl = user.Avatar && user.Avatar.Url
  if (avatarUrl) {
    return <Avatar src={PathHelper.joinPaths(repositoryUrl, avatarUrl)} {...avatarProps} style={props.style} />
  }
  return <Avatar style={props.style}>{(user.DisplayName && user.DisplayName[0]) || user.Name[0]}</Avatar>
}
