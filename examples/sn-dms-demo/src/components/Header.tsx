import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import AppBarLogo from './AppBarLogo'
import { Search } from './Search/Search'
import UserActionMenu from './UserActionMenu'

const styles = {
  appBar: {
    background: 'transparent',
    zIndex: 1210,
    height: 64,
    borderBottom: '1px solid #ddd',
  },
}

class Header extends React.Component<{}, {}> {
  public render() {
    return (
      <AppBar position="absolute" style={{ ...styles.appBar, boxShadow: 'none' }}>
        <Toolbar style={{ padding: '0px 10px', display: 'flex' }}>
          <AppBarLogo
            style={{
              width: '216px',
              flexGrow: 0,
              flexShrink: 0,
              fontSize: '1.33em',
            }}
          />
          <Search
            style={{
              flexGrow: 1,
            }}
          />
          <UserActionMenu
            style={{
              flexGrow: 0,
              flexShrink: 0,
            }}
          />
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header
