import * as React from 'react'
import { DMSReducers } from '../Reducers'
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserPanel from '../components/UserPanel'


const styles = {
    menuIcon: {
        color: '#fff'
    }
}

class Header extends React.Component<{loggedinUser}, {}>{
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

export default connect(
    mapStateToProps,
    {
    })(Header);