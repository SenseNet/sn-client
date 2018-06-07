import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import AppBarLogo from '../components/AppBarLogo'
import { QuickSearch } from '../components/QuickSearch'
import UserActionMenu from '../components/UserActionMenu'

class Header extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}}>
                <Toolbar>
                    <AppBarLogo history />
                    <QuickSearch />
                    <UserActionMenu />
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header
