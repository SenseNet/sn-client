import { Icon, iconType } from '@sensenet/icons-react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../../store/rootReducer'
import WorkspaceDropDown from './WorkspaceDropDown'

const styles = {
  button: {
    background: '#777',
    color: '#fff',
    boxShadow: '#cacaca 0px 2px 2px',
    minWidth: 60,
    borderRadius: 2,
    padding: 8,
    marginTop: 5,
  },
  activeButton: {
    background: '#016d9e',
  },
  buttonMobile: {
    color: '#fff',
    minWidth: 24,
    padding: 0,
    fontSize: 18,
    margin: '0 12px',
  },
  activeButtonMobile: {},
}

interface WorkspaceSelectorState {
  open: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    currentContent: state.dms.documentLibrary.parent,
    user: state.sensenet.session.user,
  }
}

class WorkspaceSelector extends React.Component<ReturnType<typeof mapStateToProps>, WorkspaceSelectorState> {
  public state = {
    open: false,
  }
  public handleButtonClick = (open?: boolean) => {
    this.setState({
      open: open ? false : !this.state.open,
    })
  }
  public render() {
    const { open } = this.state
    return (
      <MediaQuery minDeviceWidth={700}>
        {(matches) => {
          const iconStyle = matches
            ? open
              ? { ...styles.button, ...styles.activeButton }
              : styles.button
            : open
            ? { ...styles.buttonMobile, ...styles.activeButtonMobile }
            : styles.buttonMobile
          return (
            <ClickAwayListener onClickAway={this.handleButtonClick as any}>
              <div style={matches ? { flex: '0 1 auto' } : { flex: '0 0 auto' }}>
                <Button style={iconStyle} onClick={() => this.handleButtonClick(this.state.open)}>
                  <Icon
                    fontSize="default"
                    type={iconType.fontawesome}
                    iconName="sitemap"
                    style={{ fontSize: 18, color: '#fff' }}
                  />
                </Button>
                <WorkspaceDropDown matches={matches} open={this.state.open} closeDropDown={this.handleButtonClick} />
              </div>
            </ClickAwayListener>
          )
        }}
      </MediaQuery>
    )
  }
}

export default connect(mapStateToProps, {})(WorkspaceSelector)
