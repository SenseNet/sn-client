import * as React from 'react'
import { connect } from 'react-redux';
import { Actions } from 'sn-redux';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import { MenuIcon } from 'material-ui-icons/Menu';
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserActionMenu from '../components/UserActionMenu'


const styles = {
    menuIcon: {
        color: '#fff'
    }
}

class Header extends React.Component<{}, {}>{
    render() {
        return (
            <AppBar position='static'>
                <Toolbar>
                    <IconButton style={styles.menuIcon} aria-label='Menu'>
                        <MenuIcon />
                    </IconButton>
                    <AppBarLogo history />
                    <QuickSearch />
                    <UserActionMenu />
                </Toolbar>
            </AppBar>
        )
    }
}


export default Header;