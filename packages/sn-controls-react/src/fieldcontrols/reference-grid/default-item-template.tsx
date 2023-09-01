import {
  Avatar,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core'
import { InsertDriveFile } from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { GenericContent, Image, User } from '@sensenet/default-content-types'
import React from 'react'
import { renderIconDefault } from '../icon'

interface DefaultItemTemplateProps {
  content: GenericContent
  remove?: (id: number) => void
  add: () => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  repository?: Repository
  multiple: boolean
  renderIcon?: (name: string) => JSX.Element
}

/**
 * Represents a default renderer for reference grid row
 */
export const DefaultItemTemplate: React.FC<DefaultItemTemplateProps> = (props) => {
  const { content, repository } = props
  return (
    <ListItem key={content.Id} button={false}>
      {content.Type ? (
        repository?.schemas.isContentFromType<User>(content, 'User') ? (
          <ListItemAvatar>
            {
              <Avatar
                alt={content.FullName}
                src={
                  content.Avatar?.Url && repository?.configuration.repositoryUrl
                    ? `${repository.configuration.repositoryUrl}${content.Avatar.Url}`
                    : ''
                }
              />
            }
          </ListItemAvatar>
        ) : repository?.schemas.isContentFromType<Image>(content, 'Image') ? (
          <ListItemAvatar>
            {
              <img
                alt={content.DisplayName}
                src={`${repository?.configuration.repositoryUrl}${(content as Image).Path}`}
                style={{ width: '3em', height: '3em' }}
              />
            }
          </ListItemAvatar>
        ) : (
          <ListItemIcon style={{ marginRight: 0 }}>
            <Icon>
              <InsertDriveFile />
            </Icon>
          </ListItemIcon>
        )
      ) : null}
      <ListItemText
        primary={content.DisplayName}
        style={content.Id < 0 ? { textAlign: 'right', paddingRight: 16 } : { textAlign: 'left' }}
      />
      {props.actionName && props.actionName !== 'browse' && !props.readOnly ? (
        <ListItemSecondaryAction>
          {content.Id > 0 ? (
            <IconButton onClick={() => props.remove?.(content.Id)}>
              {props.renderIcon ? props.renderIcon('remove_circle') : renderIconDefault('remove_circle')}
            </IconButton>
          ) : (
            <IconButton onClick={() => props.add()}>
              {props.renderIcon
                ? props.renderIcon(content.Id === -1 ? 'add_circle' : 'refresh')
                : renderIconDefault(content.Id === -1 ? 'add_circle' : 'refresh')}
            </IconButton>
          )}
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  )
}
