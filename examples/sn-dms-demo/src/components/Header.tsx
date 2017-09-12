import * as React from 'react'
import { DMSReducers } from '../Reducers'
import { connect } from 'react-redux';
import { Actions } from 'sn-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserPanel from '../components/UserPanel'
import UserActionMenu from '../components/UserActionMenu'


const styles = {
    menuIcon: {
        color: '#fff'
    }
}

interface IHeaderProps {
    loggedinUser
}

class Header extends React.Component<IHeaderProps, {}>{
    render() {
        return (
            <AppBar position='static'>
                <Toolbar>
                    <IconButton style={styles.menuIcon} aria-label='Menu'>
                        <MenuIcon />
                    </IconButton>
                    <AppBarLogo history />
                    <QuickSearch />
                    <UserPanel user={this.props.loggedinUser} />
                    <UserActionMenu user={this.props.loggedinUser} />
                </Toolbar>
            </AppBar>
        )
    }
}


const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet)
    }
}

export default connect(mapStateToProps, {})(Header);