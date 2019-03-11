import Avatar, { AvatarProps } from '@material-ui/core/Avatar'
import { PathHelper } from '@sensenet/client-utils'
import { User } from '@sensenet/default-content-types'
import React, { useContext } from 'react'
import { RepositoryContext } from '../context/RepositoryContext'

export const UserAvatar: React.StatelessComponent<{
  user: User
  avatarProps?: AvatarProps
  style?: React.CSSProperties
}> = props => {
  const repo = useContext(RepositoryContext)
  const avatarUrl = props.user.Avatar && props.user.Avatar.Url
  if (avatarUrl) {
    return (
      <Avatar
        src={PathHelper.joinPaths(repo.configuration.repositoryUrl, avatarUrl)}
        {...props.avatarProps}
        style={props.style}
      />
    )
  }
  return (
    <Avatar style={props.style}>{(props.user.DisplayName && props.user.DisplayName[0]) || props.user.Name[0]}</Avatar>
  )
}
