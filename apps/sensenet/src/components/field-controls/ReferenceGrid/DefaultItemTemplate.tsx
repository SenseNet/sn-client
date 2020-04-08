import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import { GenericContent } from '@sensenet/default-content-types'
import React from 'react'
import { renderIconDefault } from '../icon'
import { isUser } from '../type-guards'

interface DefaultItemTemplateProps {
  content: GenericContent
  remove?: (id: number) => void
  add: () => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  repositoryUrl?: string
  multiple: boolean
  renderIcon?: (name: string) => JSX.Element
}

/**
 * Represents a default renderer for reference grid row
 */
export const DefaultItemTemplate: React.FC<DefaultItemTemplateProps> = (props) => {
  const { content, repositoryUrl } = props
  return (
    <ListItem key={content.Id} button={false}>
      {content.Type ? (
        isUser(content) ? (
          <ListItemAvatar>
            {
              <Avatar
                alt={content.FullName}
                src={
                  content.Avatar && content.Avatar.Url && repositoryUrl ? `${repositoryUrl}${content.Avatar.Url}` : ''
                }
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
          {content ? (
            content.Id > 0 && props.multiple ? (
              <IconButton onClick={() => props.remove && props.remove(content.Id)}>
                {props.renderIcon ? props.renderIcon('remove_circle') : renderIconDefault('remove_circle')}
              </IconButton>
            ) : (
              <IconButton onClick={() => props.add()}>
                {props.renderIcon
                  ? props.renderIcon(content.Id === -1 ? 'add_circle' : 'refresh')
                  : renderIconDefault(content.Id === -1 ? 'add_circle' : 'refresh')}
              </IconButton>
            )
          ) : null}
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  )
}
