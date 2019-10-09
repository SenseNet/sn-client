import React from 'react'
import { Button, CssBaseline, Tooltip, Typography } from '@material-ui/core'
import { useRepository } from '@sensenet/hooks-react'
import snLogo from './assets/sensenet_logo_transparent.png'
import { useCurrentUser } from './hooks/use-current-user'

/**
 * The main entry point of your app. You can start h@cking from here ;)
 */
export const App: React.FunctionComponent = () => {
  const usr = useCurrentUser()
  const repo = useRepository()
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${snLogo})`,
        backgroundSize: 'auto',
      }}>
      <CssBaseline />
      <Typography variant="h3" gutterBottom>
        Hello, {usr.Name} 😎
      </Typography>
      <Tooltip title="Return to the Login screen and select another repository">
        <Button variant="outlined" color="primary" onClick={() => repo.authentication.logout()}>
          Log out 🚪
        </Button>
      </Tooltip>
    </div>
  )
}
