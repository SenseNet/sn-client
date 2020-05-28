import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import React, { CSSProperties } from 'react'

/**
 * Represents a Toolbar component in an AppBar
 */
export const LayoutAppBar: React.FunctionComponent<{ style?: CSSProperties }> = (props) => (
  <AppBar position="sticky" style={{ position: 'relative', zIndex: 1, ...props.style }}>
    <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>{props.children}</Toolbar>
  </AppBar>
)
