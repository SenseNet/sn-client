import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import AddCircle from '@material-ui/icons/AddCircle'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import Refresh from '@material-ui/icons/Refresh'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'

const styles = {
  icon: {
    marginRight: 0,
  },
}

interface DefaultItemTemplateProps {
  content: GenericContent
  remove?: (id: number) => void
  add: () => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  repositoryUrl: string
  multiple: boolean
}

export class DefaultItemTemplate extends Component<DefaultItemTemplateProps, {}> {
  public handlRemoveIconClick = (id: number) => {
    if (this.props.remove) {
      this.props.remove(id)
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
    const { content, repositoryUrl } = this.props
    return (
      <ListItem key={content.Id} button={false}>
        {content.Type !== undefined ? (
          content.Type === 'User' ? (
            <ListItemAvatar>
              {
                // tslint:disable-next-line: no-string-literal
                <Avatar alt={content['FullName']} src={`${repositoryUrl}${content['Avatar'].Url}`} />
              }
            </ListItemAvatar>
          ) : (
            <ListItemIcon style={styles.icon}>
              <Icon>
                <InsertDriveFile />
              </Icon>
            </ListItemIcon>
          )
        ) : null}
        <ListItemText
          primary={content.DisplayName}
          style={content.Id < 0 ? { textAlign: 'right' } : { textAlign: 'left' }}
        />
        {this.props.actionName && this.props.actionName !== 'browse' && !this.props.readOnly ? (
          <ListItemSecondaryAction>
            {content ? (
              content.Id > 0 && this.props.multiple ? (
                <IconButton onClick={() => this.handlRemoveIconClick(content.Id)}>
                  <RemoveCircle />
                </IconButton>
              ) : content.Id === -1 ? (
                <IconButton onClick={() => this.handleAddIconClick()}>
                  <AddCircle />
                </IconButton>
              ) : (
                <IconButton onClick={() => this.handleAddIconClick()}>
                  <Refresh />
                </IconButton>
              )
            ) : null}
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    )
  }
}
