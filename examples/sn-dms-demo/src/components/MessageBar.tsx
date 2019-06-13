import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '@material-ui/core/styles/withStyles'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import groupBy from 'lodash.groupby'
import { LogEntry, readLogEntries } from '../store/actionlog/actions'
import { rootStateType } from '../store/rootReducer'

const styles = {
  window: {
    left: 14,
    bottom: 14,
  },
  windowMobile: {},
  messagebar: {
    background: '#666666',
    padding: '0px 14px',
    fontFamily: 'Raleway Medium',
    fontSize: 15,
  },
  messagebarMobile: {
    background: '#fff',
    padding: '0px 14px',
    fontFamily: 'Raleway Medium',
    fontSize: 15,
    color: '#000',
  },
  messages: {
    margin: 0,
    WebkitPaddingStart: 0,
  },
  message: {
    listStyleType: 'none',
    padding: 0,
    cursor: 'pointer',
  },
}

interface MessageSegmentType {
  key: string
  logEntries: LogEntry[]
  message: string
  visible: boolean
  verbosity: 'error' | 'info'
}

interface MessageBarState {
  digestedMessageEntries: MessageSegmentType[]
}

const mapStateToProps = (state: rootStateType) => {
  return {
    entries: state.dms.log.entries,
  }
}

const mapDispatchToProps = {
  read: readLogEntries,
}

class MessageBar extends React.Component<
  { classes: any } & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  MessageBarState
> {
  public state: MessageBarState = {
    digestedMessageEntries: [],
  }

  public closeMessageBar = (entry: { logEntries: LogEntry[]; message: string }, reason: string) => {
    if (reason !== 'clickaway') {
      this.props.read(entry.logEntries)
    }
  }

  public static getDerivedStateFromProps(newProps: MessageBar['props'], lastState: MessageBarState) {
    const getBulkMessageKey = (e: LogEntry) =>
      e.messageEntry && e.messageEntry.bulkMessage && e.messageEntry.bulkMessage

    const grouped = groupBy(newProps.entries.filter(e => e.messageEntry), getBulkMessageKey)
    const msgSegments = [...lastState.digestedMessageEntries]
    for (const type in grouped) {
      if (grouped[type]) {
        const groupedEntries = grouped[type]
        const unreadEntries = groupedEntries.filter(e => e.unread)
        const verbosity = groupedEntries.find(e => (e.messageEntry as any).verbosity === 'error') ? 'error' : 'info'

        let newSegment!: MessageSegmentType

        if (unreadEntries.length < 2) {
          newSegment = {
            message: (groupedEntries[0].messageEntry as any).message,
            logEntries: [...groupedEntries],
            visible: unreadEntries.length > 0,
            verbosity,
            key: type,
          }
        } else {
          newSegment = {
            logEntries: groupedEntries,
            message: type.replace('{count}', unreadEntries.length.toString()),
            visible: unreadEntries.length > 0,
            verbosity,
            key: type,
          }
        }

        const existing = msgSegments.findIndex(msg => msg.key === type)
        if (existing > -1) {
          msgSegments[existing] = newSegment
        } else {
          msgSegments.push(newSegment)
        }
      }
    }
    return {
      digestedMessageEntries: msgSegments,
    }
  }

  public render() {
    const { classes } = this.props
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              bottom: matches ? '20px' : 0,
              left: matches ? '20px' : 0,
              position: 'fixed',
              alignItems: 'flex-start',
              zIndex: 1,
              width: matches ? undefined : '100%',
            }}>
            {this.state.digestedMessageEntries.map(message => (
              <Snackbar
                key={message.message}
                style={{
                  position: 'relative',
                  transform: 'none',
                  margin: matches ? '6px' : 0,
                  width: matches ? undefined : '100%',
                }}
                autoHideDuration={message.verbosity === 'error' ? undefined : 6000}
                open={message.visible}
                onClose={(_ev, reason) => this.closeMessageBar(message, reason)}
                className={matches ? classes.window : classes.windowMobile}
                ContentProps={{
                  classes: {
                    root: matches ? classes.messagebar : classes.messagebarMobile,
                  },
                  style: {
                    flexWrap: 'nowrap',
                  },
                }}
                message={message.message}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color={matches ? 'inherit' : 'primary'}
                    onClick={() => this.closeMessageBar(message, '')}>
                    <Icon type={iconType.materialui} iconName="close" style={{ color: matches ? '#fff' : '#333' }} />
                  </IconButton>,
                ]}
              />
            ))}
          </div>
        )}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(MessageBar))
