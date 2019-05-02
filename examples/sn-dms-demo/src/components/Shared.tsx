import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import React from 'react'

// tslint:disable-next-line:variable-name
export const Shared: React.StatelessComponent = () => {
  return (
    <AppBar position="static" style={{ background: '#fff' }}>
      <Toolbar style={{ display: 'flex', flexDirection: 'row', padding: '0 12px' }}>
        <div style={{ flex: 1, display: 'flex' }}>
          <Typography variant="h5">Shared</Typography>
        </div>
      </Toolbar>
    </AppBar>
  )
}
