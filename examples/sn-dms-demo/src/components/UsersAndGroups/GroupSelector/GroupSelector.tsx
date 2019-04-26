import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Icon } from '@sensenet/icons-react'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { resources } from '../../../assets/resources'
import { rootStateType } from '../../../store/rootReducer'
import { clearSelection } from '../../../store/usersandgroups/actions'
import GroupDropDown from './GroupDropDown'

const styles = {
  button: {
    fontSize: 15,
    fontFamily: 'Raleway SemiBold',
  },
  buttonRaised: {
    fontSize: 14,
    fontFamily: 'Raleway ExtraBold',
    marginRight: 10,
  },
  activeButtonMobile: {},
  icon: {
    marginRight: 5,
  },
}

interface GroupSelectorState {
  open: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    selectedItems: state.dms.usersAndGroups.user.selected,
  }
}

const mapDispatchToProps = {
  clearSelection,
}

class GroupSelector extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  GroupSelectorState
> {
  public state = {
    open: false,
  }
  constructor(props: GroupSelector['props']) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  public handleButtonClick = (open: boolean, away: boolean) => {
    if (!away) {
      this.props.clearSelection()
    }
    this.setState({
      open: away ? false : open ? false : !this.state.open,
    })
  }
  public render() {
    const { open } = this.state
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return (
            <ClickAwayListener onClickAway={() => this.handleButtonClick(false, true)}>
              <div style={{ display: 'inline' }}>
                <Button
                  disabled={this.props.selectedItems.length > 0 ? false : true}
                  variant="contained"
                  color="primary"
                  style={{ ...styles.button, ...styles.buttonRaised }}
                  onClick={() => this.handleButtonClick(open, false)}>
                  <Icon iconName="add" style={{ ...styles.icon, ...{ color: '#fff' } }} />
                  {resources.ADD_TO_GROUP}
                </Button>
                <GroupDropDown
                  matches={matches}
                  open={open}
                  closeDropDown={() => this.handleButtonClick(false, false)}
                />
              </div>
            </ClickAwayListener>
          )
        }}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSelector)
