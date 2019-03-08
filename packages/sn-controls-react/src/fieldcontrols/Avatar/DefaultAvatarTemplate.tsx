import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import AddCircle from '@material-ui/icons/AddCircle'
import Refresh from '@material-ui/icons/Refresh'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import React, { Component } from 'react'

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
}

export class DefaultAvatarTemplate extends Component<DefaultAvatarTemplateProps, {}> {
  public handlRemoveIconClick = (url: string) => {
    if (this.props.remove) {
      this.props.remove(url)
    }
  }
  public handleAddIconClick = () => {
    this.props.add()
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const { url } = this.props
    return (
      <ListItem button={true} style={styles.listItem}>
        <ListItemAvatar>
          {
            // tslint:disable-next-line: no-string-literal
            <Avatar
              src={url ? `${this.props.repositoryUrl}${url}` : `${this.props.repositoryUrl}${DEFAULT_AVATAR_PATH}`}
              style={styles.avatar}
            />
          }
        </ListItemAvatar>
        {this.props.actionName && this.props.actionName !== 'browse' && !this.props.readOnly ? (
          <ListItemSecondaryAction>
            {url ? (
              <div>
                <IconButton title={CHANGE_AVATAR} onClick={() => this.handleAddIconClick()}>
                  <Refresh />
                </IconButton>
                <IconButton title={REMOVE_AVATAR} onClick={() => this.handlRemoveIconClick(url)}>
                  <RemoveCircle />
                </IconButton>
              </div>
            ) : (
              <IconButton title={ADD_AVATAR} onClick={() => this.handleAddIconClick()}>
                <AddCircle />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    )
  }
}
