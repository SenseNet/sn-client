/* eslint-disable dot-notation */
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
import React, { Component } from 'react'
import { renderIconDefault } from '../icon'

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
  renderIcon?: (name: string) => JSX.Element
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
        {content.Type ? (
          content.Type === 'User' ? (
            <ListItemAvatar>
              {<Avatar alt={content['FullName']} src={`${repositoryUrl}${content['Avatar'].Url}`} />}
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
                  {this.props.renderIcon ? this.props.renderIcon('remove_circle') : renderIconDefault('remove_circle')}
                </IconButton>
              ) : content.Id === -1 ? (
                <IconButton onClick={() => this.handleAddIconClick()}>
                  {this.props.renderIcon ? this.props.renderIcon('add_circle') : renderIconDefault('add_circle')}
                </IconButton>
              ) : (
                <IconButton onClick={() => this.handleAddIconClick()}>
                  {this.props.renderIcon ? this.props.renderIcon('refresh') : renderIconDefault('refresh')}
                </IconButton>
              )
            ) : null}
          </ListItemSecondaryAction>
        ) : null}
      </ListItem>
    )
  }
}
