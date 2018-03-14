import { Actions } from '@sensenet/redux'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSReducers from '../Reducers'
import UserPanel from './UserPanel'

interface UserActionMenu {
    loggedinUser,
    logout
}

import { resources } from '../assets/resources'

const actions = [
    {
        name: 'Logout',
        displayName: resources.LOGOUT,
    },
]

const styles = {
    actionmenuContainer: {
        flex: 1,
    },
    menuIcon: {
        color: '#fff',
        width: 80,
    },
    menuIconMobile: {
        width: 'auto',
        marginLeft: '16px',
    },
    arrowButton: {
        marginLeft: 0,
    },
    menu: {
        marginTop: 40,
    },
}

class UserActionMenu extends React.Component<UserActionMenu, { anchorEl, open, selectedIndex }> {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            open: false,
            selectedIndex: 1,
        }
    }
    public handleClick = (event) => {
        this.setState({ open: true, anchorEl: event.currentTarget })
    }

    public handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, open: false })
        const actionName = actions[index].name.toLocaleLowerCase()
        const action = this.props[actionName]
        action()
    }

    public handleRequestClose = () => {
        this.setState({ open: false })
    }
    public render() {
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <div style={matches ? null : styles.actionmenuContainer}>
                        <IconButton
                            aria-label={resources.OPEN_MENU}
                            aria-owns={this.state.open ? 'long-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            style={matches ? styles.menuIcon : { ...styles.menuIcon, ...styles.menuIconMobile }}
                        >
                            <UserPanel user={this.props.loggedinUser} />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            anchorEl={this.state.anchorEl}
                            open={this.state.open}
                            onClose={this.handleRequestClose}
                            style={styles.menu}
                        >
                            {actions.map((action, index) => (
                                <MenuItem
                                    key={action.name}
                                    selected={index === this.state.selectedIndex}
                                    onClick={(event) => this.handleMenuItemClick(event, index)}>
                                    {action.displayName}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                }}
            </MediaQuery>
        )
    }
}

const userLogout = Actions.userLogout

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    logout: userLogout,
})(UserActionMenu)
