import * as React from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserActionMenu from '../components/UserActionMenu'

class Header extends React.Component<{}, {}>{
    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <AppBarLogo history />
                    <QuickSearch />
                    <UserActionMenu />
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header;
