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
import { PathHelper } from '@sensenet/client-utils'
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

  const renderIcon = (item: GenericContent | User | Image) => {
    if (repository?.schemas.isContentFromType<User>(item, 'User')) {
      const avatarUrl = item.Avatar?.Url
      if (avatarUrl) {
        return (
          <ListItemAvatar>
            {
              <Avatar
                alt={item.FullName}
                src={
                  avatarUrl && repository?.configuration.repositoryUrl
                    ? `${repository.configuration.repositoryUrl}${avatarUrl}`
                    : ''
                }
              />
            }
          </ListItemAvatar>
        )
      }

      return (
        <ListItemAvatar>
          <Avatar alt={item.DisplayName}>
            {item.DisplayName?.split(' ')
              .map((namePart) => namePart[0])
              .join('.')}
          </Avatar>
        </ListItemAvatar>
      )
    }

    if (repository?.schemas.isContentFromType<Image>(item, 'Image') && (!item.PageCount || item.PageCount <= 0)) {
      return (
        <ListItemAvatar>
          <img
            data-test="reference-selection-image"
            alt={item.DisplayName}
            src={`${repository?.configuration.repositoryUrl}${item.Path}`}
            style={{ width: '3em', height: '3em', objectFit: 'scale-down' }}
          />
        </ListItemAvatar>
      )
    }

    if (repository?.schemas.isContentFromType<Image>(item, 'Image') && item.PageCount && item.PageCount > 0) {
      return (
        <ListItemAvatar>
          <img
            data-test="reference-selection-image"
            alt={item.DisplayName}
            src={PathHelper.joinPaths(
              repository?.configuration.repositoryUrl,
              item.Path,
              '/Previews',
              item.Version as string,
              'thumbnail1.png',
            )}
            style={{ width: '3em', height: '3em', objectFit: 'scale-down' }}
          />
        </ListItemAvatar>
      )
    }

    return (
      <ListItemIcon style={{ marginRight: 0 }}>
        <Icon>
          <InsertDriveFile />
        </Icon>
      </ListItemIcon>
    )
  }

  return (
    <ListItem key={content.Id} button={false}>
      {content.Type ? renderIcon(content) : null}
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
