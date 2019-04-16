import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { Icon } from '@sensenet/icons-react'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { resources } from '../../../assets/resources'
import { rootStateType } from '../../../store/rootReducer'
import { clearUserSelection } from '../../../store/usersandgroups/actions'
import UserDropDown from './UserDropDown'

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

interface UserSelectorState {
  open: boolean
}

const mapStateToProps = (state: rootStateType) => {
  return {
    selected: state.dms.usersAndGroups.group.selected,
    allowedChildTypes: state.dms.usersAndGroups.allowedTypes,
  }
}

const mapDispatchToProps = {
  clearUserSelection,
}

class UserSelector extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  UserSelectorState
> {
  public state = {
    open: false,
  }
  constructor(props: UserSelector['props']) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  public handleButtonClick = (open: boolean, away: boolean) => {
    if (!away) {
      this.props.clearUserSelection()
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
                  disabled={this.props.selected.length > 0 && this.props.selected[0].Type === 'Group' ? false : true}
                  variant="contained"
                  color="primary"
                  style={{ ...styles.button, ...styles.buttonRaised }}
                  onClick={() => this.handleButtonClick(open, false)}>
                  <Icon iconName="add" style={{ ...styles.icon, ...{ color: '#fff' } }} />
                  {resources.ADD_USER_TO_GROUP}
                </Button>
                <UserDropDown
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
)(UserSelector)
