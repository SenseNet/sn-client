import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import AppBarLogo from './AppBarLogo'
import { QuickSearch } from './QuickSearch'
import UserActionMenu from './UserActionMenu'

const styles = {
    appBar: {
        background: '#4cc9f2',
        borderBottom: 'solid 1px #f5f5f5',
        zIndex: 1210,
        height: 48,
    },
}

class Header extends React.Component<{}, {}> {
    public render() {
        return (
            <AppBar position="absolute" style={styles.appBar}>
                <Toolbar style={{ minHeight: 48, padding: '0px 10px' }}>
                    <AppBarLogo />
                    <QuickSearch />
                    <UserActionMenu />
                </Toolbar>
            </AppBar>
        )
    }
}

export default Header
