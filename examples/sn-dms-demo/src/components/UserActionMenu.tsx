import * as React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';

interface IUserActionMenu {
    loggedinUser,
    logout
}

const actions = [
    {
        name: 'Logout',
        displayName: 'Logout',
    }
];

const styles = {
    menuIcon: {
        color: '#fff'
    }
}

const ITEM_HEIGHT = 48;

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
            <div>
                <IconButton
                    aria-label='Open menu'
                    aria-owns={this.state.open ? 'long-menu' : null}
                    aria-haspopup='true'
                    onClick={this.handleClick}
                    style={styles.menuIcon}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id='long-menu'
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
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
        )
    }
}

const userLogout = Actions.UserLogout;

const mapStateToProps = (state, match) => {
    return {

    }
}

export default connect(mapStateToProps, {
    logout: userLogout
})(UserActionMenu);