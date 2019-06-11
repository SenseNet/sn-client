import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import { UploadProgressInfo } from '@sensenet/client-core'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { ExtendedUploadProgressInfo } from '../../Actions'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import theme from '../../assets/theme'

export interface UploadBarItemProps {
  item: ExtendedUploadProgressInfo
  isMobile: boolean
  handleSelectItem?: (item: UploadProgressInfo) => void
  remove: (item: UploadProgressInfo) => void
}

export interface UploadBarItemState {
  icon: string
  displayName: string
  percent: number
  isLoading: boolean
}

export class UploadBarItem extends React.Component<UploadBarItemProps, UploadBarItemState> {
  public state = { icon: 'File', displayName: '', percent: 0, isLoading: true }

  public static getDerivedStateFromProps(newProps: UploadBarItemProps) {
    return {
      displayName: newProps.item.content
        ? newProps.item.content.DisplayName
        : (newProps.item.createdContent && newProps.item.createdContent.Name) ||
          (newProps.item.file && newProps.item.file.name) ||
          '..',
      icon: icons[newProps.item.content && newProps.item.content.Icon ? newProps.item.content.Icon : 'File'],
      percent:
        (newProps.item &&
          newProps.item.uploadedChunks &&
          newProps.item.chunkCount &&
          (newProps.item.uploadedChunks / newProps.item.chunkCount) * 100) ||
        0,
      isLoading: newProps.item.error || (newProps.item.completed && newProps.item.content) ? false : true,
    }
  }

  private onRemoveItem() {
    this.props.remove(this.props.item)
  }

  public shouldComponentUpdate(nextProps: UploadBarItemProps, nextState: UploadBarItemState) {
    return (
      this.props.item.error === nextProps.item.error ||
      JSON.stringify(nextState) === JSON.stringify(this.state) ||
      false
    )
  }

  public render() {
    return (
      <ListItem
        style={{
          padding: this.props.isMobile ? undefined : '.3em',
          opacity: this.state.isLoading ? 0.65 : 1,
          boxShadow: '0px -2px 0px #ddd',
        }}>
        <ListItemIcon style={{ marginRight: '-.5em' }}>
          <Icon type={iconType.materialui} style={{ color: theme.palette.secondary.main }} iconName={this.state.icon} />
        </ListItemIcon>
        <ListItemText
          primary={
            <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {this.state.displayName}
            </div>
          }
          style={{ padding: '0 25px 0 14px' }}
          title={this.state.displayName}
        />
        <ListItemSecondaryAction>
          {this.state.isLoading ? (
            <div>
              <IconButton
                style={{
                  width: '24px',
                  height: '24px',
                }}
                key="close"
                aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                color="inherit"
                onClick={() => this.onRemoveItem()}>
                <Icon
                  type={iconType.materialui}
                  iconName="close"
                  style={{ width: '15px', height: '15px' }}
                  color="primary"
                />
              </IconButton>
            </div>
          ) : null}
          {this.props.item.error ? (
            <Icon type={iconType.materialui} iconName="error" color="error" style={{ verticalAlign: 'middle' }} />
          ) : null}
          {!this.state.isLoading && !this.props.item.error ? (
            <Icon
              type={iconType.materialui}
              iconName="check_circle"
              color="secondary"
              style={{ verticalAlign: 'middle' }}
            />
          ) : null}
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}
