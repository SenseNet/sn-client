import * as React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import MediaQuery from 'react-responsive';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import UserPanel from './UserPanel'

interface IUserActionMenu {
    loggedinUser,
    logout
}

import { resources } from '../assets/resources'

const actions = [
    {
        name: 'Logout',
        displayName: resources.LOGOUT,
    }
];

const styles = {
    actionmenuContainer: {
        flex: 1
    },
    menuIcon: {
        color: '#fff',
        width: 80
    },
    menuIconMobile: {
        width: 'auto',
        marginLeft: '16px'
    },
    arrowButton: {
        marginLeft: 0
    },
    menu: {
        marginTop: 40
    }
}

class UserActionMenu extends React.Component<IUserActionMenu, { anchorEl, open, selectedIndex }>{
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            open: false,
            selectedIndex: 1
        }
    }
    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, open: false });
        let actionName = actions[index].name.toLocaleLowerCase();
        const action = this.props[actionName]
        action()
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };
    render() {
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
                            onRequestClose={this.handleRequestClose}
                            style={styles.menu}
                        >
                            {actions.map((action, index) => (
                                <MenuItem
                                    key={action.name}
                                    selected={index === this.state.selectedIndex}
                                    onClick={event => this.handleMenuItemClick(event, index)}>
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

const userLogout = Actions.UserLogout;

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet)
    }
}

export default connect(mapStateToProps, {
    logout: userLogout
})(UserActionMenu);