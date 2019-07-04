import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
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

const DEFAULT_AVATAR_PATH = '/demoavatars/Admin.png'
const ADD_AVATAR = 'Add avatar'
const CHANGE_AVATAR = 'Change avatar'
const REMOVE_AVATAR = 'Remove avatar'

interface DefaultAvatarTemplateProps {
  repositoryUrl: string
  add: () => void
  url?: string
  remove?: (url: string) => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  renderIcon: (name: string) => JSX.Element
}

/**
 * Represents a default component for Avatar control.
 */
export function DefaultAvatarTemplate(props: DefaultAvatarTemplateProps) {
  const handlRemoveIconClick = (url: string) => () => {
    if (props.remove) {
      props.remove(url)
    }
  }
  const { actionName, readOnly, repositoryUrl, url } = props
  return (
    <ListItem button={true} style={styles.listItem}>
      <ListItemAvatar>
        {
          <Avatar
            src={url ? `${repositoryUrl}${url}` : `${repositoryUrl}${DEFAULT_AVATAR_PATH}`}
            style={styles.avatar}
          />
        }
      </ListItemAvatar>
      {actionName && actionName !== 'browse' && !readOnly ? (
        <ListItemSecondaryAction>
          {url ? (
            <div>
              <IconButton title={CHANGE_AVATAR} onClick={props.add}>
                {props.renderIcon('refresh')}
              </IconButton>
              <IconButton title={REMOVE_AVATAR} onClick={handlRemoveIconClick(url)}>
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
