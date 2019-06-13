import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import { UploadProgressInfo } from '@sensenet/client-core'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import MediaQuery from 'react-responsive'
import { ExtendedUploadProgressInfo } from '../../Actions'
import { resources } from '../../assets/resources'
import { theme } from '../../assets/theme'
import { UploadBarItem } from './UploadBarItem'

export interface UploadBarProps {
  items: ExtendedUploadProgressInfo[]
  isOpened: boolean
  close: () => any
  removeItem: (item: UploadProgressInfo) => any
  handleSelectItem?: (item: UploadProgressInfo) => void
}

export interface UploadBarState {
  overallProgressPercent: number
  isUploadInProgress: boolean
}

export class UploadBar extends React.Component<UploadBarProps, UploadBarState> {
  public state: UploadBarState = {
    overallProgressPercent: 0,
    isUploadInProgress: false,
  }

  public static getDerivedStateFromProps(newProps: UploadBarProps) {
    if (newProps.items && newProps.items.length) {
      const overallProgressPercent = newProps.items.reduce((acc, val) => {
        return {
          guid: '',
          file: null as any,
          chunkCount: (acc.chunkCount || 0) + (val.chunkCount || 1),
          uploadedChunks: (acc.uploadedChunks || 0) + (val.error ? val.chunkCount || 1 : val.uploadedChunks || 0),
          completed: acc.completed && (val.error || (val.completed && val.content)) ? true : false,
          content: null as any,
          createdContent: null as any,
        }
      })
      return {
        isUploadInProgress: !overallProgressPercent.completed,
        overallProgressPercent:
          overallProgressPercent.uploadedChunks && overallProgressPercent.chunkCount
            ? overallProgressPercent.completed
              ? 0
              : (overallProgressPercent.uploadedChunks / overallProgressPercent.chunkCount) * 100
            : 0,
      }
    }
    return {
      isUploadInProgress: false,
      overallProgressPercent: 0,
    }
  }

  private onClose() {
    this.props.close()
  }

  private onRemoveItem(item: UploadProgressInfo) {
    this.props.removeItem(item)
  }

  public render() {
    const innerContent = (
      <MediaQuery minWidth={700}>
        {matches => (
          <Paper style={{ maxWidth: '100%', width: matches ? undefined : '100%' }}>
            <List
              dense={matches}
              subheader={
                <ListSubheader
                  style={{
                    backgroundColor: matches ? theme.palette.text.primary : theme.palette.background.paper,
                    color: matches ? theme.palette.primary.contrastText : 'black !important',
                    padding: 0,
                    textIndent: '.5em',
                    lineHeight: '2em',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: matches ? '3px 1px 3px 4px' : '13px 1px 13px 13px',
                    }}>
                    <div
                      style={{
                        color: matches ? '#dedede' : 'black',
                        padding: matches ? '3px' : '',
                        fontSize: matches ? undefined : '1.25em',
                      }}>
                      {resources.UPLOAD_BAR_TITLE}
                    </div>
                    <IconButton
                      style={{
                        width: '32px',
                        height: '32px',
                      }}
                      key="close"
                      aria-label={resources.UPLOAD_BAR_CLOSE_TITLE}
                      color="inherit"
                      onClick={() => this.onClose()}>
                      <Icon type={iconType.materialui} iconName="close" style={{ width: '25px', height: '24px' }} />
                    </IconButton>
                  </div>
                  {this.state.isUploadInProgress ? (
                    <LinearProgress
                      variant="determinate"
                      color="secondary"
                      style={{ backgroundColor: '#C5E1A4' }}
                      value={this.state.overallProgressPercent}
                    />
                  ) : null}
                </ListSubheader>
              }
              style={{ maxHeight: 400, minWidth: 300, maxWidth: 600, overflowY: 'auto', paddingBottom: 0 }}>
              {this.props.items &&
                this.props.items
                  .filter(item => item.visible)
                  .map(item => (
                    <UploadBarItem remove={i => this.onRemoveItem(i)} key={item.guid} item={item} isMobile={!matches} />
                  ))}
            </List>
          </Paper>
        )}
      </MediaQuery>
    )

    return (
      <MediaQuery minWidth={700}>
        {matches =>
          matches ? (
            <Snackbar
              open={this.props.isOpened}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              title={resources.UPLOAD_BAR_TITLE}>
              {innerContent}
            </Snackbar>
          ) : (
            <Drawer open={this.props.isOpened} anchor="bottom" title={resources.UPLOAD_BAR_TITLE}>
              {innerContent}
            </Drawer>
          )
        }
      </MediaQuery>
    )
  }
}
