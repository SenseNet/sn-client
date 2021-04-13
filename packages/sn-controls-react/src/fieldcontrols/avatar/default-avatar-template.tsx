import { GenericContent } from '@sensenet/default-content-types'
import { Avatar, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction } from '@material-ui/core'
import React from 'react'

const styles = {
  listItem: {
    listStyleType: 'none',
  },
  avatar: {
    width: 60,
    height: 60,
  },
}

const ADD_AVATAR = 'Add avatar'
const CHANGE_AVATAR = 'Change avatar'
const REMOVE_AVATAR = 'Remove avatar'

export interface DefaultAvatarTemplateProps {
  repositoryUrl?: string
  add?: () => void
  url?: GenericContent
  content?: GenericContent
  remove?: () => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  renderIcon: (name: string) => JSX.Element
}

/**
 * Represents a default component for Avatar control.
 */
export const DefaultAvatarTemplate: React.FC<DefaultAvatarTemplateProps> = (props) => {
  const { actionName, readOnly, repositoryUrl, url } = props
  return (
    <ListItem button={true} style={styles.listItem}>
      <ListItemAvatar>
        <Avatar src={repositoryUrl && url ? `${repositoryUrl}${url}` : undefined} style={styles.avatar} />
      </ListItemAvatar>
      {actionName && actionName !== 'browse' && !readOnly ? (
        <ListItemSecondaryAction>
          {url ? (
            <div>
              <IconButton title={CHANGE_AVATAR} onClick={props.add}>
                {props.renderIcon('refresh')}
              </IconButton>
              <IconButton title={REMOVE_AVATAR} onClick={() => props.remove?.()}>
                {props.renderIcon('remove_circle')}
              </IconButton>
            </div>
          ) : (
            <IconButton title={ADD_AVATAR} onClick={props.add}>
              {props.renderIcon('add')}
            </IconButton>
          )}
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  )
}
